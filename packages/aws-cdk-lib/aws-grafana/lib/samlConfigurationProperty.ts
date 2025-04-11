import { IResolvable } from '../../core';

/**
 * An abstract action for a idpMetadata.
 */
export interface IIdpMetadataProperty {
  /**
   * Returns the idpMetadata specification
   */
  bind(receiptRule: IIdpMetadataProperty): idpMetadataProperty;

}

export interface idpMetadataProperty {
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
 * An abstract action for a AssertionAttributesProperty.
 */
export interface IAssertionAttributesProperty {
  /**
   * Returns the AssertionAttributesProperty specification
   */
  bind(receiptRule: IAssertionAttributesProperty): AssertionAttributesProperty;

}

export interface AssertionAttributesProperty {
  /**
   * The name of the attribute within the SAML assertion to use as the email names for SAML users.
   */
  readonly email?: string;
  /**
   * The name of the attribute within the SAML assertion to use as the user full "friendly" names for user groups.
   */
  readonly groups?: string;
  /**
   * The name of the attribute within the SAML assertion to use as the login names for SAML users.
   */
  readonly login?: string;
  /**
   * The name of the attribute within the SAML assertion to use as the user full "friendly" names for SAML users.
   */
  readonly name?: string;
  /**
   * The name of the attribute within the SAML assertion to use as the user full "friendly" names for the users' organizations.
   */
  readonly org?: string;
  /**
   * The name of the attribute within the SAML assertion to use as the user roles.
   */
  readonly role?: string;
}

/**
 * An abstract action for a roleValuesProperty.
 */
export interface IRoleValuesProperty {
  /**
   * Returns the roleValuesProperty specification
   */
  bind(receiptRule: IRoleValuesProperty): roleValuesProperty;

}

export interface roleValuesProperty {
  /**
   * A list of groups from the SAML assertion attribute to grant the Grafana Admin role to.
   */
  readonly admin?: string[];
  /**
   * A list of groups from the SAML assertion attribute to grant the Grafana Editor role to.
   */
  readonly editor?: string[];
}

/**
 * An abstract action for SamlConfigurationProperty.
 */
export interface ISamlConfigurationProperty {
  /**
   * Returns the receipt SamlConfigurationProperty specification
   */
  bind(receiptRule: ISamlConfigurationProperty): SamlConfigurationProperty;

}

export interface SamlConfigurationProperty {
  /**
   * A structure containing the identity provider (IdP) metadata used to integrate the identity provider with this workspace.
   */
  readonly idpMetadata: idpMetadataProperty | IResolvable;
  /**
   * Lists which organizations defined in the SAML assertion are allowed to use the Amazon Managed Grafana workspace.
   */
  readonly allowedOrganizations?: string[];
  /**
   * A structure that defines which attributes in the SAML assertion are to be used to define information about the users authenticated by that IdP to use the workspace.
   */
  readonly assertionAttributes?: AssertionAttributesProperty | IResolvable;
  /**
   * How long a sign-on session by a SAML user is valid, before the user has to sign on again.
   */
  readonly loginValidityDuration?: number;
  /**
   * A structure containing arrays that map group names in the SAML assertion to the Grafana Admin and Editor roles in the workspace.
   */
  readonly roleValues?: roleValuesProperty | IResolvable;
}