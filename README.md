# LTI-Bridge

Required environment variables:
- LTI_CONSUMER_KEY: choose a consumer key
- LTI_SECRET: choose a secret
- LTI_LAUNCH_URL: this is the full (https://.../api/LtiLaunch) URL endpoint where this is deployed

## EZProxy Integration
- BRIDGE_INTEGRATION: "EZProxy"
- EZPROXY_BASE_URL: should match up with http://ezproxy.yourlib.org:2048/ as per: https://help.oclc.org/Library_Management/EZproxy/Authenticate_users/EZproxy_authentication_methods/Ticket_authentication
- EZPROXY_SECRET: should match up with ::Ticket entry in user.txt
