import { useStore } from "$/contexts";
import { Action } from "$/contexts/types";
import AUTH from "$/services/auth";
import type { LoginInput } from "$/services/auth/types";
import {
  Button,
  Checkbox,
  LoadingOverlay,
  Paper,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "react-query";
import { LockOpen, User } from "tabler-icons-react";

const Login: NextPage = () => {
  const router = useRouter();
  const [, setStore] = useStore();
  const login = useMutation(AUTH.login, {
    onSuccess: async (result, values) => {
      AUTH.rememberUser(values);
      AUTH.saveToken(result.token);
      setStore([Action.SIGN_IN, result.user]);
      showNotification({ color: "green", message: "Successfully entered" });
      router.replace("/");
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const form = useForm<LoginInput>({
    initialValues: AUTH.getRememberUser() || {
      username: "",
      password: "",
      remember: false,
    },
  });

  return (
    <Paper
      withBorder
      mx="sm"
      p="lg"
      shadow="lg"
      style={{
        width: "100%",
        maxWidth: 382,
        position: "relative",
      }}
    >
      <LoadingOverlay visible={login.isLoading} zIndex={1000} />
      <form onSubmit={form.onSubmit(login.mutate)}>
        <TextInput
          required
          icon={<User />}
          label="Username"
          placeholder="Username"
          {...form.getInputProps("username")}
        />
        <PasswordInput
          mt="md"
          required
          label="Password"
          icon={<LockOpen />}
          placeholder="Password"
          {...form.getInputProps("password")}
        />
        <Checkbox
          mt="md"
          label="Remember me"
          {...form.getInputProps("remember", { type: "checkbox" })}
        />
        <Button mt="md" fullWidth type="submit">
          Login
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
