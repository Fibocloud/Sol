import { useStore } from "$/contexts";
import { Center } from "@mantine/core";
import { Router, useRouter } from "next/router";
import React, { FC, PropsWithChildren, useEffect } from "react";

interface Props {
  router: Router;
}

const AuthLayout: FC<PropsWithChildren<Props>> = ({ router, children }) => {
  const [store] = useStore();

  useEffect(() => {
    if (store.authorized) {
      router.replace("/");
    }
  }, [router, store.authorized]);

  return <Center sx={{ height: "100vh" }}>{children}</Center>;
};

export default AuthLayout;
