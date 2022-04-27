import FLAVOR from "$/services/flavor";
import IMAGE from "$/services/image";
import INSTANCE from "$/services/instances";
import { CreateInstanceInput } from "$/services/instances/types";
import KEYPAIR from "$/services/keypair";
import NETWORK from "$/services/network";
import SEC_GROUP from "$/services/sec_group";
import {
  Button,
  Group,
  InputWrapper,
  LoadingOverlay,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  SimpleGrid,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import React, { FC } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Affiliate,
  BrandTabler,
  Key,
  Resize,
  Ruler2,
  ShieldLock,
  WritingSign,
} from "tabler-icons-react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CreateModal: FC<Props> = ({ visible, onClose }) => {
  const client = useQueryClient();
  const images = useQuery(["image", "list"], IMAGE.list);
  const flavors = useQuery(["flavor", "list"], FLAVOR.list);
  const networks = useQuery(["network", "list"], NETWORK.list);
  const keypairs = useQuery(["keypair", "list"], KEYPAIR.list);
  const secgroups = useQuery(["secgroup", "list"], SEC_GROUP.list);
  const create = useMutation(INSTANCE.create, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully created" });
      client.invalidateQueries(["instance"]);
      handleClose();
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const form = useForm<CreateInstanceInput>({
    initialValues: {
      source_type: "image",
      source_id: "",
      name: "",
      flavor_id: "",
      keypair_name: "",
      network_id: "",
      volume_size: 8,
      security_groups: [],
      delete_on_termination: true,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      size="xl"
      padding="lg"
      title="Create virtual server"
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
            label="Server name"
            icon={<WritingSign />}
            {...form.getInputProps("name")}
          />
          <Select
            required
            searchable
            label="Image"
            icon={<BrandTabler />}
            placeholder="Image"
            nothingFound="No image found"
            data={(images.data || []).map((i) => ({
              value: i.ID,
              label: i.Name,
            }))}
            {...form.getInputProps("source_id")}
          />
          <Select
            required
            label="Flavor"
            searchable
            icon={<Resize />}
            placeholder="Flavor"
            nothingFound="No flavor found"
            data={(flavors.data || []).map((i) => ({
              value: i.id,
              label: i.name,
            }))}
            {...form.getInputProps("flavor_id")}
          />
          <Select
            required
            searchable
            label="SSH Key"
            icon={<Key />}
            placeholder="Keypair"
            nothingFound="No keypair found"
            data={(keypairs.data || []).map((i) => ({
              value: i.name,
              label: i.name,
            }))}
            {...form.getInputProps("keypair_name")}
          />
          <Select
            required
            searchable
            label="Network"
            icon={<Affiliate />}
            placeholder="Network"
            nothingFound="No network found"
            data={(networks.data || []).map((i) => ({
              value: i.id,
              label: i.label,
            }))}
            {...form.getInputProps("network_id")}
          />
          <MultiSelect
            required
            searchable
            label="Firewalls"
            icon={<ShieldLock />}
            placeholder="Firewalls"
            nothingFound="No firewall found"
            data={(secgroups.data || []).map((i) => ({
              value: i.name,
              label: i.name,
            }))}
            {...form.getInputProps("security_groups")}
          />
          <NumberInput
            required
            min={8}
            max={96}
            label="Storage"
            icon={<Ruler2 />}
            placeholder="Volume size"
            rightSection="GB"
            rightSectionProps={{
              style: {
                width: "4ch",
                color: "gray",
                userSelect: "none",
                pointerEvents: "none",
              },
            }}
            {...form.getInputProps("volume_size")}
          />
          <InputWrapper labelElement="div" label=" ">
            <Switch
              mt="xs"
              aria-label="Delete on termination"
              label="Delete volume with server"
              {...form.getInputProps("delete_on_termination")}
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
