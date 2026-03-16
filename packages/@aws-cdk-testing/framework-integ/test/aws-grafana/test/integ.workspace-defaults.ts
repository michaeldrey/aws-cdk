import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import {
  AuthenticationProviderType,
  PermissionType,
  Workspace,
} from 'aws-cdk-lib/aws-grafana';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'grafana-defaults-integ');

const role = new iam.Role(stack, 'GrafanaRole', {
  assumedBy: new iam.ServicePrincipal('grafana.amazonaws.com'),
});

new Workspace(stack, 'DefaultWorkspace', {
  authenticationProviders: [AuthenticationProviderType.SAML],
  permissionType: PermissionType.CUSTOMER_MANAGED,
  role,
});

new IntegTest(app, 'GrafanaWorkspaceDefaultsTest', {
  testCases: [stack],
});
