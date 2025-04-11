import { Construct } from 'constructs';
import { CfnWorkspace } from './grafana.generated';
import { NetworkAccessControlProperty } from './networkAccessControlProperty';
import { SamlConfigurationProperty } from './samlConfigurationProperty';
import { VpcConfigurationProperty } from './vpcConfigurationProperty';
import { IResolvable, IResource, Resource } from '../../core';

export enum accountAccessType {
  /**
   * Current Account
   */
  CURRENT_ACCOUNT = 'CURRENT_ACCOUNT',

  /**
   * Organization
   */
  ORGANIZATION = 'ORGANIZATION',
}

export enum permissionTypes {
  /**
   * Customer Managed
   */
  CUSTOMER_MANAGED = 'CUSTOMER_MANAGED',

  /**
   * Service Managed
   */
  SERVICE_MANAGED = 'SERVICE_MANAGED',
}

export enum authenticationProviderTypes {
  /**
   * Amazon SSO
   */
  AWS_SSO = 'AWS_SSO',

  /**
   * Amazon SAML
   */
  SAML = 'SAML',
}

export enum grafanaVersionTypes {
  /**
   * Grafana 8.4
   */
  GRAFANA_8_4 = '8.4',
  /**
   * Grafana 9.4
   */
  GRAFANA_9_4 = '9.4',
  /**
   * Grafana 10.4
   */
  GRAFANA_10_4 = '10.4',
}

/**
 * Construction properties for a Grafana Workspace.
 */
export interface IWorkspaceProps extends IResource {
  /**
   * The version of the workspace.
   *
   * @attribute
   */
  readonly workspaceVersion: string;
  /**
   * The name of the workspace.
   *
   * @attribute
   */
  readonly workspaceName: string;

}

export interface WorkspaceProps {
  /**
   * Specifies whether the workspace can access AWS resources in this AWS account only, or whether it can also access AWS resources in other accounts in the same organization.
   * If this is ORGANIZATION , the OrganizationalUnits parameter specifies which organizational units the workspace can access.
   *
   * @default accountAccessType.CURRENT_ACCOUNT
   */
  readonly accountAccessType: accountAccessType;
  /**
   * Specifies whether this workspace uses SAML 2.0, AWS IAM Identity Center , or both to authenticate users for using the Grafana console within a workspace. For more information, see User authentication in Amazon Managed Grafana.
   *
   * Allowed Values : AWS_SSO | SAML
   *
   * @default authenticationProviderTypes.AWS_SSO
   */
  readonly authenticationProviders: authenticationProviderTypes[];
  /**
   * If this is SERVICE_MANAGED , and the workplace was created through the Amazon Managed Grafana console, then Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions that the workspace needs to use AWS data sources and notification channels.
   *
   * If this is CUSTOMER_MANAGED , you must manage those roles and permissions yourself.
   *
   * If you are working with a workspace in a member account of an organization and that account is not a delegated administrator account, and you want the workspace to access data sources in other AWS accounts in the organization, this parameter must be set to CUSTOMER_MANAGED .
   *
   * @default SERVICE_MANAGED
   */
  readonly permissionType: permissionTypes;
  /**
   * A unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
   */
  readonly clientToken?: string;
  /**
   * Specifies the AWS data sources that have been configured to have IAM roles and permissions created to allow Amazon Managed Grafana to read data from these sources.
   *
   * This list is only used when the workspace was created through the AWS console, and the permissionType is SERVICE_MANAGED .
   */
  readonly dataSources?: string[];
  /**
   * The user-defined description of the workspace.
   */
  readonly description?: string;
  /**
   * Specifies the version of Grafana to support in the workspace.
   *
   * @default 10.4
   */
  readonly grafanaVersion?: grafanaVersionTypes;
  /**
   * The name of the workspace.
   */
  readonly name?: string;
  /**
   * The configuration settings for network access to your workspace.
   */
  readonly networkAccessControl?: NetworkAccessControlProperty | IResolvable;
  /**
   * The AWS notification channels that Amazon Managed Grafana can automatically create IAM roles and permissions for, to allow Amazon Managed Grafana to use these channels.
   */
  readonly notificationDestinations?: string[];
  /**
   * The name of the IAM role that is used to access resources through Organizations.
   */
  readonly organizationRoleName?: string;
  /**
   * Specifies the organizational units that this workspace is allowed to use data sources from, if this workspace is in an account that is part of an organization.
   */
  readonly organizationalUnits?: string[];
  /**
   * Whether plugin administration is enabled in the workspace.
   */
  readonly pluginAdminEnabled?: boolean;
  /**
   * The IAM role that grants permissions to the AWS resources that the workspace will view data from.
   */
  readonly roleArn?: string;
  /**
   * If the workspace uses SAML, use this structure to map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the Admin and Editor roles in the workspace.
   */
  readonly samlConfiguration?: SamlConfigurationProperty | IResolvable;
  /**
   * The name of the AWS CloudFormation stack set that is used to generate IAM roles to be used for this workspace.
   */
  readonly stackSetName?: string;
  /**
   * The configuration settings for an Amazon VPC that contains data sources for your Grafana workspace to connect to.
   */
  readonly vpcConfiguration?: VpcConfigurationProperty| IResolvable;
}

