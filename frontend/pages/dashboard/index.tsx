import PageTitle from "$/components/page_title";
import StatusCard from "$/components/status_card";
import SYSTEM from "$/services/system";
import { formatMB } from "$/utils";
import { Paper, SimpleGrid, Skeleton, Stack, Title } from "@mantine/core";
import type { NextPage } from "next";
import React from "react";
import { useQuery } from "react-query";

const Home: NextPage = () => {
  const limit = useQuery(["system", "limit"], SYSTEM.limit);
  const compute = useQuery(["system", "compute"], SYSTEM.compute);
  return (
    <PageTitle
      title="Overview"
      hasBodyWrapper={false}
      loading={compute.isFetching}
      onRefresh={compute.refetch}
    >
      <Paper py="xs" px="md" radius="lg" shadow="sm">
        <Stack spacing="xs">
          <Title order={5}>Usages</Title>
          <SimpleGrid
            cols={4}
            spacing="md"
            breakpoints={[
              { maxWidth: "xl", cols: 3, spacing: "md" },
              { maxWidth: "md", cols: 2, spacing: "sm" },
              { maxWidth: "sm", cols: 1, spacing: "sm" },
            ]}
          >
            {compute.isLoading ? (
              [1, 2, 3, 4].map((ind) => (
                <Skeleton key={ind} radius="md" height={86} />
              ))
            ) : (
              <>
                <StatusCard
                  title="Running VMs"
                  to="/dashboard/instance"
                  max={compute.data?.running_vms || 0}
                  value={compute.data?.running_vms || 0}
                />
                <StatusCard
                  title="VCPUs"
                  to="/dashboard/instance"
                  max={compute.data?.vcpus || 0}
                  value={compute.data?.vcpus_used || 0}
                />
                <StatusCard
                  title="Memory (RAM)"
                  to="/dashboard/instance"
                  max={compute.data?.memory_mb || 0}
                  value={compute.data?.memory_mb_used || 0}
                  format={(value) => formatMB(value)}
                />
                <StatusCard
                  title="Storages"
                  to="/dashboard/instance"
                  max={compute.data?.local_gb || 0}
                  value={compute.data?.local_gb_used || 0}
                  format={(value) => `${value}GB`}
                />
              </>
            )}
          </SimpleGrid>
        </Stack>
      </Paper>
      <Paper py="xs" px="md" radius="lg" shadow="sm">
        <Stack spacing="xs">
          <Title order={5}>Quotas</Title>
          <SimpleGrid
            cols={4}
            spacing="md"
            breakpoints={[
              { maxWidth: "xl", cols: 3, spacing: "md" },
              { maxWidth: "md", cols: 2, spacing: "sm" },
              { maxWidth: "sm", cols: 1, spacing: "sm" },
            ]}
          >
            {limit.isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ind) => (
                <Skeleton key={ind} radius="md" height={86} />
              ))
            ) : (
              <>
                <StatusCard
                  title="Virtual machines"
                  to="/dashboard/instance"
                  max={limit.data?.compute.absolute.maxTotalInstances || 0}
                  value={limit.data?.compute.absolute.totalInstancesUsed || 0}
                />
                <StatusCard
                  title="Cores"
                  to="/dashboard/instance"
                  max={limit.data?.compute.absolute.maxTotalCores || 0}
                  value={limit.data?.compute.absolute.totalCoresUsed || 0}
                />
                <StatusCard
                  title="Memory (RAM)"
                  to="/dashboard/instance"
                  max={limit.data?.compute.absolute.maxTotalRAMSize || 0}
                  value={limit.data?.compute.absolute.totalRAMUsed || 0}
                  format={(value) => formatMB(value)}
                />
                <StatusCard
                  title="Static IPs"
                  to="/dashboard/instance"
                  max={limit.data?.compute.absolute.maxTotalFloatingIps || 0}
                  value={limit.data?.compute.absolute.totalFloatingIpsUsed || 0}
                />
                <StatusCard
                  title="Disks (Count)"
                  to="/dashboard/volume"
                  max={limit.data?.storage.absolute.maxTotalVolumes || 0}
                  value={limit.data?.storage.absolute.totalVolumesUsed || 0}
                />
                <StatusCard
                  title="Disk (GB)"
                  to="/dashboard/volume"
                  max={
                    limit.data?.storage.absolute.maxTotalVolumeGigabytes || 0
                  }
                  value={limit.data?.storage.absolute.totalGigabytesUsed || 0}
                  format={(value) => `${value}GB`}
                />
                <StatusCard
                  title="Backups (Count)"
                  to="#"
                  max={limit.data?.storage.absolute.maxTotalBackups || 0}
                  value={limit.data?.storage.absolute.totalBackupsUsed || 0}
                />
                <StatusCard
                  title="Backup (GB)"
                  to="#"
                  max={
                    limit.data?.storage.absolute.maxTotalBackupGigabytes || 0
                  }
                  value={
                    limit.data?.storage.absolute.totalBackupGigabytesUsed || 0
                  }
                  format={(value) => `${value}GB`}
                />
                <StatusCard
                  title="Snapshots"
                  to="#"
                  max={limit.data?.storage.absolute.maxTotalSnapshots || 0}
                  value={limit.data?.storage.absolute.totalSnapshotsUsed || 0}
                />
                <StatusCard
                  title="Max SSH keys"
                  to="/dashboard/keypair"
                  value={limit.data?.compute.absolute.maxTotalKeypairs || 0}
                />
                <StatusCard
                  title="Max image"
                  to="/dashboard/image"
                  value={limit.data?.compute.absolute.maxImageMeta || 0}
                />
              </>
            )}
          </SimpleGrid>
        </Stack>
      </Paper>
    </PageTitle>
  );
};

export default Home;
