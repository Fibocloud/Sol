import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import Link from "next/link";
import React, { FC } from "react";

export interface NavItemRecord {
  path: string;
  label: string;
  color: string;
  icon?: JSX.Element;
  active?: boolean;
}

const NavItem: FC<NavItemRecord> = ({ path, label, color, icon, active }) => (
  <Link href={path} passHref>
    <UnstyledButton
      component="a"
      sx={(theme) => {
        let color = theme.black;
        let bgColor = undefined;
        let bgHover = theme.colors.gray[0];
        if (theme.colorScheme === "dark") {
          color = theme.colors.dark[0];
          bgHover = theme.colors.dark[6];
        }
        if (active) {
          color = theme.white;
          bgHover = theme.colors[theme.primaryColor][7];
          bgColor = theme.colors[theme.primaryColor][8];
        }
        return {
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: color,
          backgroundColor: bgColor,
          "&:hover": {
            backgroundColor: bgHover,
          },
        };
      }}
    >
      <Group>
        {icon && (
          <ThemeIcon color={color} variant={active ? "filled" : "light"}>
            {icon}
          </ThemeIcon>
        )}
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  </Link>
);

export default NavItem;
