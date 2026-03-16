# Amazon Managed Grafana Construct Library

This module provides constructs for Amazon Managed Grafana workspaces.

```ts nofixture
import * as grafana from 'aws-cdk-lib/aws-grafana';
```

## Workspace

The `Workspace` construct creates an Amazon Managed Grafana workspace. A workspace is a logically isolated, high-availability Grafana server where you can create Grafana dashboards and visualizations to analyze your metrics, logs, and traces.

### Minimal Configuration

Create a workspace with SAML authentication and a customer-managed role:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';

const role = new iam.Role(this, 'GrafanaRole', {
  assumedBy: new iam.ServicePrincipal('grafana.amazonaws.com'),
});

new grafana.Workspace(this, 'Workspace', {
  authenticationProviders: [grafana.AuthenticationProviderType.SAML],
  permissionType: grafana.PermissionType.CUSTOMER_MANAGED,
  role,
});
```

By default, a workspace uses `CURRENT_ACCOUNT` access and Grafana version 10.4.

> **Note:** When using `CURRENT_ACCOUNT` access, the Grafana API requires a workspace role ARN. When using `AWS_SSO` authentication, AWS IAM Identity Center must be enabled in your account.

### Full Configuration

```ts
import * as iam from 'aws-cdk-lib/aws-iam';

const role = new iam.Role(this, 'GrafanaRole', {
  assumedBy: new iam.ServicePrincipal('grafana.amazonaws.com'),
});

new grafana.Workspace(this, 'Workspace', {
  accountAccessType: grafana.AccountAccessType.ORGANIZATION,
  authenticationProviders: [grafana.AuthenticationProviderType.SAML],
  permissionType: grafana.PermissionType.CUSTOMER_MANAGED,
  name: 'my-workspace',
  description: 'Production monitoring workspace',
  grafanaVersion: grafana.GrafanaVersion.V10_4,
  pluginAdminEnabled: true,
  role,
  organizationalUnits: ['ou-1234'],
  samlConfiguration: {
    idpMetadata: {
      url: 'https://my-idp.example.com/metadata',
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
```

### VPC Configuration

You can connect a workspace to a VPC to access private data sources:

```ts
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const vpc = new ec2.Vpc(this, 'Vpc');
const securityGroup = new ec2.SecurityGroup(this, 'SG', { vpc });

new grafana.Workspace(this, 'Workspace', {
  vpcConfiguration: {
    securityGroupIds: [securityGroup.securityGroupId],
    subnetIds: vpc.privateSubnets.map(s => s.subnetId),
  },
});
```

### Importing Existing Workspaces

You can import an existing workspace by ARN:

```ts
const workspace = grafana.Workspace.fromWorkspaceArn(
  this, 'Imported', 'arn:aws:grafana:us-east-1:123456789012:/workspaces/g-abc123',
);
```

Or by attributes:

```ts
const workspace = grafana.Workspace.fromWorkspaceAttributes(this, 'Imported', {
  workspaceId: 'g-abc123',
  workspaceEndpoint: 'https://g-abc123.grafana-workspace.us-east-1.amazonaws.com',
});
```

### Granting Access

You can grant IAM permissions on the workspace:

```ts
declare const workspace: grafana.Workspace;
declare const user: iam.IUser;

workspace.grant(user, 'grafana:DescribeWorkspace', 'grafana:UpdateWorkspace');
```
