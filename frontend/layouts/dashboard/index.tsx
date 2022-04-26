import { useStore } from "$/contexts";
import { AppShell, useMantineTheme } from "@mantine/core";
import { Router } from "next/router";
import React, { FC, PropsWithChildren, useEffect, useState } from "react";
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
  router: Router;
}

const DashboardLayout: FC<PropsWithChildren<Props>> = ({
  router,
  children,
}) => {
  const [store] = useStore();
  const theme = useMantineTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!store.authorized) {
      router.replace("/auth/login");
    }
  }, [router, store.authorized]);

  return (
    <AppShell
      fixed
      navbarOffsetBreakpoint="sm"
      navbar={<NavBar open={open} router={router} />}
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
