
## AWS IAM Policies

### Allow do everything for the "user" folder

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
   }]
}
```

### Allow listing bucket where key starts with "user"

```
{
  "Statement": [
    {
      "Sid": "AllowListBucketIfSpecificPrefixIsIncludedInRequest",
      "Action": ["s3:ListBucket"],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::YOUR_BUCKET"],
      "Condition":{  "StringEquals": {"s3:prefix":["dropboxclone/${saml:sub}"] }
       }
    }
  ]
}
```