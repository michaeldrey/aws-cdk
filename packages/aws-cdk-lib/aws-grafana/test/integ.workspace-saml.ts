import { App, Stack } from 'aws-cdk-lib';
import * as grafana from 'aws-cdk-lib/aws-grafana';

const app = new App();
const stack = new Stack(app, 'grafana-saml-integ');

// Create a Grafana workspace with SAML authentication
new grafana.Workspace(stack, 'SamlWorkspace', {
  accountAccessType: grafana.AccountAccessType.CURRENT_ACCOUNT,
  authenticationProviders: [grafana.AuthenticationProviderType.SAML],
  permissionType: grafana.PermissionType.CUSTOMER_MANAGED,
  description: 'SAML-authenticated Grafana Workspace',
  name: 'saml-workspace',
  grafanaVersion: grafana.GrafanaVersion.V10_4,
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

app.synth();
