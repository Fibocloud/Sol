import INSTANCE from "$/services/instances";
import { Instance } from "$/services/instances/types";
import { Badge, Button, Group, Loader, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import React, { FC, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

interface Props {
  instance: Instance;
}

const ResizeConfirm: FC<Props> = ({ instance }) => {
  let modalID = "";
  const modals = useModals();
  const client = useQueryClient();
  const [loading, setLoading] = useState(false);
  const confirmResize = useMutation(INSTANCE.confirmResize, {
    onSuccess: () => {
      showNotification({
        color: "green",
        message: "Successfully resize confirmed",
      });
      client.invalidateQueries(["instance"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
    onSettled: () => {
      modals.closeModal(modalID);
      setLoading(true);
    },
  });
  const revertResize = useMutation(INSTANCE.revertResize, {
    onSuccess: () => {
      showNotification({
        color: "green",
        message: "Successfully reverted confirmed",
      });
      client.invalidateQueries(["instance"]);
      modals.closeModal(modalID);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
    onSettled: () => {
      modals.closeModal(modalID);
      setLoading(true);
    },
  });

  const handleConfirm = (instance: Instance) => {
    modalID = modals.openModal({
      title: "Confirm resize",
      children: (
        <Stack spacing="xs">
          <Text size="sm">
            Server name: <strong>{instance.name}</strong>
          </Text>
          <Text size="sm">
            Are you sure you want to confirm resize this instance?
          </Text>
          <Group mt="lg" position="right">
            <Button
              type="button"
              variant="outline"
              onClick={() => modals.closeModal(modalID)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              type="button"
              onClick={() => revertResize.mutate(instance.id)}
            >
              Revert
            </Button>
            <Button
              type="button"
              onClick={() => confirmResize.mutate(instance.id)}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      ),
    });
  };

  return loading ? (
    <Badge color="teal" variant="outline">
      <Loader variant="dots" size="xs" /> {instance.status}
    </Badge>
  ) : (
    <Badge
      color="blue"
      variant="outline"
      sx={{ cursor: "pointer" }}
      onClick={() => handleConfirm(instance)}
    >
      {instance.status}
    </Badge>
  );
};

export default ResizeConfirm;
