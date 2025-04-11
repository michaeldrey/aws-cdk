import { Template, Match } from '../../assertions';
import { Stack } from '../../core';
import { Workspace, NetworkAccessControlProperty, SamlConfigurationProperty, VpcConfigurationProperty, permissionTypes, authenticationProviderTypes, accountAccessType, grafanaVersionTypes } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});


describe('grafana workspace', () => {
  describe('When creating a grafana workspace', () => {
    test('with only required properties set, it correctly sets default properties', () => {
      // GIVEN
      new Workspace(stack, 'Workspace', {
        accountAccessType: accountAccessType.CURRENT_ACCOUNT,
        authenticationProviders: [authenticationProviderTypes.SAML],
        permissionType: permissionTypes.CUSTOMER_MANAGED,
        description: "Amazon Grafana Workspace",
        grafanaVersion: grafanaVersionTypes.GRAFANA_10_4,
        name: "AmazonGrafanaWorkspace",
        roleArn: "AmazonGrafanaWorkspaceIAMRole",
        samlConfiguration: {
          idpMetadata:{
            xml: "<md:EntityDescriptor xmlns:md='urn:oasis:names:tc:SAML:2.0:metadata' entityID='entityId'>DATA</md:EntityDescriptor>"
          },
          assertionAttributes: {
            name: "displayName",
            login: "login",
            email: "email",
            groups: "group",
            role: "role",
            org: "org"
          },
          roleValues:{
            editor: ['editor1'],
            admin: ['admin1']
          },
          allowedOrganizations: ["org1"],
          loginValidityDuration: 60
        }
      })
    });
      // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Grafana::Workspace', {
      AccountAccessType: "CURRENT_ACCOUNT",
      Name: "AmazonGrafanaWorkspace",
      Description: "Amazon Grafana Workspace",
      AuthenticationProviders: ["SAML"],
      PermissionType: "CUSTOMER_MANAGED",
      GrafanaVersion: "10.4",
      RoleArn: {
          "Fn::GetAtt": [
              "AmazonGrafanaWorkspaceIAMRole",
              "Arn"
          ]
      },
      SamlConfiguration: {
          IdpMetadata: {
              "Xml": "<md:EntityDescriptor xmlns:md='urn:oasis:names:tc:SAML:2.0:metadata' entityID='entityId'>DATA</md:EntityDescriptor>"
          },
          AssertionAttributes: {
              "Name": "displayName",
              "Login": "login",
              "Email": "email",
              "Groups": "group",
              "Role": "role",
              "Org": "org"
          },
          RoleValues: {
              Editor: ["editor1"],
              Admin: ["admin1"]
          },
          AllowedOrganizations: ["org1"],
          LoginValidityDuration: 60
      }
    });
  });
});
// test('default configuration set', () => {
//   new Workspace(stack, 'Workspace', {
//     accountAccessType: 'accountAccessType',
//     authenticationProviders: [authenticationProviderTypes.AWS_SSO],
//     permissionType: permissionTypes.SERVICE_MANAGED,
//   });

// });

// test('all configuration set', () => {
//   new Workspace(stack, 'Workspace', {
//     accountAccessType: 'accountAccessType',
//     authenticationProviders: ['authenticationProviders'],
//     permissionType: 'permissionType',
//     clientToken: "abc1234",
//     dataSources: props.dataSources,
//     description: props.description,
//     grafanaVersion: props.grafanaVersion,
//     name: props.name,
//     networkAccessControl: props.networkAccessControl,
//     notificationDestinations: props.notificationDestinations,
//     organizationalUnits: props.organizationalUnits,
//     organizationRoleName: props.organizationRoleName,
//     pluginAdminEnabled: props.pluginAdminEnabled,
//     roleArn: props.roleArn,
//     samlConfiguration: props.samlConfiguration,
//     stackSetName: props.stackSetName,
//     vpcConfiguration: props.vpcConfiguration,
//   });

//   Template.fromStack(stack).hasResourceProperties('AWS::Grafana::Workspace', {
//     Name: Match.absent(),
//   });
// });

