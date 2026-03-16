/**
 * Represents a VPC connection configuration for a Grafana workspace.
 */
export interface IVpcConfigurationProperty {
  /**
   * Returns the VPC configuration.
   */
  bind(receiptRule: IVpcConfigurationProperty): VpcConfigurationProperty;
}

/**
 * Connects an Amazon Managed Grafana workspace to data sources within an Amazon VPC.
 */
export interface VpcConfigurationProperty {
  /**
   * The list of Amazon EC2 security group IDs attached to the Amazon VPC for your Grafana workspace to connect.
   */
  readonly securityGroupIds: string[];
  /**
   * The list of Amazon EC2 subnet IDs created in the Amazon VPC for your Grafana workspace to connect.
   */
  readonly subnetIds: string[];
}
