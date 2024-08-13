/**
 * An abstract action for VpcConfigurationProperty.
 */
export interface IVpcConfigurationProperty{
  /**
   * Returns the receipt VpcConfigurationProperty specification
   */
  bind(receiptRule: IVpcConfigurationProperty): VpcConfigurationProperty;
}
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