import { App, Stack } from 'aws-cdk-lib';
import * as grafana from 'aws-cdk-lib/aws-grafana';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new App();
const stack = new Stack(app, 'grafana-vpc-integ');

// Create VPC
const vpc = new ec2.Vpc(stack, 'GrafanaVPC', {
  maxAzs: 2,
});

// Create security group
const securityGroup = new ec2.SecurityGroup(stack, 'GrafanaSecurityGroup', {
  vpc,
  description: 'Security group for Grafana workspace',
  allowAllOutbound: true,
});

// Create a Grafana workspace with VPC configuration
new grafana.Workspace(stack, 'VpcWorkspace', {
  authenticationProviders: [grafana.AuthenticationProviderType.AWS_SSO],
  permissionType: grafana.PermissionType.SERVICE_MANAGED,
  description: 'VPC-connected Grafana Workspace',
  name: 'vpc-workspace',
  vpcConfiguration: {
    securityGroupIds: [securityGroup.securityGroupId],
    subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
  },
});

app.synth();
