import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {
  AccountAccessType,
  AuthenticationProviderType,
  GrafanaVersion,
  PermissionType,
  Workspace,
} from 'aws-cdk-lib/aws-grafana';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'grafana-complete-integ');

const vpc = new ec2.Vpc(stack, 'GrafanaVPC', {
  maxAzs: 2,
});

const securityGroup = new ec2.SecurityGroup(stack, 'GrafanaSecurityGroup', {
  vpc,
  description: 'Security group for Grafana workspace',
  allowAllOutbound: true,
});

const role = new iam.Role(stack, 'GrafanaWorkspaceRole', {
  assumedBy: new iam.ServicePrincipal('grafana.amazonaws.com'),
  description: 'IAM role for Grafana workspace',
});

new Workspace(stack, 'CompleteWorkspace', {
  accountAccessType: AccountAccessType.CURRENT_ACCOUNT,
  authenticationProviders: [AuthenticationProviderType.SAML],
  permissionType: PermissionType.CUSTOMER_MANAGED,
  clientToken: 'complete-workspace-token',
  description: 'Complete Grafana Workspace with all configurations',
  grafanaVersion: GrafanaVersion.V10_4,
  name: 'complete-workspace',
  pluginAdminEnabled: true,
  role,
  samlConfiguration: {
    idpMetadata: {
      xml: "<md:EntityDescriptor xmlns:md='urn:oasis:names:tc:SAML:2.0:metadata' entityID='entityId'>DATA</md:EntityDescriptor>",
    },
    assertionAttributes: {
      name: 'displayName',
      login: 'login',
      email: 'email',
      groups: 'group',
      role: 'role',
      org: 'org',
    },
    roleValues: {
      editor: ['editor-group'],
      admin: ['admin-group'],
    },
    allowedOrganizations: ['myorg'],
    loginValidityDuration: 60,
  },
  vpcConfiguration: {
    securityGroupIds: [securityGroup.securityGroupId],
    subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
  },
});

new IntegTest(app, 'GrafanaWorkspaceCompleteTest', {
  testCases: [stack],
});
