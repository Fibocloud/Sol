import { Button, Card, Group, Paper, Stack, Title } from "@mantine/core";
import type { NextPage } from "next";
import React from "react";
import { CodePlus } from "tabler-icons-react";

const Home: NextPage = () => {
  return (
    <Stack>
      <Paper radius="lg" px="md" py="xs" shadow="sm">
        <Group position="apart">
          <Title order={5}>Overview</Title>
        </Group>
      </Paper>
      <Paper radius="lg" shadow="sm" px="md" py="xs">
        body
      </Paper>
    </Stack>
  );
};

export default Home;
