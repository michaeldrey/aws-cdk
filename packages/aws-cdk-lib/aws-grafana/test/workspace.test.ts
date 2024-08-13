import { Template, Match } from '../../assertions';
import { Stack } from '../../core';
import { Workspace, NetworkAccessControlProperty, SamlConfigurationProperty, VpcConfigurationProperty } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('default configuration set', () => {
  const grafana = new Workspace(stack, 'Workspace', {
    accountAccessType: 'accountAccessType',
    authenticationProviders: ['authenticationProviders'],
    permissionType: 'permissionType',
  });
grafana.node.
  Template.fromStack(stack).hasResourceProperties('AWS::Grafana::Workspace', {
    Name: Match.absent(),
  });
});

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

