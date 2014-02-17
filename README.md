## Backend-less dropbox website clone

This sample uses Auth0 and its integration with AWS APIs (S3, SES, DynamoDB, EC2, etc.) in combination with the powerful IAM policies.

Demo: <http://auth0.github.io/auth0-s3-sample>

1. User logs in with Auth0 (any identity provider)
2. Auth0 returns a JSON Web Token to the browser
3. The browser calls Auth0 `/delegation` endpoint to validate the token and exchange it for AWS temporal credentials
  
    auth0.getDelegationToken('AUTH0_AWS_API_CLIENT_ID', 'USER_JWT', 
                             { 
                               role: 'arn:aws:iam::account_number:role/role_name', 
                               principal: 'arn:aws:iam::account_number:saml-provider/provider_name'
                             }, function(err, result) {
                             var aws_credentials = result.Credentials; // AWS temp credentials
                           });

4. With the AWS credentials you can now call the AWS APIs and have policies using ${saml:sub} to create policies to authorize users to access a bucket, rows or columns in DynamoDB, sending an email, etc.

## AWS IAM Policies

A role needs to be created in the IAM console containing these two statements. These statements allow everything on a specific bucket path and allow listing the bucket objects with a prefix condition based on user id. This effectively creates a secure compartiment in S3 for each user.

```
{
  "Version": "2012-10-17",
  "Statement": [{
      "Sid": "AllowEverythingOnSpecificUserPath",
      "Effect": "Allow",
      "Action": [
        "*"
      ],
      "Resource": [ 
          "arn:aws:s3:::YOUR_BUCKET/dropboxclone/${saml:sub}",
          "arn:aws:s3:::YOUR_BUCKET/dropboxclone/${saml:sub}/*"]
   },
   {
      "Sid": "AllowListBucketIfSpecificPrefixIsIncludedInRequest",
      "Action": ["s3:ListBucket"],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::YOUR_BUCKET"],
      "Condition":{ 
        "StringEquals": { "s3:prefix":["dropboxclone/${saml:sub}"] }
       }
    }
  ]
}
```

## Running it locally

Install `serve` 
    
    npm install -g serve

Run it on port 1338

    serve -p 1338

