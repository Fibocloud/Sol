import KEYPAIR from "$/services/keypair";
import { CreateKeypairInput } from "$/services/keypair/types";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import React, { FC } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Key, WritingSign } from "tabler-icons-react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CreateModal: FC<Props> = ({ visible, onClose }) => {
  const client = useQueryClient();
  const create = useMutation(KEYPAIR.create, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully created" });
      client.invalidateQueries(["keypair"]);
      handleClose();
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const form = useForm<CreateKeypairInput>({
    initialValues: {
      name: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      size="lg"
      padding="lg"
      title="Create ssh key"
      opened={visible}
      onClose={handleClose}
    >
      <LoadingOverlay visible={create.isLoading} zIndex={1000} />
      <form onSubmit={form.onSubmit(create.mutate)}>
        <Stack spacing="md">
          <TextInput
            required
            placeholder="Name"
            label="SSH key name"
            icon={<WritingSign />}
            {...form.getInputProps("name")}
          />
          <TextInput
            placeholder="Public key"
            label="Publish key"
            icon={<Key />}
            {...form.getInputProps("public_key")}
          />
        </Stack>
        <Group mt="lg" position="right">
          <Button type="reset" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CreateModal;
