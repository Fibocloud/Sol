export interface Image {
  ID: string;
  Created: Date;
  MinDisk: number;
  MinRAM: number;
  Name: string;
  Progress: number;
  Status: string;
  Updated: Date;
  Metadata: Metadata;
}

export interface Metadata {
  description?: string;
  hw_rng_model?: string;
  "owner_specified.openstack.md5"?: string;
  "owner_specified.openstack.object"?: string;
  "owner_specified.openstack.sha256"?: string;
}
