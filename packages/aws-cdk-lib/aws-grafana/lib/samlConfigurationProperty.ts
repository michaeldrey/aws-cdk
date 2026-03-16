import type { IResolvable } from '../../core';

/**
 * Represents an identity provider (IdP) metadata source for SAML authentication.
 */
export interface IIdpMetadataProperty {
  /**
   * Returns the IdP metadata configuration.
   */
  bind(receiptRule: IIdpMetadataProperty): IdpMetadataProperty;
}

/**
 * Identity provider (IdP) metadata for SAML authentication, specified as a URL or inline XML.
 */
export interface IdpMetadataProperty {
  /**
   * The URL of the location containing the IdP metadata.
   */
  readonly url?: string;
  /**
   * The full IdP metadata, in XML format.
   */
  readonly xml?: string;
}

/**
 * Represents a mapping of SAML assertion attributes to workspace user information.
 */
export interface IAssertionAttributesProperty {
  /**
   * Returns the assertion attributes configuration.
   */
  bind(receiptRule: IAssertionAttributesProperty): AssertionAttributesProperty;
}

/**
 * Maps SAML assertion attributes to Grafana workspace user fields.
 */
export interface AssertionAttributesProperty {
  /**
   * The name of the attribute within the SAML assertion to use as the email for SAML users.
   */
  readonly email?: string;
  /**
   * The name of the attribute within the SAML assertion to use as user groups.
   */
  readonly groups?: string;
  /**
   * The name of the attribute within the SAML assertion to use as the login name for SAML users.
   */
  readonly login?: string;
  /**
   * The name of the attribute within the SAML assertion to use as the display name for SAML users.
   */
  readonly name?: string;
  /**
   * The name of the attribute within the SAML assertion to use as the user's organization.
   */
  readonly org?: string;
  /**
   * The name of the attribute within the SAML assertion to use as the user role.
   */
  readonly role?: string;
}

/**
 * Represents a mapping of SAML groups to Grafana workspace roles.
 */
export interface IRoleValuesProperty {
  /**
   * Returns the role values configuration.
   */
  bind(receiptRule: IRoleValuesProperty): RoleValuesProperty;
}

/**
 * Maps SAML assertion group names to Grafana Admin and Editor roles.
 */
export interface RoleValuesProperty {
  /**
   * A list of groups from the SAML assertion to grant the Grafana Admin role to.
   */
  readonly admin?: string[];
  /**
   * A list of groups from the SAML assertion to grant the Grafana Editor role to.
   */
  readonly editor?: string[];
}

/**
 * Represents a SAML authentication configuration for a Grafana workspace.
 */
export interface ISamlConfigurationProperty {
  /**
   * Returns the SAML configuration.
   */
  bind(receiptRule: ISamlConfigurationProperty): SamlConfigurationProperty;
}

/**
 * SAML 2.0 authentication configuration for an Amazon Managed Grafana workspace.
 */
export interface SamlConfigurationProperty {
  /**
   * The identity provider (IdP) metadata used to integrate the IdP with this workspace.
   */
  readonly idpMetadata: IdpMetadataProperty | IResolvable;
  /**
   * Organizations defined in the SAML assertion that are allowed to use this workspace.
   */
  readonly allowedOrganizations?: string[];
  /**
   * Defines which SAML assertion attributes map to workspace user information.
   */
  readonly assertionAttributes?: AssertionAttributesProperty | IResolvable;
  /**
   * How long (in minutes) a SAML sign-on session is valid before the user must sign on again.
   */
  readonly loginValidityDuration?: number;
  /**
   * Maps SAML assertion group names to the Grafana Admin and Editor roles in the workspace.
   */
  readonly roleValues?: RoleValuesProperty | IResolvable;
}
