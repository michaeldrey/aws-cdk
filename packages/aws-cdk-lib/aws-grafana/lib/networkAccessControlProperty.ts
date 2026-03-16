/**
 * Represents a network access control configuration for a Grafana workspace.
 */
export interface INetworkAccessControlProperty {
  /**
   * Returns the network access control configuration.
   */
  bind(receiptRule: INetworkAccessControlProperty): NetworkAccessControlProperty;
}

/**
 * Controls network-level access to an Amazon Managed Grafana workspace using VPC endpoints and prefix lists.
 */
export interface NetworkAccessControlProperty {
  /**
   * An array of prefix list IDs that are allowed to access the workspace.
   */
  readonly prefixListIds: string[];
  /**
   * An array of Amazon VPC endpoint IDs that are allowed to access the workspace.
   */
  readonly vpceIds: string[];
}
