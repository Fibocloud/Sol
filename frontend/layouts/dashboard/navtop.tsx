import { default as LogoIcon } from "$/assets/logo.svg";
import {
  ActionIcon,
  Box,
  Group,
  Space,
  Title,
  useMantineColorScheme
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { FC } from "react";
import { MoonStars, Sun } from "tabler-icons-react";

const NavTop: FC = () => {
  const desktop = useMediaQuery("(min-width: 768px)");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return desktop ? (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
      })}
    >
      <Group position="apart">
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "2rem",
              height: "2rem",
            }}
          >
            <LogoIcon />
          </Box>
          <Space w="md" />
          <Title order={4}>FIBO VMM</Title>
        </div>
        <ActionIcon
          size={30}
          variant="default"
          onClick={() => toggleColorScheme()}
        >
          {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
        </ActionIcon>
      </Group>
    </Box>
  ) : (
    <></>
  );
};

export default NavTop;
