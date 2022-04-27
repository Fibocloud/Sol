import {
  Button,
  Group,
  Input,
  Loader,
  Paper,
  Stack,
  Title,
  Transition,
} from "@mantine/core";
import React, { ChangeEvent, FC, PropsWithChildren } from "react";
import { RotateClockwise, Search } from "tabler-icons-react";

interface Props {
  title: string;
  loading?: boolean;
  onRefresh?: () => void;
  extra?: React.ReactNode;
  search?: string;
  onSearchChange?: (value: ChangeEvent<HTMLInputElement>) => void;
}

const PageTitle: FC<PropsWithChildren<Props>> = ({
  title,
  onRefresh,
  extra,
  children,
  search,
  onSearchChange,
  loading = false,
}) => {
  return (
    <Stack>
      <Paper radius="lg" px="md" py="xs" shadow="sm">
        <Group position="apart">
          <Group>
            <Title order={5}>{title}</Title>
            <Transition duration={300} transition="fade" mounted={loading}>
              {(style) => <Loader variant="dots" style={style} />}
            </Transition>
          </Group>
          <Group>
            {(search || onSearchChange) && (
              <Input
                radius="md"
                value={search}
                variant="filled"
                placeholder="Search..."
                onChange={onSearchChange}
                icon={<Search size={16} />}
              />
            )}
            {onRefresh && (
              <Button
                px="xs"
                radius="md"
                variant="subtle"
                onClick={() => onRefresh()}
              >
                <RotateClockwise />
              </Button>
            )}
            {extra}
          </Group>
        </Group>
      </Paper>
      {children && (
        <Paper py="xs" px="md" radius="lg" shadow="sm">
          {children}
        </Paper>
      )}
    </Stack>
  );
};

export default PageTitle;
