import { Group, Paper, Stack, Title } from "@mantine/core";
import type { NextPage } from "next";
import React from "react";

const Volumes: NextPage = () => {
  return (
    <Stack>
      <Paper radius="lg" px="md" py="xs" shadow="sm">
        <Group position="apart">
          <Title order={5}>Disks</Title>
        </Group>
      </Paper>
      <Paper radius="lg" shadow="sm" px="md" py="xs">
        Volumes
      </Paper>
    </Stack>
  );
};

export default Volumes;
