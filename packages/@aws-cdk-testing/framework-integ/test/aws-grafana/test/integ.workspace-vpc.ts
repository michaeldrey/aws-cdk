import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { AuthenticationProviderType, PermissionType, Workspace } from 'aws-cdk-lib/aws-grafana';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'grafana-vpc-integ');

const vpc = new ec2.Vpc(stack, 'GrafanaVPC', {
  maxAzs: 2,
});

const securityGroup = new ec2.SecurityGroup(stack, 'GrafanaSecurityGroup', {
  vpc,
  description: 'Security group for Grafana workspace',
  allowAllOutbound: true,
});

const role = new iam.Role(stack, 'GrafanaRole', {
  assumedBy: new iam.ServicePrincipal('grafana.amazonaws.com'),
});

new Workspace(stack, 'VpcWorkspace', {
  authenticationProviders: [AuthenticationProviderType.SAML],
  permissionType: PermissionType.CUSTOMER_MANAGED,
  description: 'VPC-connected Grafana Workspace',
  name: 'vpc-workspace',
  role,
  vpcConfiguration: {
    securityGroupIds: [securityGroup.securityGroupId],
    subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
  },
});

new IntegTest(app, 'GrafanaWorkspaceVpcTest', {
  testCases: [stack],
});
