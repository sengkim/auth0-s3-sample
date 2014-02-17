## Backend-less dropbox website clone

This sample uses Auth0 and its integration with AWS APIs (S3, SES, DynamoDB, EC2, etc.) in combination with IAM policies.

Demo: <http://auth0.github.io/auth0-s3-sample>

The key is to obtain the AWS token calling the `/delegation` API from Auth0 (look at `get_aws_token` on [files.js](/js/files.js)).

## AWS IAM Policies

These two statements in this IAM policy will allow everything on the "user" folder and allow listing bucket with prefix condition based on user id

```
{
  "Version": "2012-10-17",
  "Statement": [{
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