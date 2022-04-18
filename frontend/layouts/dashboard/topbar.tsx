import {
  ActionIcon,
  Burger,
  Group,
  Header,
  MediaQuery,
  Space,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import React, { Dispatch, FC, SetStateAction } from "react";
import { MoonStars, Sun } from "tabler-icons-react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const TopBar: FC<Props> = ({ open, setOpen }) => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Header height={48}>
      <Group sx={{ height: "100%" }} px={24} position="apart">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            size="sm"
            opened={open}
            color={theme.colors.gray[6]}
            onClick={() => setOpen((o) => !o)}
          />
        </MediaQuery>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={32}
            viewBox="6 6 36 36"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="#FF9800" d="M11 11H37V37H11z" />
            <path
              fill="#FF9800"
              d="M11.272 11.272H36.728V36.728H11.272z"
              transform="rotate(-45.001 24 24)"
            />
            <path
              fill="#FFEB3B"
              d="M13,24c0,6.077,4.923,11,11,11c6.076,0,11-4.923,11-11s-4.924-11-11-11C17.923,13,13,17.923,13,24"
            />
          </svg>
          <Space w="md" />
          <Title order={4}>The Sol</Title>
        </div>
        <ActionIcon
          size={30}
          variant="default"
          onClick={() => toggleColorScheme()}
        >
          {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
        </ActionIcon>
      </Group>
    </Header>
  );
};

export default TopBar;
