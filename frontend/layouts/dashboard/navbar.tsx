import { Box, Button, Group, Navbar, ScrollArea } from "@mantine/core";
import { openSpotlight, SpotlightProvider } from "@mantine/spotlight";
import { m } from "framer-motion";
import { Router } from "next/router";
import React, { FC } from "react";
import { Command, Search } from "tabler-icons-react";
import NavTop from "./navtop";
import NavItem from "./nav_item";
import Profile from "./profile";
import useSpotlightAction, { menu } from "./useSpotlightAction";

interface Props {
  open: boolean;
  router: Router;
}

const NavBar: FC<Props> = ({ open, router }) => {
  const actions = useSpotlightAction(router);
  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: -16 },
      }}
    >
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
            actions={actions}
            shortcut="mod + k"
            searchPlaceholder="Search..."
            searchIcon={<Search size={18} />}
            nothingFoundMessage="Nothing found..."
          >
            <Button
              fullWidth
              radius="md"
              variant="filled"
              onClick={openSpotlight}
              leftIcon={<Search size={16} />}
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
            {menu.map((item) => (
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
    </m.div>
  );
};

export default NavBar;
