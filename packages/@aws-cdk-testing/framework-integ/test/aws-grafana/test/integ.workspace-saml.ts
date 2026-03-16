import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import {
  AuthenticationProviderType,
  GrafanaVersion,
  PermissionType,
  Workspace,
} from 'aws-cdk-lib/aws-grafana';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'grafana-saml-integ');

const role = new iam.Role(stack, 'GrafanaRole', {
  assumedBy: new iam.ServicePrincipal('grafana.amazonaws.com'),
});

new Workspace(stack, 'SamlWorkspace', {
  authenticationProviders: [AuthenticationProviderType.SAML],
  permissionType: PermissionType.CUSTOMER_MANAGED,
  description: 'SAML-authenticated Grafana Workspace',
  name: 'saml-workspace',
  grafanaVersion: GrafanaVersion.V10_4,
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
});

new IntegTest(app, 'GrafanaWorkspaceSamlTest', {
  testCases: [stack],
});
