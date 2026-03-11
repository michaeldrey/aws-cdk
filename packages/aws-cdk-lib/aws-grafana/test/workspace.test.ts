import { Template, Match } from '../../assertions';
import * as iam from '../../aws-iam';
import { Stack } from '../../core';
import {
  Workspace,
  AccountAccessType,
  AuthenticationProviderType,
  PermissionType,
  GrafanaVersion,
} from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('Grafana Workspace', () => {
  describe('creation', () => {
    test('minimal configuration with defaults', () => {
      // WHEN
      new Workspace(stack, 'Workspace');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Grafana::Workspace', {
        AccountAccessType: 'CURRENT_ACCOUNT',
        AuthenticationProviders: ['AWS_SSO'],
        PermissionType: 'SERVICE_MANAGED',
        GrafanaVersion: '10.4',
      });
    });

    test('explicit minimal configuration', () => {
      // WHEN
      new Workspace(stack, 'Workspace', {
        accountAccessType: AccountAccessType.CURRENT_ACCOUNT,
        authenticationProviders: [AuthenticationProviderType.AWS_SSO],
        permissionType: PermissionType.SERVICE_MANAGED,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Grafana::Workspace', {
        AccountAccessType: 'CURRENT_ACCOUNT',
        AuthenticationProviders: ['AWS_SSO'],
        PermissionType: 'SERVICE_MANAGED',
        GrafanaVersion: '10.4',
      });
    });

    test('complete configuration', () => {
      // GIVEN
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('grafana.amazonaws.com'),
      });

      // WHEN
      new Workspace(stack, 'Workspace', {
        accountAccessType: AccountAccessType.ORGANIZATION,
        authenticationProviders: [AuthenticationProviderType.SAML],
        permissionType: PermissionType.CUSTOMER_MANAGED,
        clientToken: 'token123',
        description: 'My Workspace',
        grafanaVersion: GrafanaVersion.V9_4,
        name: 'my-workspace',
        organizationRoleName: 'GrafanaWorkspaceRole',
        organizationalUnits: ['ou-1234'],
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
            editor: ['editor1'],
            admin: ['admin1'],
          },
          allowedOrganizations: ['org1'],
          loginValidityDuration: 60,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Grafana::Workspace', {
        AccountAccessType: 'ORGANIZATION',
        AuthenticationProviders: ['SAML'],
        PermissionType: 'CUSTOMER_MANAGED',
        ClientToken: 'token123',
        Description: 'My Workspace',
        GrafanaVersion: '9.4',
        Name: 'my-workspace',
        OrganizationRoleName: 'GrafanaWorkspaceRole',
        OrganizationalUnits: ['ou-1234'],
        PluginAdminEnabled: true,
        RoleArn: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
        StackSetName: 'GrafanaStackSet',
        SamlConfiguration: Match.objectLike({
          IdpMetadata: {
            Xml: Match.stringLikeRegexp('.*EntityDescriptor.*'),
          },
          AssertionAttributes: {
            Name: 'displayName',
            Login: 'login',
            Email: 'email',
            Groups: 'group',
            Role: 'role',
            Org: 'org',
          },
          RoleValues: {
            Editor: ['editor1'],
            Admin: ['admin1'],
          },
          AllowedOrganizations: ['org1'],
          LoginValidityDuration: 60,
        }),
      });
    });
  });

  describe('validation', () => {
    test('fails when clientToken is invalid', () => {
      expect(() => {
        new Workspace(stack, 'Workspace', {
          clientToken: '@invalid@',
        });
      }).toThrow(/clientToken must match the pattern/);
    });

    test('fails when description is too long', () => {
      expect(() => {
        new Workspace(stack, 'Workspace', {
          description: 'a'.repeat(2049),
        });
      }).toThrow(/description must be 2048 characters or fewer/);
    });

    test('fails when name is invalid', () => {
      expect(() => {
        new Workspace(stack, 'Workspace', {
          name: '@invalid@',
        });
      }).toThrow(/name must match the pattern/);
    });

    test('fails when organizationRoleName is too long', () => {
      expect(() => {
        new Workspace(stack, 'Workspace', {
          organizationRoleName: 'a'.repeat(2049),
        });
      }).toThrow(/organizationRoleName must be 2048 characters or fewer/);
    });

    test('fails when pluginAdminEnabled with Grafana 8.4', () => {
      expect(() => {
        new Workspace(stack, 'Workspace', {
          grafanaVersion: GrafanaVersion.V8_4,
          pluginAdminEnabled: true,
        });
      }).toThrow(/pluginAdminEnabled is only valid for Grafana versions 9 or newer/);
    });

    test('fails when dataSources used with CUSTOMER_MANAGED', () => {
      expect(() => {
        new Workspace(stack, 'Workspace', {
          permissionType: PermissionType.CUSTOMER_MANAGED,
          dataSources: ['cloudwatch'],
        });
      }).toThrow(/dataSources can only be used when permissionType is SERVICE_MANAGED/);
    });

    test('does not fail when dataSources used with SERVICE_MANAGED', () => {
      expect(() => {
        new Workspace(stack, 'Workspace', {
          permissionType: PermissionType.SERVICE_MANAGED,
          dataSources: ['cloudwatch'],
        });
      }).not.toThrow();
    });

    test('skips validation for unresolved tokens', () => {
      const token = stack.resolve(stack.stackName);
      expect(() => {
        new Workspace(stack, 'Workspace', {
          clientToken: stack.stackName,
          description: stack.stackName,
          name: stack.stackName,
        });
      }).not.toThrow();
    });
  });

  describe('import', () => {
    test('fromWorkspaceArn', () => {
      // WHEN
      const workspace = Workspace.fromWorkspaceArn(
        stack,
        'Imported',
        'arn:aws:grafana:us-east-1:123456789012:/workspaces/g-abc123',
      );

      // THEN
      expect(workspace.workspaceArn).toBe('arn:aws:grafana:us-east-1:123456789012:/workspaces/g-abc123');
      expect(workspace.workspaceId).toBe('g-abc123');
    });

    test('fromWorkspaceAttributes with ARN', () => {
      // WHEN
      const workspace = Workspace.fromWorkspaceAttributes(stack, 'Imported', {
        workspaceArn: 'arn:aws:grafana:us-east-1:123456789012:/workspaces/g-abc123',
        workspaceEndpoint: 'https://g-abc123.grafana-workspace.us-east-1.amazonaws.com',
      });

      // THEN
      expect(workspace.workspaceArn).toBe('arn:aws:grafana:us-east-1:123456789012:/workspaces/g-abc123');
      expect(workspace.workspaceId).toBe('g-abc123');
      expect(workspace.workspaceEndpoint).toBe('https://g-abc123.grafana-workspace.us-east-1.amazonaws.com');
    });

    test('fromWorkspaceAttributes with ID', () => {
      // WHEN
      const workspace = Workspace.fromWorkspaceAttributes(stack, 'Imported', {
        workspaceId: 'g-abc123',
        workspaceEndpoint: 'https://g-abc123.grafana-workspace.us-east-1.amazonaws.com',
      });

      // THEN
      expect(workspace.workspaceId).toBe('g-abc123');
      expect(workspace.workspaceEndpoint).toBe('https://g-abc123.grafana-workspace.us-east-1.amazonaws.com');
    });

    test('fromWorkspaceAttributes throws without ARN or ID', () => {
      expect(() => {
        Workspace.fromWorkspaceAttributes(stack, 'Imported', {
          workspaceEndpoint: 'https://g-abc123.grafana-workspace.us-east-1.amazonaws.com',
        });
      }).toThrow(/At least one of workspaceArn or workspaceId must be provided/);
    });
  });

  describe('attributes', () => {
    test('exposes expected attributes', () => {
      // WHEN
      const workspace = new Workspace(stack, 'Workspace');

      // THEN
      expect(workspace.workspaceId).toBeDefined();
      expect(workspace.workspaceArn).toBeDefined();
      expect(workspace.workspaceEndpoint).toBeDefined();
      expect(workspace.workspaceStatus).toBeDefined();
      expect(workspace.workspaceGrafanaVersion).toBeDefined();
      expect(workspace.workspaceCreationTimestamp).toBeDefined();
      expect(workspace.workspaceModificationTimestamp).toBeDefined();
      expect(workspace.workspaceSamlConfigurationStatus).toBeDefined();
      expect(workspace.workspaceSsoClientId).toBeDefined();
    });
  });

  describe('grant', () => {
    test('grant on owned workspace', () => {
      // GIVEN
      const workspace = new Workspace(stack, 'Workspace');
      const user = new iam.User(stack, 'User');

      // WHEN
      workspace.grant(user, 'grafana:DescribeWorkspace');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'grafana:DescribeWorkspace',
              Effect: 'Allow',
            },
          ],
        },
      });
    });

    test('grant on imported workspace', () => {
      // GIVEN
      const workspace = Workspace.fromWorkspaceArn(
        stack,
        'Imported',
        'arn:aws:grafana:us-east-1:123456789012:/workspaces/g-abc123',
      );
      const user = new iam.User(stack, 'User');

      // WHEN
      workspace.grant(user, 'grafana:DescribeWorkspace');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'grafana:DescribeWorkspace',
              Effect: 'Allow',
              Resource: 'arn:aws:grafana:us-east-1:123456789012:/workspaces/g-abc123',
            },
          ],
        },
      });
    });
  });
});
