window.config = {
  role:           'arn:aws:iam::010616021751:role/access-to-s3-per-user',  // AWS role arn
  principal:      'arn:aws:iam::010616021751:saml-provider/auth0-provider', // AWS saml provider arn
  domain:         'matugit.auth0.com',                // Auth0 domain
  clientID:       'bm70oLevwEM6PjICBnczyNySHjFkDcNR', // Auth0 app client id
  targetClientId: 'jAbmUzhI7KZ5cWG8gsyT3IaTg0dS9KZV' // Auth0 AWS API client id
};
