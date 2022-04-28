export interface HypervisorCompute {
  count: number;
  current_workload: number;
  disk_available_least: number;
  free_disk_gb: number;
  free_ram_mb: number;
  local_gb: number;
  local_gb_used: number;
  memory_mb: number;
  memory_mb_used: number;
  running_vms: number;
  vcpus: number;
  vcpus_used: number;
}

export interface LimitCompute {
  compute: {
    absolute: {
      maxTotalCores: number;
      maxImageMeta: number;
      maxServerMeta: number;
      maxPersonality: number;
      maxPersonalitySize: number;
      maxTotalKeypairs: number;
      maxSecurityGroups: number;
      maxSecurityGroupRules: number;
      maxServerGroups: number;
      maxServerGroupMembers: number;
      maxTotalFloatingIps: number;
      maxTotalInstances: number;
      maxTotalRAMSize: number;
      totalCoresUsed: number;
      totalInstancesUsed: number;
      totalFloatingIpsUsed: number;
      totalRAMUsed: number;
      totalSecurityGroupsUsed: number;
      totalServerGroupsUsed: number;
    };
  };
  storage: {
    absolute: {
      maxTotalVolumes: number;
      maxTotalSnapshots: number;
      maxTotalVolumeGigabytes: number;
      maxTotalBackups: number;
      maxTotalBackupGigabytes: number;
      totalVolumesUsed: number;
      totalGigabytesUsed: number;
      totalSnapshotsUsed: number;
      totalBackupsUsed: number;
      totalBackupGigabytesUsed: number;
    };
    rate: [];
  };
}
