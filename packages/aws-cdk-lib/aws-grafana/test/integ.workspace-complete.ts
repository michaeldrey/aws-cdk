import { App, Stack } from 'aws-cdk-lib';
import * as grafana from 'aws-cdk-lib/aws-grafana';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'grafana-complete-integ');

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

// Create IAM role for Grafana
const role = new iam.Role(stack, 'GrafanaWorkspaceRole', {
  assumedBy: new iam.ServicePrincipal('grafana.amazonaws.com'),
  description: 'IAM role for Grafana workspace',
});

role.addManagedPolicy(
  iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGrafanaAccountAdministrator'),
);

// Create network access control configuration
const networkAccess: grafana.NetworkAccessControlProperty = {
  prefixListIds: [],
  vpceIds: [],
};

// Create a complete Grafana workspace with all configurations
new grafana.Workspace(stack, 'CompleteWorkspace', {
  accountAccessType: grafana.AccountAccessType.ORGANIZATION,
  authenticationProviders: [
    grafana.AuthenticationProviderType.AWS_SSO,
    grafana.AuthenticationProviderType.SAML,
  ],
  permissionType: grafana.PermissionType.CUSTOMER_MANAGED,
  clientToken: 'complete-workspace-token',
  description: 'Complete Grafana Workspace with all configurations',
  grafanaVersion: grafana.GrafanaVersion.V10_4,
  name: 'complete-workspace',
  networkAccessControl: networkAccess,
  notificationDestinations: ['SNS'],
  organizationalUnits: ['ou-1234'],
  organizationRoleName: role.roleName,
  pluginAdminEnabled: true,
  role,
  stackSetName: 'GrafanaStackSet',
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

app.synth();
