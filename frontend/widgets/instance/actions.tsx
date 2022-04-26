import INSTANCE from "$/services/instances";
import { Instance } from "$/services/instances/types";
import { Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";

const useInstanceActions = () => {
  const modals = useModals();
  const client = useQueryClient();

  const reboot = useMutation((id: string) => INSTANCE.reboot(id, false), {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully rebooted" });
      client.invalidateQueries(["instance"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const start = useMutation(INSTANCE.start, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully started" });
      client.invalidateQueries(["instance"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const stop = useMutation(INSTANCE.stop, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully stopped" });
      client.invalidateQueries(["instance"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const resume = useMutation(INSTANCE.resume, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully resumed" });
      client.invalidateQueries(["instance"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const suspend = useMutation(INSTANCE.suspend, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully suspended" });
      client.invalidateQueries(["instance"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });
  const remove = useMutation(INSTANCE.delete, {
    onSuccess: () => {
      showNotification({ color: "green", message: "Successfully deleted" });
      client.invalidateQueries(["instance"]);
    },
    onError: (err: string) => showNotification({ color: "red", message: err }),
  });

  const handleReboot = useCallback(
    (instance: Instance) => {
      modals.openConfirmModal({
        title: "You are trying to reboot!",
        children: (
          <Stack spacing="xs">
            <Text size="sm">
              Resource ID: <strong>{instance.name}</strong>
            </Text>
            <Text size="sm">
              Are you sure you want to reboot this instance?
            </Text>
          </Stack>
        ),
        confirmProps: { color: "orange" },
        labels: { confirm: "Reboot", cancel: "Cancel" },
        onConfirm: () => reboot.mutate(instance.id),
      });
    },
    [modals, reboot]
  );

  const handleStart = useCallback(
    (instance: Instance) => {
      modals.openConfirmModal({
        title: "You are trying to start!",
        children: (
          <Stack spacing="xs">
            <Text size="sm">
              Resource ID: <strong>{instance.name}</strong>
            </Text>
            <Text size="sm">Are you sure you want to start this instance?</Text>
          </Stack>
        ),
        confirmProps: { color: "green" },
        labels: { confirm: "Start", cancel: "Cancel" },
        onConfirm: () => start.mutate(instance.id),
      });
    },
    [modals, start]
  );

  const handleStop = useCallback(
    (instance: Instance) => {
      modals.openConfirmModal({
        title: "You are trying to stop!",
        children: (
          <Stack spacing="xs">
            <Text size="sm">
              Resource ID: <strong>{instance.name}</strong>
            </Text>
            <Text size="sm">Are you sure you want to stop this instance?</Text>
          </Stack>
        ),
        confirmProps: { color: "orange" },
        labels: { confirm: "Stop", cancel: "Cancel" },
        onConfirm: () => stop.mutate(instance.id),
      });
    },
    [modals, stop]
  );

  const handleResume = useCallback(
    (instance: Instance) => {
      modals.openConfirmModal({
        title: "You are trying to resume!",
        children: (
          <Stack spacing="xs">
            <Text size="sm">
              Resource ID: <strong>{instance.name}</strong>
            </Text>
            <Text size="sm">
              Are you sure you want to resume this instance?
            </Text>
          </Stack>
        ),
        confirmProps: { color: "green" },
        labels: { confirm: "Resume", cancel: "Cancel" },
        onConfirm: () => resume.mutate(instance.id),
      });
    },
    [modals, resume]
  );

  const handleSuspend = useCallback(
    (instance: Instance) => {
      modals.openConfirmModal({
        title: "You are trying to suspend!",
        children: (
          <Stack spacing="xs">
            <Text size="sm">
              Resource ID: <strong>{instance.name}</strong>
            </Text>
            <Text size="sm">
              Are you sure you want to suspend this instance?
            </Text>
          </Stack>
        ),
        confirmProps: { color: "orange" },
        labels: { confirm: "Suspend", cancel: "Cancel" },
        onConfirm: () => suspend.mutate(instance.id),
      });
    },
    [modals, suspend]
  );

  const handleDelete = useCallback(
    (instance: Instance) => {
      modals.openConfirmModal({
        title: "You are trying to delete!",
        children: (
          <Stack spacing="xs">
            <Text size="sm">
              Server name: <strong>{instance.name}</strong>
            </Text>
            <Text size="sm">
              Are you sure you want to delete this instance? This action is
              irreversible.
            </Text>
          </Stack>
        ),
        confirmProps: { color: "red" },
        labels: { confirm: "Delete", cancel: "Cancel" },
        onConfirm: () => remove.mutate(instance.id),
      });
    },
    [modals, remove]
  );

  return {
    remove: handleDelete,
    reboot: handleReboot,
    start: handleStart,
    stop: handleStop,
    resume: handleResume,
    suspend: handleSuspend,
  };
};

export default useInstanceActions;
