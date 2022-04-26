import INSTANCE from "$/services/instances";
import { Instance, InstanceStatus } from "$/services/instances/types";
import { Badge, Loader } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import React, { FC, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import ResizeConfirm from "./resize_confirm";

interface Props {
  instance: Instance;
}

const Status: FC<Props> = ({ instance }) => {
  switch (instance.status) {
    case "ACTIVE":
      return (
        <Badge color="green" variant="outline">
          {instance.status}
        </Badge>
      );
    case "DELETED":
      return (
        <Badge color="pink" variant="filled">
          {instance.status}
        </Badge>
      );
    case "ERROR":
      return (
        <Badge color="red" variant="filled">
          {instance.status}
        </Badge>
      );
    case "PAUSED":
      return (
        <Badge color="gray" variant="filled">
          {instance.status}
        </Badge>
      );
    case "RESCUE":
      return <Badge color="yellow">{instance.status}</Badge>;
    case "SHELVED":
      return <Badge color="gray">{instance.status}</Badge>;
    case "SHELVED_OFFLOADED":
      return <Badge color="gray">{instance.status}</Badge>;
    case "SHUTOFF":
      return (
        <Badge color="gray" variant="outline">
          {instance.status}
        </Badge>
      );
    case "SOFT_DELETED":
      return <Badge color="pink">{instance.status}</Badge>;
    case "SUSPENDED":
      return (
        <Badge color="gray" variant="light">
          {instance.status}
        </Badge>
      );
    case "UNKNOWN":
      return (
        <Badge color="gray" variant="dot">
          {instance.status}
        </Badge>
      );
    case "VERIFY_RESIZE":
      return <ResizeConfirm instance={instance} />;
    default:
      return (
        <Badge color="teal" variant="outline">
          <Loader variant="dots" size="xs" /> {instance.status}
        </Badge>
      );
  }
};

export default Status;
