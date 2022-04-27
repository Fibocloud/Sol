import LinkButton from "$/components/link_button";
import PageTitle from "$/components/page_title";
import Table from "$/components/table";
import useSearch from "$/hooks/useSearch";
import FLAVOR from "$/services/flavor";
import INSTANCE from "$/services/instances";
import { Instance } from "$/services/instances/types";
import { isProcessing, textSearch } from "$/utils";
import useInstanceActions from "$/widgets/instance/actions";
import CreateModal from "$/widgets/instance/create";
import ResizeModal from "$/widgets/instance/resize";
import Status from "$/widgets/instance/status";
import { Button, Group, List, Loader, Menu } from "@mantine/core";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Column } from "react-table";
import {
  CodePlus,
  Dimensions,
  HandStop,
  PlayerPause,
  PlayerPlay,
  PlayerRecord,
  RefreshAlert,
  Square4,
  Square6,
  Trash,
} from "tabler-icons-react";

const Instances: NextPage = () => {
  const [search, setSearch] = useSearch();
  const [create, setCreate] = useState(false);
  const [resize, setResize] = useState<Instance>();
  const { remove, reboot, start, stop, resume, suspend } = useInstanceActions();
  const flavors = useQuery(["flavor", "list"], FLAVOR.list);
  const instances = useQuery(["instance", "list"], INSTANCE.list, {
    refetchInterval: 3000,
  });
  const data = useMemo<Instance[]>(
    () =>
      (instances.data || []).filter(
        (i) => i.id === search || textSearch(i.name, search)
      ),
    [instances.data, search]
  );

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        id: "name",
        Header: "NAME",
        accessor: (record) => record.name,
      },
      {
        id: "ip",
        Header: "IP ADDRESS",
        accessor: (record) => (
          <List spacing={0} size="sm">
            {record.addresses.public?.map((ip) => (
              <List.Item
                key={ip.addr}
                icon={
                  ip.version === 4 ? (
                    <Square4 size={20} color="teal" />
                  ) : (
                    <Square6 size={20} color="orange" />
                  )
                }
              >
                {ip.addr}
              </List.Item>
            ))}
          </List>
        ),
      },
      {
        id: "status",
        Header: "STATUS",
        accessor: (record) => <Status instance={record} />,
      },
      {
        id: "flavor",
        Header: "LIMIT",
        accessor: (record) => {
          if (flavors.isLoading) {
            return <Loader size="xs" />;
          }
          return (
            <LinkButton
              to={`/dashboard/flavor?q=${record.flavor.id}`}
              label={
                flavors.data?.find((i) => i.id === record.flavor?.id)?.name ||
                "not found"
              }
            />
          );
        },
      },
      {
        id: "firewall",
        Header: "FIREWALL",
        accessor: (record) => (
          <Group>
            {record.security_groups?.map((item) => (
              <LinkButton
                key={item.name}
                to={`/dashboard/sec_group?q=${item.name}`}
                label={item.name}
              />
            ))}
          </Group>
        ),
      },
      {
        id: "action",
        Header: "ACTION",
        accessor: (record) => {
          const loading = isProcessing(record.status);
          return (
            <Menu>
              <Menu.Label>State</Menu.Label>
              <Menu.Item
                color="orange"
                icon={<RefreshAlert size={14} />}
                onClick={() => reboot(record)}
                disabled={loading || record.status === "VERIFY_RESIZE"}
              >
                Reboot
              </Menu.Item>
              <Menu.Item
                icon={<PlayerPlay size={14} />}
                disabled={loading || record.status !== "SHUTOFF"}
                onClick={() => start(record)}
              >
                Start
              </Menu.Item>
              <Menu.Item
                color="orange"
                icon={<PlayerPause size={14} />}
                disabled={loading || record.status !== "ACTIVE"}
                onClick={() => stop(record)}
              >
                Stop
              </Menu.Item>
              <Menu.Item
                icon={<PlayerRecord size={14} />}
                disabled={loading || record.status !== "SUSPENDED"}
                onClick={() => resume(record)}
              >
                Resume
              </Menu.Item>
              <Menu.Item
                color="orange"
                icon={<HandStop size={14} />}
                disabled={loading || record.status !== "ACTIVE"}
                onClick={() => suspend(record)}
              >
                Suspend
              </Menu.Item>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item
                icon={<Dimensions size={14} />}
                disabled={loading || record.status !== "SHUTOFF"}
                onClick={() => setResize(record)}
              >
                Resize
              </Menu.Item>
              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item
                color="red"
                icon={<Trash size={14} />}
                onClick={() => remove(record)}
              >
                Delete
              </Menu.Item>
            </Menu>
          );
        },
      },
    ],
    [
      flavors.isLoading,
      flavors.data,
      reboot,
      start,
      stop,
      resume,
      suspend,
      remove,
    ]
  );

  return (
    <>
      <PageTitle
        title="Virtual servers"
        loading={instances.isFetching}
        onRefresh={instances.refetch}
        search={search}
        onSearchChange={setSearch}
        extra={
          <Button
            radius="md"
            variant="outline"
            leftIcon={<CodePlus />}
            onClick={() => setCreate(true)}
          >
            Create
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={instances.isLoading}
        />
      </PageTitle>
      <CreateModal visible={create} onClose={() => setCreate(false)} />
      <ResizeModal instance={resize} onClose={() => setResize(undefined)} />
    </>
  );
};

export default Instances;
