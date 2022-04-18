import { AppShell, useMantineTheme } from "@mantine/core";
import React, { FC, ReactNode, useState } from "react";
import {
  AlertCircle,
  Database,
  GitPullRequest,
  Messages,
} from "tabler-icons-react";
import NavBar from "./navbar";
import TopBar from "./topbar";

const data = [
  { icon: <GitPullRequest size={16} />, color: "blue", label: "Pull Requests" },
  { icon: <AlertCircle size={16} />, color: "teal", label: "Open Issues" },
  { icon: <Messages size={16} />, color: "violet", label: "Discussions" },
  { icon: <Database size={16} />, color: "grape", label: "Databases" },
];

interface Props {
  children: ReactNode;
}

const DashboardLayout: FC<Props> = ({ children }) => {
  const theme = useMantineTheme();
  const [open, setOpen] = useState(false);

  return (
    <AppShell
      fixed
      navbarOffsetBreakpoint="sm"
      navbar={<NavBar open={open} />}
      header={<TopBar open={open} setOpen={setOpen} />}
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
    >
      {children}
    </AppShell>
  );
};

export default DashboardLayout;
