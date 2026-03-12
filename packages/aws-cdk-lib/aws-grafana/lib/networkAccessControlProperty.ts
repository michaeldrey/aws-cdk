/**
 * An abstract action for NetworkAccessControlProperty.
 */
export interface INetworkAccessControlProperty {
  /**
   * Returns the receipt NetworkAccessControlProperty specification
   */
  bind(receiptRule: INetworkAccessControlProperty): NetworkAccessControlProperty;
}

export interface NetworkAccessControlProperty {
  /**
   * An array of prefix list IDs.
   */
  readonly prefixListIds: string[];
  /**
   * An array of Amazon VPC endpoint IDs for the workspace.
   */
  readonly vpceIds: string[];
}
