I would like to request a DNS configuration change for our Developer Portal stage environment. We have an AWS Elastic Load Balancer set up for this environment, and we need a 
DNS entry to resolve a user-friendly domain name to this ELB address.

# DEV

We'd like to have a wildcard entry to allow subdomain traffic to route through our ingress controller.



A = dev.devo.axway.int routes to SL3RDAPP085804.pcloud.axway.int

In addition, requests from this SL3RDAPP085804.pcloud.axway.int host will need to access our internal services. jiraqa, gitlab, jira, etc

# SANDBOX

Request Description*

Map DNS Entry: sandbox.devo.axway.int to IP: 10.129.144.88
Requested Service*
DNS Entry
Required Domain*
Axway int
IP Address or Destination IP Address or FQDN*
sandbox.devo.axway.int

# STAGE
Domain Name to Resolve: stage.devo.axway.int


Target ELB Address: internal-a4d07cc23aa664050b8b80eca54e9c28-1624020908.us-west-2.elb.amazonaws.com

Required Action: Please create a CNAME record in our DNS management system that points stage.devo.axway.int to
internal-a4d07cc23aa664050b8b80eca54e9c28-1624020908.us-west-2.elb.amazonaws.com.

This will direct traffic intended for our Developer Portal stage environment to the correct AWS ELB.
# PRODUCTION
Domain Name to Resolve: devo.axway.int


Target ELB Address: internal-a450ed0fbd48c470e9aeacb7baea1a0b-506130258.us-west-2.elb.amazonaws.com

Required Action: Please create a CNAME record in our DNS management system that points devo.axway.int to
internal-a450ed0fbd48c470e9aeacb7baea1a0b-506130258.us-west-2.elb.amazonaws.com .

This will direct traffic intended for our Developer Portal stage environment to the correct AWS ELB.