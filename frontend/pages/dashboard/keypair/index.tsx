import PageTitle from "$/components/page_title";
import Table from "$/components/table";
import useCreate from "$/hooks/useCreate";
import useSearch from "$/hooks/useSearch";
import KEYPAIR from "$/services/keypair";
import { Keypair } from "$/services/keypair/types";
import { textSearch } from "$/utils";
import CreateModal from "$/widgets/keypair/create";
import { Button, Menu, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Column } from "react-table";
import { CodePlus, Trash } from "tabler-icons-react";

const Keypairs: NextPage = () => {
  const modals = useModals();
  const client = useQueryClient();
  const [search, setSearch] = useSearch();
  const [create, setCreate] = useCreate();
  const keypairs = useQuery(["keypair", "list"], KEYPAIR.list);
  const data = useMemo<Keypair[]>(
    () => (keypairs.data || []).filter((i) => textSearch(i.name, search)),
    [keypairs.data, search]
  );
  const remove = useMutation(KEYPAIR.delete, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully deleted" });
      client.invalidateQueries(["keypair"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });

  const handleDelete = useCallback(
    (keypair: Keypair) => {
      modals.openConfirmModal({
        title: "You are trying to delete!",
        children: (
          <Stack spacing="xs">
            <Text size="sm">
              SSH key name: <strong>{keypair.name}</strong>
            </Text>
            <Text size="sm">
              Are you sure you want to delete this ssh key? This action is
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

  const columns = useMemo<Column<Keypair>[]>(
    () => [
      {
        id: "name",
        Header: "NAME",
        accessor: (record) => record.name,
      },
      {
        id: "fingerprint",
        Header: "FINGERPRINT",
        accessor: (record) => record.fingerprint,
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
        title="SSH keys"
        loading={keypairs.isFetching}
        onRefresh={keypairs.refetch}
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
          loading={keypairs.isLoading}
        />
      </PageTitle>
      <CreateModal visible={create} onClose={() => setCreate(false)} />
    </>
  );
};

export default Keypairs;
