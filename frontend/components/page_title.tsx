import {
  Button,
  Group,
  Paper,
  Title,
  Loader,
  Transition,
  Stack,
} from "@mantine/core";
import React, { FC, PropsWithChildren } from "react";
import { RotateClockwise2 } from "tabler-icons-react";

interface Props {
  title: string;
  loading?: boolean;
  onRefresh?: () => void;
  extra?: React.ReactNode;
}

const PageTitle: FC<PropsWithChildren<Props>> = ({
  title,
  onRefresh,
  extra,
  children,
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
            {onRefresh && (
              <Button
                px="xs"
                radius="lg"
                variant="subtle"
                onClick={() => onRefresh()}
              >
                <RotateClockwise2 />
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
