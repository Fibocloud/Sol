import AUTH from "$/services/auth";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";
import React, { FC } from "react";

const Home: FC = () => {
  const router = useRouter();
  if (AUTH.hasToken()) {
    router.replace("/dashboard");
  } else {
    router.replace("/auth/login");
  }

  return <LoadingOverlay visible />;
};

export default Home;
