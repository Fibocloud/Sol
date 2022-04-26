export interface SecGroup {
  name: string;
  description: string;
  rules: Rule[];
  tenant_id: string;
}

export interface Rule {
  from_port: number;
  to_port: number;
  ip_protocol: string;
  ip_range: IPRange;
  Group: Group;
}

export interface Group {
  tenant_id: string;
  Name: string;
}

export interface IPRange {
  CIDR: string;
}

export interface CreateSecGroupInput {
  name: string;
  description: string;
}

export interface UpdateSecGroupInput {
  name: string;
  description: string;
}

export interface CreateRuleSecGroupInput {
  sec_group_id: string;
  from_port: number;
  to_port: number;
  ip_protocol: string;
  cidr: string;
  group_id: string;
}
