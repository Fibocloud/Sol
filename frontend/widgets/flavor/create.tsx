import FLAVOR from "$/services/flavor";
import { CreateFlavorInput } from "$/services/flavor/types";
import {
  Button,
  Group,
  InputWrapper,
  LoadingOverlay,
  Modal,
  NumberInput,
  SimpleGrid,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import React, { FC } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  Affiliate,
  Artboard,
  BoxMargin,
  CircleDashed,
  DeviceFloppy,
  WritingSign,
} from "tabler-icons-react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CreateModal: FC<Props> = ({ visible, onClose }) => {
  const client = useQueryClient();
  const create = useMutation(FLAVOR.create, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully created" });
      client.invalidateQueries(["flavor"]);
      handleClose();
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const form = useForm<CreateFlavorInput>({
    initialValues: {
      name: "",
      ram: 0,
      vcpus: 0,
      rx_tx_factor: 1,
      is_public: false,
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
      title="Create limit"
      opened={visible}
      onClose={handleClose}
    >
      <LoadingOverlay visible={create.isLoading} zIndex={1000} />
      <form onSubmit={form.onSubmit(create.mutate)}>
        <SimpleGrid
          cols={2}
          spacing="lg"
          breakpoints={[{ maxWidth: "sm", cols: 1, spacing: "sm" }]}
        >
          <TextInput
            required
            placeholder="Name"
            label="Limit name"
            icon={<WritingSign />}
            {...form.getInputProps("name")}
          />
          <NumberInput
            required
            min={0}
            hideControls
            label="VCPUs"
            icon={<Artboard />}
            placeholder="Virtual CPUs"
            {...form.getInputProps("vcpus")}
          />
          <NumberInput
            required
            min={0}
            label="Ram"
            icon={<BoxMargin />}
            placeholder="Memory size"
            rightSection="MB"
            rightSectionProps={{
              style: {
                width: "4ch",
                color: "gray",
                userSelect: "none",
                pointerEvents: "none",
              },
            }}
            {...form.getInputProps("ram")}
          />
          <NumberInput
            required
            min={0}
            label="Root disk"
            icon={<DeviceFloppy />}
            placeholder="Root volume size"
            rightSection="GB"
            rightSectionProps={{
              style: {
                width: "4ch",
                color: "gray",
                userSelect: "none",
                pointerEvents: "none",
              },
            }}
            {...form.getInputProps("disk")}
          />
          <NumberInput
            min={0}
            label="Ephemeral disk"
            icon={<CircleDashed />}
            placeholder="Ephemeral volume size"
            rightSection="GB"
            rightSectionProps={{
              style: {
                width: "4ch",
                color: "gray",
                userSelect: "none",
                pointerEvents: "none",
              },
            }}
            {...form.getInputProps("ephemeral")}
          />
          <NumberInput
            min={0}
            max={1}
            step={0.01}
            precision={2}
            hideControls
            label="RX/TX factor"
            icon={<Affiliate />}
            placeholder="RX/TX factor"
            {...form.getInputProps("rx_tx_factor")}
          />
          <InputWrapper labelElement="div" label="Public">
            <Switch
              size="lg"
              aria-label="is public"
              {...form.getInputProps("is_public")}
            />
          </InputWrapper>
        </SimpleGrid>
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
