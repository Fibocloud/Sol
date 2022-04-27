import useMount from "$/hooks/useMount";
import { Box, Button, Group, Navbar, ScrollArea } from "@mantine/core";
import {
  openSpotlight,
  SpotlightAction,
  SpotlightProvider,
} from "@mantine/spotlight";
import { Router } from "next/router";
import React, { FC } from "react";
import {
  BrandCodesandbox,
  ChartPie,
  CodePlus,
  Command,
  Database,
  Flame,
  Key,
  Resize,
  Search,
  Server,
} from "tabler-icons-react";
import NavTop from "./navtop";
import NavItem from "./nav_item";
import Profile from "./profile";

const data = [
  {
    icon: <ChartPie size={16} />,
    label: "Overview",
    path: "/dashboard",
    description: "Get full information about current system status",
  },
  {
    icon: <Server size={16} />,
    color: "blue",
    label: "Virtual servers",
    path: "/dashboard/instance",
    description: "Manage your virtual servers",
  },
  {
    icon: <Key size={16} />,
    label: "SSH keys",
    path: "/dashboard/keypair",
    description: "Manage your ssh keys",
  },
  {
    icon: <Database size={16} />,
    label: "Disks",
    path: "/dashboard/volume",
    description: "Manage your disks",
  },
  {
    icon: <Flame size={16} />,
    label: "Firewalls",
    path: "/dashboard/sec_group",
    description: "Manage your firewalls",
  },
  {
    icon: <Resize size={16} />,
    label: "Limits",
    path: "/dashboard/flavor",
    description: "Manage your limits",
  },
  {
    icon: <BrandCodesandbox size={16} />,
    label: "Cloud images",
    path: "/dashboard/image",
    description: "Manage your cloud images",
  },
];

interface Props {
  open: boolean;
  router: Router;
}

const spotlightAction: SpotlightAction[] = [
  {
    icon: <CodePlus size={18} />,
    title: "Create a virtual machine",
    description: "Create new virtual machine with configuration",
    onTrigger: () => console.log("Home"),
  },
];

const NavBar: FC<Props> = ({ open, router }) => {
  useMount(() => {
    data.forEach((item) =>
      spotlightAction.push({
        id: item.path,
        title: item.label,
        icon: item.icon,
        description: item.description,
        onTrigger: () => router.push(item.path),
      })
    );
  });

  return (
    <Navbar
      px="md"
      pb="md"
      hidden={!open}
      width={{ sm: 260 }}
      hiddenBreakpoint="sm"
    >
      <Navbar.Section>
        <NavTop />
      </Navbar.Section>
      <Navbar.Section mt="xs">
        <SpotlightProvider
          actions={spotlightAction}
          shortcut="mod + k"
          searchPlaceholder="Search..."
          searchIcon={<Search size={18} />}
          nothingFoundMessage="Nothing found..."
        >
          <Button
            fullWidth
            radius="md"
            variant="filled"
            leftIcon={<Search size={16} />}
            onClick={openSpotlight}
            rightIcon={
              <Group
                sx={{
                  gap: 2,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Command size={16} />
                <span>+</span>
                <span>K</span>
              </Group>
            }
          >
            Search...
          </Button>
        </SpotlightProvider>
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <Box py="md">
          {data.map((item) => (
            <NavItem
              key={item.path}
              active={item.path === router.pathname}
              {...item}
            />
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
