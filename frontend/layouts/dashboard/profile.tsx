import { useStore } from "$/contexts";
import { Action } from "$/contexts/types";
import {
  Avatar,
  Box,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { ChevronRight, Logout } from "tabler-icons-react";

const Profile: FC = () => {
  const router = useRouter();
  const modals = useModals();
  const theme = useMantineTheme();
  const [{ auth }, setStore] = useStore();

  const handleLogout = () => {
    modals.openConfirmModal({
      title: "You're trying to logout!",
      children: <Text size="sm">Are you sure you want to logout?</Text>,
      labels: { confirm: "Logout", cancel: "Stay" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        setStore([Action.SIGN_OUT]);
        router.replace("/");
      },
    });
  };

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <Menu
        withArrow
        placement="start"
        sx={{ width: "100%" }}
        control={
          <UnstyledButton
            sx={{
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
            }}
          >
            <Group>
              <Avatar
                src="https://static.swatch.com/images/product/SO33M100/sa200/SO33M100_sa200_er005.png"
                radius="xl"
              />
              <Box sx={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {auth?.username}
                </Text>
                <Text color="dimmed" size="xs">
                  Administrator
                </Text>
              </Box>
              <ChevronRight size={18} />
            </Group>
          </UnstyledButton>
        }
      >
        <Menu.Item
          color="red"
          icon={<Logout size={14} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Box>
  );
};

export default Profile;
