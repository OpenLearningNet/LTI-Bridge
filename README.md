# LTI-Bridge

Required environment variables:
- LTI_LAUNCH_URL: this is the full (https://.../api/LtiLaunch) URL endpoint where this is deployed
- CONSUMERS: JSON of the form
```
{
  "Consumer Key": {
    "integration": "EZProxy",
    "secret": "SECRET KEY",
    "config": {
      baseUrl: "http://ezproxy.yourlib.org:2048",
      secret": "EZProxy SECRET"
    }
  }
}
```

## EZProxy Integration Config
- baseUrl: should match up with http://ezproxy.yourlib.org:2048 as per: https://help.oclc.org/Library_Management/EZproxy/Authenticate_users/EZproxy_authentication_methods/Ticket_authentication
- secret: should match up with ::Ticket entry in user.txt
