import SEC_GROUP from "$/services/sec_group";
import { CreateSecGroupInput } from "$/services/sec_group/types";
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
import { AB, WritingSign } from "tabler-icons-react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CreateModal: FC<Props> = ({ visible, onClose }) => {
  const client = useQueryClient();
  const create = useMutation(SEC_GROUP.create, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully created" });
      client.invalidateQueries(["secgroup"]);
      handleClose();
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const form = useForm<CreateSecGroupInput>({
    initialValues: {
      name: "",
      description: "",
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
      title="Create firewall"
      opened={visible}
      onClose={handleClose}
    >
      <LoadingOverlay visible={create.isLoading} zIndex={1000} />
      <form onSubmit={form.onSubmit(create.mutate)}>
        <Stack spacing="md">
          <TextInput
            required
            placeholder="Name"
            label="Firewall name"
            icon={<WritingSign />}
            {...form.getInputProps("name")}
          />
          <TextInput
            required
            icon={<AB />}
            label="Description"
            placeholder="Description"
            {...form.getInputProps("description")}
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