export class Workspace extends Resource implements IWorkspaceProps {
  /** @attribute */
  public readonly creationTimestamp: string;

  /** @attribute */
  public readonly endpoint: string;

  /** @attribute */
  public readonly modificationTimestamp: string;

  /** @attribute */
  public readonly SamlConfigurationStatus: string;

  /** @attribute */
  public readonly SsoClientId: string;

  /** @attribute */
  public readonly workspaceId: string;

  /** @attribute */
  public readonly workspaceName: string;

  /** @attribute */
  public readonly workspaceStatus: string;

  /** @attribute */
  public readonly workspaceVersion: string;

  /** @attribute */
  public readonly version: string;

  private readonly workspace: CfnWorkspace;

  constructor(scope: Construct, id: string, props: WorkspaceProps ) {
    super(scope, id);

    // Defaults
    let grafanaVersion;
    if (props.grafanaVersion) {
      grafanaVersion = props.grafanaVersion;
    } else {
      grafanaVersion = grafanaVersionTypes.GRAFANA_10_4;
    }

    // Validation
    if (props.clientToken) {
      validateClientToken(props.clientToken);
    }

    if (props.dataSources) {
      validateDataSources(props.dataSources, props.permissionType);
    }

    if (props.description) {
      validateDescription(props.description);
    }

    if (props.name) {
      validateName(props.name);
    }

    if (props.organizationRoleName) {
      validateRoleName(props.organizationRoleName);
    }

    if (props.roleArn) {
      validateRoleName(props.roleArn);
    }

    if (props.pluginAdminEnabled) {
      validatePluginAdminEnabled(props.pluginAdminEnabled, grafanaVersion);
    }

    if (props.vpcConfiguration) {
      validateVpcConfiguration(this.env.region);
    }

    this.workspace = new CfnWorkspace(this, 'Resource', {
      accountAccessType: props.accountAccessType,
      authenticationProviders: props.authenticationProviders,
      permissionType: props.permissionType,

      // the properties below are optional
      clientToken: props.clientToken,
      dataSources: props.dataSources,
      description: props.description,
      grafanaVersion: props.grafanaVersion,
      name: props.name,
      networkAccessControl: props.networkAccessControl,
      notificationDestinations: props.notificationDestinations,
      organizationalUnits: props.organizationalUnits,
      organizationRoleName: props.organizationRoleName,
      pluginAdminEnabled: props.pluginAdminEnabled,
      roleArn: props.roleArn,
      samlConfiguration: props.samlConfiguration,
      stackSetName: props.stackSetName,
      vpcConfiguration: props.vpcConfiguration,
    });

    this.workspaceVersion = this.getResourceArnAttribute(this.workspace.attrGrafanaVersion, {
      service: 'grafana',
      resource: 'workspace',
      resourceName: this.physicalName,
    });
    this.workspaceName = this.getResourceNameAttribute(this.workspace.ref);
    this.creationTimestamp = this.workspace.attrCreationTimestamp;
    this.endpoint = this.workspace.attrEndpoint;
    this.workspaceId = this.workspace.attrId;
    this.modificationTimestamp = this.workspace.attrModificationTimestamp;
    this.SamlConfigurationStatus = this.workspace.attrSamlConfigurationStatus;
    this.SsoClientId = this.workspace.attrSsoClientId;
    this.workspaceStatus = this.workspace.attrStatus;
    this.version = this.workspace.attrGrafanaVersion;

    function validateDataSources(dataSources: string[], permissionType: permissionTypes): void {
      if (permissionType === permissionTypes.CUSTOMER_MANAGED || (Array.isArray(dataSources && dataSources.length > 0 ))) {
        throw new Error('dataSources can only used with permissionType permissionTypes.SERVICE_MANAGED.');
      }
    }

    function validateClientToken(clientToken: string): void {
      const regex = new RegExp('^[!-~]{1,64}$');
      if (!regex.test(clientToken)) {
        throw new Error(`clientToken does not match the regex \^[!-~]{1,64}$\`, got ${clientToken}.`);
      }
    }

    function validateDescription(description: string): void {
      if (description.length > 2048) {
        throw new Error(`clientToken length must be less than or equal to 64, got ${description.length}.`);
      }
    }

    function validateName(name: string): void {
      const regex = new RegExp('^[a-zA-Z0-9-._~]{1,255}$');
      if (!regex.test(name)) {
        throw new Error(`name must match \`^[a-zA-Z0-9-._~]{1,255}$\` pattern, got ${name}.`);
      }
    }

    function validateRoleName(roleName: string): void {
      if (roleName.length >= 2048) {
        throw new Error(`Role length must be less than or equal to 2048 characters, got ${roleName.length}.`);
      }
    }

    function validatePluginAdminEnabled(pluginAdminEnabled: boolean, setGrafanaVersion: string ): void {
      if (pluginAdminEnabled === true && setGrafanaVersion === '8.4') {
        throw new Error('This option is only valid for Grafana versions 9 or newer.');
      }
    }

    function validateVpcConfiguration(vpcRegion: string): void {
      if (vpcRegion === 'ap-northeast-2') {
        throw new Error('Connecting to a private VPC is not yet available in the Asia Pacific (Seoul) Region (ap-northeast-2).');
      }
    }
  }

  // setter for DataSources and Dashboards
}
