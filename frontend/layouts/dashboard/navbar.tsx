import { Box, Navbar, ScrollArea } from "@mantine/core";
import { Router } from "next/router";
import React, { FC } from "react";
import {
  ChartPie,
  Database,
  Flame,
  Key,
  Resize,
  Server,
} from "tabler-icons-react";
import NavTop from "./navtop";
import NavItem from "./nav_item";
import Profile from "./profile";

const data = [
  {
    icon: <ChartPie size={16} />,
    color: "green",
    label: "Overview",
    path: "/dashboard",
  },
  {
    icon: <Server size={16} />,
    color: "blue",
    label: "Virtual servers",
    path: "/dashboard/instance",
  },
  {
    icon: <Key size={16} />,
    color: "cyan",
    label: "SSH keys",
    path: "/dashboard/keypair",
  },
  {
    icon: <Database size={16} />,
    color: "grape",
    label: "Storages",
    path: "/dashboard/volume",
  },
  {
    icon: <Resize size={16} />,
    color: "orange",
    label: "Limits",
    path: "/dashboard/limit",
  },
  {
    icon: <Flame size={16} />,
    color: "red",
    label: "Firewalls",
    path: "/dashboard/firewall",
  },
];

interface Props {
  open: boolean;
  router: Router;
}

const NavBar: FC<Props> = ({ open, router }) => {
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
