import BooleanStatus from "$/components/boolean_status";
import PageTitle from "$/components/page_title";
import Table from "$/components/table";
import useSearch from "$/hooks/useSearch";
import FLAVOR from "$/services/flavor";
import { Flavor } from "$/services/flavor/types";
import { formatGB, formatMB, formatPercent, textSearch } from "$/utils";
import CreateModal from "$/widgets/flavor/create";
import { Button, Menu, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Column } from "react-table";
import { CodePlus, Trash } from "tabler-icons-react";

const Flavors: NextPage = () => {
  const modals = useModals();
  const client = useQueryClient();
  const [search, setSearch] = useSearch();
  const [create, setCreate] = useState(false);
  const flavors = useQuery(["flavor", "list"], FLAVOR.list);
  const data = useMemo<Flavor[]>(
    () =>
      (flavors.data || []).filter(
        (i) => i.id === search || textSearch(i.name, search)
      ),
    [flavors.data, search]
  );
  const remove = useMutation(FLAVOR.delete, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully deleted" });
      client.invalidateQueries(["flavor"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });

  const handleDelete = useCallback(
    (flavor: Flavor) => {
      modals.openConfirmModal({
        title: "You are trying to delete!",
        children: (
          <Stack spacing="xs">
            <Text size="sm">
              Limit name: <strong>{flavor.name}</strong>
            </Text>
            <Text size="sm">
              Are you sure you want to delete this ssh key? This action is
              irreversible.
            </Text>
          </Stack>
        ),
        confirmProps: { color: "red" },
        labels: { confirm: "Delete", cancel: "Cancel" },
        onConfirm: () => remove.mutate(flavor.id),
      });
    },
    [modals, remove]
  );

  const columns = useMemo<Column<Flavor>[]>(
    () => [
      {
        id: "name",
        Header: "NAME",
        accessor: (record) => record.name,
      },
      {
        id: "vcpu",
        Header: "VCPU",
        accessor: (record) => record.vcpus,
      },
      {
        id: "ram",
        Header: "RAM",
        accessor: (record) => formatMB(record.ram),
      },
      {
        id: "root_disk",
        Header: "ROOT DISK",
        accessor: (record) => formatGB(record.disk),
      },
      {
        id: "ephemeral_disk",
        Header: "EPHEMERAL DISK",
        accessor: (record) => formatGB(record["OS-FLV-EXT-DATA:ephemeral"]),
      },
      {
        id: "rx/tx_factor",
        Header: "RX/TX FACTOR",
        accessor: (record) => formatPercent(record.rxtx_factor),
      },
      {
        id: "public",
        Header: "PUBLIC",
        accessor: (record) => (
          <BooleanStatus status={record["os-flavor-access:is_public"]} />
        ),
      },
      {
        id: "action",
        Header: "ACTION",
        accessor: (record) => {
          return (
            <Menu>
              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item
                color="red"
                icon={<Trash size={14} />}
                onClick={() => handleDelete(record)}
              >
                Delete
              </Menu.Item>
            </Menu>
          );
        },
      },
    ],
    [handleDelete]
  );

  return (
    <>
      <PageTitle
        title="Limits"
        loading={flavors.isFetching}
        onRefresh={flavors.refetch}
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
          loading={flavors.isLoading}
        />
      </PageTitle>
      <CreateModal visible={create} onClose={() => setCreate(false)} />
    </>
  );
};

export default Flavors;
