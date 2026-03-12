import type { Construct } from 'constructs';
import { CfnWorkspace } from './grafana.generated';
import type { NetworkAccessControlProperty } from './networkAccessControlProperty';
import type { SamlConfigurationProperty } from './samlConfigurationProperty';
import type { VpcConfigurationProperty } from './vpcConfigurationProperty';
import * as iam from '../../aws-iam';
import { ArnFormat, type IResolvable, type IResource, Resource, Stack, Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';

/**
 * Specifies whether the workspace can access AWS resources in this AWS account only,
 * or whether it can also access AWS resources in other accounts in the same organization.
 */
export enum AccountAccessType {
  /**
   * The workspace can access resources only in the current AWS account.
   */
  CURRENT_ACCOUNT = 'CURRENT_ACCOUNT',

  /**
   * The workspace can access resources in other accounts in the same organization.
   */
  ORGANIZATION = 'ORGANIZATION',
}

/**
 * Specifies how permissions are managed for the workspace.
 */
export enum PermissionType {
  /**
   * Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions
   * that the workspace needs to use AWS data sources and notification channels.
   */
  SERVICE_MANAGED = 'SERVICE_MANAGED',

  /**
   * You must manage IAM roles and permissions yourself.
   */
  CUSTOMER_MANAGED = 'CUSTOMER_MANAGED',
}

/**
 * The authentication providers for the workspace.
 */
export enum AuthenticationProviderType {
  /**
   * AWS IAM Identity Center (successor to AWS Single Sign-On).
   */
  AWS_SSO = 'AWS_SSO',

  /**
   * SAML 2.0 identity provider.
   */
  SAML = 'SAML',
}

/**
 * The version of Grafana to support in the workspace.
 */
export enum GrafanaVersion {
  /**
   * Grafana version 8.4
   */
  V8_4 = '8.4',

  /**
   * Grafana version 9.4
   */
  V9_4 = '9.4',

  /**
   * Grafana version 10.4
   */
  V10_4 = '10.4',
}

/**
 * Represents an Amazon Managed Grafana workspace.
 */
export interface IWorkspace extends IResource {
  /**
   * The ARN of the workspace.
   *
   * @attribute
   */
  readonly workspaceArn: string;

  /**
   * The unique ID of the workspace.
   *
   * @attribute
   */
  readonly workspaceId: string;

  /**
   * The Grafana endpoint for the workspace.
   *
   * @attribute
   */
  readonly workspaceEndpoint: string;

  /**
   * The IAM role that grants permissions to the AWS resources that the workspace will view data from.
   * Undefined for imported workspaces.
   */
  readonly role?: iam.IRole;

  /**
   * Grant the given identity permissions on this workspace.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
}

/**
 * Attributes for importing an existing Grafana workspace.
 */
export interface WorkspaceAttributes {
  /**
   * The ARN of the workspace.
   *
   * @default - derived from workspaceId
   */
  readonly workspaceArn?: string;

  /**
   * The unique ID of the workspace.
   *
   * @default - derived from workspaceArn
   */
  readonly workspaceId?: string;

  /**
   * The Grafana endpoint for the workspace.
   */
  readonly workspaceEndpoint: string;
}

/**
 * Construction properties for a Grafana Workspace.
 */
export interface WorkspaceProps {
  /**
   * Specifies whether the workspace can access AWS resources in this AWS account only,
   * or whether it can also access AWS resources in other accounts in the same organization.
   *
   * If this is ORGANIZATION, the organizationalUnits parameter specifies which organizational
   * units the workspace can access.
   *
   * @default AccountAccessType.CURRENT_ACCOUNT
   */
  readonly accountAccessType?: AccountAccessType;

  /**
   * Specifies whether this workspace uses SAML 2.0, AWS IAM Identity Center, or both
   * to authenticate users for using the Grafana console within a workspace.
   *
   * @default [AuthenticationProviderType.AWS_SSO]
   */
  readonly authenticationProviders?: AuthenticationProviderType[];

  /**
   * Specifies whether Amazon Managed Grafana automatically creates IAM roles and provisions
   * the permissions that the workspace needs to use AWS data sources and notification channels.
   *
   * @default PermissionType.SERVICE_MANAGED
   */
  readonly permissionType?: PermissionType;

  /**
   * A unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
   *
   * Must match the pattern `^[!-~]{1,64}$`.
   *
   * @default - no client token
   */
  readonly clientToken?: string;

  /**
   * Specifies the AWS data sources that have been configured to have IAM roles and permissions
   * created to allow Amazon Managed Grafana to read data from these sources.
   *
   * This list is only used when the permissionType is SERVICE_MANAGED.
   *
   * @default - no data sources
   */
  readonly dataSources?: string[];

  /**
   * The user-defined description of the workspace.
   *
   * Must be 2048 characters or fewer.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * Specifies the version of Grafana to support in the workspace.
   *
   * @default GrafanaVersion.V10_4
   */
  readonly grafanaVersion?: GrafanaVersion;

  /**
   * The name of the workspace.
   *
   * Must match the pattern `^[a-zA-Z0-9-._~]{1,255}$`.
   *
   * @default - auto-generated by CloudFormation
   */
  readonly name?: string;

  /**
   * The configuration settings for network access to your workspace.
   *
   * @default - no network access control
   */
  readonly networkAccessControl?: NetworkAccessControlProperty | IResolvable;

  /**
   * The AWS notification channels that Amazon Managed Grafana can automatically create
   * IAM roles and permissions for, to allow Amazon Managed Grafana to use these channels.
   *
   * @default - no notification destinations
   */
  readonly notificationDestinations?: string[];

  /**
   * The name of the IAM role that is used to access resources through Organizations.
   *
   * @default - no organization role name
   */
  readonly organizationRoleName?: string;

  /**
   * Specifies the organizational units that this workspace is allowed to use data sources from,
   * if this workspace is in an account that is part of an organization.
   *
   * @default - no organizational units
   */
  readonly organizationalUnits?: string[];

  /**
   * Whether plugin administration is enabled in the workspace.
   *
   * This is only valid for Grafana versions 9 or newer.
   *
   * @default false
   */
  readonly pluginAdminEnabled?: boolean;

  /**
   * The IAM role that grants permissions to the AWS resources that the workspace will view data from.
   *
   * @default - a role is automatically created when permissionType is SERVICE_MANAGED
   */
  readonly role?: iam.IRole;

  /**
   * If the workspace uses SAML, use this structure to map SAML assertion attributes to workspace
   * user information and define which groups in the assertion attribute are to have the Admin and
   * Editor roles in the workspace.
   *
   * @default - no SAML configuration
   */
  readonly samlConfiguration?: SamlConfigurationProperty | IResolvable;

  /**
   * The name of the AWS CloudFormation stack set that is used to generate IAM roles
   * to be used for this workspace.
   *
   * @default - no stack set name
   */
  readonly stackSetName?: string;

  /**
   * The configuration settings for an Amazon VPC that contains data sources for your
   * Grafana workspace to connect to.
   *
   * @default - no VPC configuration
   */
  readonly vpcConfiguration?: VpcConfigurationProperty | IResolvable;
}

/**
 * Abstract base class for Grafana Workspace.
 */
abstract class WorkspaceBase extends Resource implements IWorkspace {
  public abstract readonly workspaceArn: string;
  public abstract readonly workspaceId: string;
  public abstract readonly workspaceEndpoint: string;
  public abstract readonly role?: iam.IRole;

  /**
   * Grant the given identity permissions on this workspace.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.workspaceArn],
    });
  }
}

/**
 * An Amazon Managed Grafana workspace.
 *
 * @resource AWS::Grafana::Workspace
 */
export class Workspace extends WorkspaceBase {
  /**
   * Import an existing workspace from its ARN.
   */
  public static fromWorkspaceArn(scope: Construct, id: string, workspaceArn: string): IWorkspace {
    const parsedArn = Stack.of(scope).splitArn(workspaceArn, ArnFormat.SLASH_RESOURCE_NAME);

    class Import extends WorkspaceBase {
      public readonly workspaceArn = workspaceArn;
      public readonly workspaceId = parsedArn.resourceName!;
      public readonly workspaceEndpoint = `https://${parsedArn.resourceName}.grafana-workspace.${parsedArn.region}.amazonaws.com`;
      public readonly role = undefined;
    }

    return new Import(scope, id, {
      environmentFromArn: workspaceArn,
    });
  }

  /**
   * Import an existing workspace from its attributes.
   */
  public static fromWorkspaceAttributes(scope: Construct, id: string, attrs: WorkspaceAttributes): IWorkspace {
    if (!attrs.workspaceArn && !attrs.workspaceId) {
      throw new ValidationError('At least one of workspaceArn or workspaceId must be provided', scope);
    }

    const workspaceArn = attrs.workspaceArn ?? Stack.of(scope).formatArn({
      service: 'grafana',
      resource: '/workspaces',
      resourceName: attrs.workspaceId,
    });

    const workspaceId = attrs.workspaceId ?? Stack.of(scope).splitArn(attrs.workspaceArn!, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

    class Import extends WorkspaceBase {
      public readonly workspaceArn = workspaceArn;
      public readonly workspaceId = workspaceId;
      public readonly workspaceEndpoint = attrs.workspaceEndpoint;
      public readonly role = undefined;
    }

    return new Import(scope, id, {
      environmentFromArn: workspaceArn,
    });
  }

  /**
   * The ARN of the workspace.
   *
   * @attribute
   */
  public readonly workspaceArn: string;

  /**
   * The unique ID of the workspace.
   *
   * @attribute
   */
  public readonly workspaceId: string;

  /**
   * The Grafana endpoint for the workspace.
   *
   * @attribute
   */
  public readonly workspaceEndpoint: string;

  /**
   * The Grafana version of the workspace.
   *
   * @attribute
   */
  public readonly workspaceGrafanaVersion: string;

  /**
   * The creation timestamp of the workspace.
   *
   * @attribute
   */
  public readonly workspaceCreationTimestamp: string;

  /**
   * The modification timestamp of the workspace.
   *
   * @attribute
   */
  public readonly workspaceModificationTimestamp: string;

  /**
   * The SAML configuration status of the workspace.
   *
   * @attribute
   */
  public readonly workspaceSamlConfigurationStatus: string;

  /**
   * The AWS SSO client ID of the workspace.
   *
   * @attribute
   */
  public readonly workspaceSsoClientId: string;

  /**
   * The status of the workspace.
   *
   * @attribute
   */
  public readonly workspaceStatus: string;

  /**
   * The IAM role associated with this workspace.
   */
  public readonly role?: iam.IRole;

  constructor(scope: Construct, id: string, props: WorkspaceProps = {}) {
    super(scope, id);

    const accountAccessType = props.accountAccessType ?? AccountAccessType.CURRENT_ACCOUNT;
    const authenticationProviders = props.authenticationProviders ?? [AuthenticationProviderType.AWS_SSO];
    const permissionType = props.permissionType ?? PermissionType.SERVICE_MANAGED;
    const grafanaVersion = props.grafanaVersion ?? GrafanaVersion.V10_4;

    // Validation
    this._validateProps(props, grafanaVersion, permissionType);

    this.role = props.role;

    const workspace = new CfnWorkspace(this, 'Resource', {
      accountAccessType,
      authenticationProviders,
      permissionType,
      clientToken: props.clientToken,
      dataSources: props.dataSources,
      description: props.description,
      grafanaVersion,
      name: props.name,
      networkAccessControl: props.networkAccessControl,
      notificationDestinations: props.notificationDestinations,
      organizationalUnits: props.organizationalUnits,
      organizationRoleName: props.organizationRoleName,
      pluginAdminEnabled: props.pluginAdminEnabled,
      roleArn: props.role?.roleArn,
      samlConfiguration: props.samlConfiguration,
      stackSetName: props.stackSetName,
      vpcConfiguration: props.vpcConfiguration,
    });

    this.workspaceArn = Stack.of(this).formatArn({
      service: 'grafana',
      resource: '/workspaces',
      resourceName: workspace.attrId,
    });
    this.workspaceId = workspace.attrId;
    this.workspaceEndpoint = workspace.attrEndpoint;
    this.workspaceGrafanaVersion = workspace.attrGrafanaVersion;
    this.workspaceCreationTimestamp = workspace.attrCreationTimestamp;
    this.workspaceModificationTimestamp = workspace.attrModificationTimestamp;
    this.workspaceSamlConfigurationStatus = workspace.attrSamlConfigurationStatus;
    this.workspaceSsoClientId = workspace.attrSsoClientId;
    this.workspaceStatus = workspace.attrStatus;
  }

  private _validateProps(props: WorkspaceProps, grafanaVersion: GrafanaVersion, permissionType: PermissionType): void {
    if (props.clientToken && !Token.isUnresolved(props.clientToken)) {
      if (!/^[!-~]{1,64}$/.test(props.clientToken)) {
        throw new ValidationError(`clientToken must match the pattern \`^[!-~]{1,64}$\`, got '${props.clientToken}'.`, this);
      }
    }

    if (props.description && !Token.isUnresolved(props.description)) {
      if (props.description.length > 2048) {
        throw new ValidationError(`description must be 2048 characters or fewer, got ${props.description.length}.`, this);
      }
    }

    if (props.name && !Token.isUnresolved(props.name)) {
      if (!/^[a-zA-Z0-9-._~]{1,255}$/.test(props.name)) {
        throw new ValidationError(`name must match the pattern \`^[a-zA-Z0-9-._~]{1,255}$\`, got '${props.name}'.`, this);
      }
    }

    if (props.organizationRoleName && !Token.isUnresolved(props.organizationRoleName)) {
      if (props.organizationRoleName.length > 2048) {
        throw new ValidationError(`organizationRoleName must be 2048 characters or fewer, got ${props.organizationRoleName.length}.`, this);
      }
    }

    if (props.dataSources && props.dataSources.length > 0 && permissionType !== PermissionType.SERVICE_MANAGED) {
      throw new ValidationError('dataSources can only be used when permissionType is SERVICE_MANAGED.', this);
    }

    if (props.pluginAdminEnabled && grafanaVersion === GrafanaVersion.V8_4) {
      throw new ValidationError('pluginAdminEnabled is only valid for Grafana versions 9 or newer.', this);
    }
  }
}
