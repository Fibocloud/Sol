import PageTitle from "$/components/page_title";
import Table from "$/components/table";
import useSearch from "$/hooks/useSearch";
import SEC_GROUP from "$/services/sec_group";
import { SecGroup } from "$/services/sec_group/types";
import { textSearch } from "$/utils";
import CreateModal from "$/widgets/sec_group/create";
import { Button, Menu, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Column } from "react-table";
import { CodePlus, Trash } from "tabler-icons-react";

const SecGroups: NextPage = () => {
  const modals = useModals();
  const client = useQueryClient();
  const [search, setSearch] = useSearch();
  const [create, setCreate] = useState(false);
  const secgroups = useQuery(["secgroup", "list"], SEC_GROUP.list);
  const data = useMemo<SecGroup[]>(
    () =>
      (secgroups.data || []).filter(
        (i) => textSearch(i.name, search) || textSearch(i.description, search)
      ),
    [search, secgroups.data]
  );
  const remove = useMutation(SEC_GROUP.delete, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully deleted" });
      client.invalidateQueries(["secgroup"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });

  const handleDelete = useCallback(
    (keypair: SecGroup) => {
      modals.openConfirmModal({
        title: "You are trying to delete!",
        children: (
          <Stack spacing="xs">
            <Text size="sm">
              Firewall name: <strong>{keypair.name}</strong>
            </Text>
            <Text size="sm">
              Are you sure you want to delete this firewall? This action is
              irreversible.
            </Text>
          </Stack>
        ),
        confirmProps: { color: "red" },
        labels: { confirm: "Delete", cancel: "Cancel" },
        onConfirm: () => remove.mutate(keypair.name),
      });
    },
    [modals, remove]
  );

  const columns = useMemo<Column<SecGroup>[]>(
    () => [
      {
        id: "name",
        Header: "NAME",
        accessor: (record) => record.name,
      },
      {
        id: "description",
        Header: "DESCRIPTION",
        accessor: (record) => record.description,
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
        title="Firewalls"
        loading={secgroups.isFetching}
        onRefresh={secgroups.refetch}
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
          loading={secgroups.isLoading}
        />
      </PageTitle>
      <CreateModal visible={create} onClose={() => setCreate(false)} />
    </>
  );
};

export default SecGroups;
