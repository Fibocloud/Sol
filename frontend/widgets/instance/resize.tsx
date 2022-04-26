import FLAVOR from "$/services/flavor";
import INSTANCE from "$/services/instances";
import { Instance } from "$/services/instances/types";
import {
  Button,
  Group,
  InputWrapper,
  LoadingOverlay,
  Modal,
  Select,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import React, { FC } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Resize } from "tabler-icons-react";

interface Props {
  instance?: Instance;
  onClose: () => void;
}

const ResizeModal: FC<Props> = ({ instance, onClose }) => {
  const client = useQueryClient();
  const flavors = useQuery(["flavor", "list"], FLAVOR.list);
  const resize = useMutation(INSTANCE.resize, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully resized" });
      client.invalidateQueries(["instance"]);
      onClose();
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const form = useForm<{ flavor_id: string }>({
    initialValues: {
      flavor_id: "",
    },
  });

  return (
    <Modal
      padding="lg"
      title="Create instance"
      opened={!!instance}
      onClose={onClose}
    >
      <LoadingOverlay visible={resize.isLoading} zIndex={1000} />
      <form
        onSubmit={form.onSubmit((values) => {
          if (instance) {
            resize.mutate({ id: instance.id, flavor_id: values.flavor_id });
          }
        })}
      >
        <Text size="sm">
          Server name: <strong>{instance?.name}</strong>
        </Text>
        <InputWrapper mt="sm" label="Old flavor">
          <Select
            disabled
            value={instance?.flavor.id}
            data={(flavors.data || []).map((i) => ({
              value: i.id,
              label: i.name,
            }))}
          />
        </InputWrapper>
        <Select
          required
          searchable
          mt="sm"
          icon={<Resize />}
          label="New flavor"
          placeholder="New flavor"
          nothingFound="No flavor found"
          data={(flavors.data || [])
            .filter((i) => i.id !== instance?.flavor.id)
            .map((i) => ({
              value: i.id,
              label: i.name,
            }))}
          {...form.getInputProps("flavor_id")}
        />
        <Group mt="lg" position="right">
          <Button type="reset" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Resize</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ResizeModal;
