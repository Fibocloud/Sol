import PageTitle from "$/components/page_title";
import Table from "$/components/table";
import useSearch from "$/hooks/useSearch";
import IMAGE from "$/services/image";
import { Image } from "$/services/image/types";
import { formatGB, formatMB, textSearch } from "$/utils";
import { Menu, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import React, { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Column } from "react-table";
import { Trash } from "tabler-icons-react";

const Images: NextPage = () => {
  const modals = useModals();
  const client = useQueryClient();
  const [search, setSearch] = useSearch();
  const images = useQuery(["image", "list"], IMAGE.list);
  const data = useMemo<Image[]>(
    () =>
      (images.data || []).filter(
        (i) => i.ID === search || textSearch(i.Name, search)
      ),
    [images.data, search]
  );
  const remove = useMutation(IMAGE.delete, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully deleted" });
      client.invalidateQueries(["image"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });

  const handleDelete = useCallback(
    (image: Image) => {
      modals.openConfirmModal({
        title: "You are trying to delete!",
        children: (
          <Stack spacing="xs">
            <Text size="sm">
              Cloud image name: <strong>{image.Name}</strong>
            </Text>
            <Text size="sm">
              Are you sure you want to delete this cloud image? This action is
              irreversible.
            </Text>
          </Stack>
        ),
        confirmProps: { color: "red" },
        labels: { confirm: "Delete", cancel: "Cancel" },
        onConfirm: () => remove.mutate(image.ID),
      });
    },
    [modals, remove]
  );

  const columns = useMemo<Column<Image>[]>(
    () => [
      {
        id: "name",
        Header: "NAME",
        accessor: (record) => record.Name,
      },
      {
        id: "status",
        Header: "STATUS",
        accessor: (record) => record.Status,
      },
      {
        id: "min_ram",
        Header: "MINIMUM RAM",
        accessor: (record) => formatMB(record.MinRAM),
      },
      {
        id: "min_disk",
        Header: "MINIMUM DISK",
        accessor: (record) => formatGB(record.MinDisk),
      },
      {
        id: "description",
        Header: "DESCRIPTION",
        accessor: (record) => record.Metadata?.description,
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
        title="Cloud images"
        loading={images.isFetching}
        onRefresh={images.refetch}
        search={search}
        onSearchChange={setSearch}
      >
        <Table columns={columns} dataSource={data} loading={images.isLoading} />
      </PageTitle>
    </>
  );
};

export default Images;
