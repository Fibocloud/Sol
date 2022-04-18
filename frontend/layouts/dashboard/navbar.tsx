import {
  Box,
  Group,
  Navbar,
  ScrollArea,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import React, { FC } from "react";
import {
  AlertCircle,
  Database,
  GitPullRequest,
  Messages,
} from "tabler-icons-react";
import Profile from "./profile";

const data = [
  { icon: <GitPullRequest size={16} />, color: "blue", label: "Pull Requests" },
  { icon: <AlertCircle size={16} />, color: "teal", label: "Open Issues" },
  { icon: <Messages size={16} />, color: "violet", label: "Discussions" },
  { icon: <Database size={16} />, color: "grape", label: "Databases" },
];

interface Props {
  open: boolean;
}

const NavBar: FC<Props> = ({ open }) => {
  return (
    <Navbar
      px="md"
      pb="md"
      hidden={!open}
      width={{ sm: 300 }}
      hiddenBreakpoint="sm"
    >
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <Box py="md">
          {data.map((item) => (
            <UnstyledButton
              key={item.label}
              sx={(theme) => ({
                display: "block",
                width: "100%",
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.black,

                "&:hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[0],
                },
              })}
            >
              <Group>
                <ThemeIcon color={item.color} variant="light">
                  {item.icon}
                </ThemeIcon>

                <Text size="sm">{item.label}</Text>
              </Group>
            </UnstyledButton>
          ))}
        </Box>
      </Navbar.Section>
      <Navbar.Section>
        <Profile />
      </Navbar.Section>
    </Navbar>
  );
};

export default NavBar;
