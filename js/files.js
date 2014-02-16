/**
 * Gets the AWS temporal credentials using Auth0 delegation endpoint
 *
 * @param {Object}  role: AWS role arn         
 *                  principal: AWS saml provider arn    
 *                  domain: Auth0 domain (foo.auth0.com)
 *                  clientID: Auth0 application Client ID
 *                  targetClientId: Auth0 AWS API Client ID
 */
function get_aws_token(options, callback) {
  var auth0 = new Auth0({
    domain:         options.domain,
    clientID:       options.clientID,
    callbackURL:    'dummy'
  });

  auth0.getDelegationToken(options.targetClientId, user.get().id_token, { role: options.role, principal: options.principal }, callback);
}

/**
 * Refresh the file list and bind the actions
 *
 * @param {Bucket} bucket
 */
function refresh_list(bucket) {
  list_files(bucket, function(err) {
    if (err) console.log(err);

    bind_actions(bucket);
  }); 
}

/**
 * List files from a bucket
 *
 * @param {Bucket} bucket
 * @param {function} callback
 */
function list_files(bucket, callback) {
  bucket.listObjects({Prefix: folder_prefix + user.get().profile.user_id}, function(err, data) { 
    if (err) return callback(err);
    var files = [];
    for (var i in data.Contents) {
      files.push({
        name: data.Contents[i].Key.replace(folder_prefix + user.get().profile.user_id + '/', ''),
        date: moment(new Date(data.Contents[i].LastModified)).fromNow(),
        key : data.Contents[i].Key
      });
    }

    var source   = $("#files-template").html();
    var template = Handlebars.compile(source);

    $('.files').html(template({ files: files }));
    callback();
  });  
}

/**
 * Remove file from bucket
 *
 * @param {Bucket} bucket
 * @param {function} callback
 */
function remove_file(bucket) {
  return function() {
    bucket.deleteObject({Key: $(this).data('key')}, function(err) {
      if (err) console.log(err);
      refresh_list(bucket);  
    });
  }
}

/**
 * Creates an AWS signed URL
 *
 * @param {Bucket} bucket
 * @param {ZeroClipboard} clipboard object
 * @param {Object} options: { clipboard: true/false }
 */
function share_file(bucket, client, options) {
  return function() {
    bucket.getSignedUrl('getObject', { Expires: 24 * 60, Key: $(this).data('key') }, function(err, url) {
      if (!options.clipboard) return prompt('Copy this link', url);
      client.setText(url);
    });
  }
}

/**
 * Uploads a file to the bucket specified using private ACL
 *
 * @param {Bucket} bucket
 * @param {HTMLInputFile} the file to upload
 */
function upload_file(bucket, file, callback) {
  var objKey = folder_prefix + user.get().profile.user_id + '/' + file.name; 
  var params = {Key: objKey, ContentType: file.type, Body: file, ACL: 'private'}; 
  bucket.putObject(params, function (err, data) { 
    if (err) callback(err);
    callback();
  });
}

function bind_actions(bucket) {
  $('.share-link').unbind('click');
  $('.remove').unbind('click');

  ZeroClipboard.config( { moviePath: "http://cdnjs.cloudflare.com/ajax/libs/zeroclipboard/1.3.2/ZeroClipboard.swf" } );
  var client = new ZeroClipboard($('.share-link'));
  client.on('complete', function(client, args) {
    console.log('Link copied to your clipboard!')
  });

  client.on('dataRequested', share_file(bucket, client, {clipboard: true}));
  $('.share-link').on('click', share_file(bucket, client, {clipboard: false}));
  $('.remove').on('click', remove_file(bucket));
}

function bind_upload(bucket) {
  $('.upload-button').on('click', function() {
    $('.upload-file').click();
  }); 

  $('.upload-file').on('change', function() {
    var file = this.files[0];
    if (file) upload_file(bucket, file, function(err) {
      if (err) console.log('error uploading file');
      refresh_list(bucket)
    });
  });
}