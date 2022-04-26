export type InstanceStatus =
  | "ACTIVE"
  | "BUILD"
  | "DELETED"
  | "ERROR"
  | "HARD_REBOOT"
  | "MIGRATING"
  | "PASSWORD"
  | "PAUSED"
  | "REBOOT"
  | "REBUILD"
  | "RESCUE"
  | "RESIZE"
  | "REVERT_RESIZE"
  | "SHELVED"
  | "SHELVED_OFFLOADED"
  | "SHUTOFF"
  | "SOFT_DELETED"
  | "SUSPENDED"
  | "UNKNOWN"
  | "VERIFY_RESIZE";

export interface Instance {
  id: string;
  tenant_id: string;
  user_id: string;
  name: string;
  updated: Date;
  created: Date;
  hostid: string;
  status: InstanceStatus;
  progress: number;
  accessIPv4: string;
  accessIPv6: string;
  flavor: Flavor;
  addresses: Addresses;
  metadata: Metadata;
  links: Link[];
  key_name: string;
  adminPass: string;
  security_groups?: SecurityGroup[];
  "os-extended-volumes:volumes_attached": OSExtendedVolumesVolumesAttached[];
  fault: Fault;
  tags: null;
  server_groups: null;
}

export interface Addresses {
  public?: Public[];
}

export interface Public {
  "OS-EXT-IPS-MAC:mac_addr": string;
  "OS-EXT-IPS:type": string;
  addr: string;
  version: number;
}

export interface Fault {
  code: number;
  created: Date;
  details: string;
  message: string;
}

export interface Flavor {
  id: string;
  links: Link[];
}

export interface Link {
  href: string;
  rel: string;
}

export interface Metadata {}

export interface OSExtendedVolumesVolumesAttached {
  id: string;
}

export interface SecurityGroup {
  name: string;
}

export type CreateInstanceSourceType =
  | "blank"
  | "image"
  | "snapshot"
  | "volume";

export interface CreateInstanceInput {
  source_type: CreateInstanceSourceType;
  source_id: string;
  name: string;
  flavor_id: string;
  keypair_name: string;
  network_id: string;
  volume_size: number;
  security_groups: string[];
  delete_on_termination: boolean;
  user_data?: string;
}

export interface UpdateInstanceInput {
  name: string;
  access_ipv4: string;
  access_ipv6: string;
}
