import { InstanceStatus } from "$/services/instances/types";
import dayjs from "dayjs";

export const moneyFormat = (money?: number | null) => {
  if (!money) return "0";
  return new Intl.NumberFormat().format(money);
};

export const isEmptyDate = (date?: string | null) => {
  if (!date) return true;
  return date.startsWith("0001-01-01");
};

export const renderDate = (date?: Date | string | null, time = false) => {
  if (!date) return "-";
  return isEmptyDate(date?.toString())
    ? "-"
    : dayjs(date).format(time ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD");
};

export const renderTime = (date?: Date | string | null) => {
  if (!date) return "-";
  return isEmptyDate(date?.toString()) ? "-" : dayjs(date).format("HH:mm:ss");
};

export const isProcessing = (status: InstanceStatus) =>
  [
    "BUILD",
    "REBOOT",
    "REBUILD",
    "HARD_REBOOT",
    "REVERT_RESIZE",
    "PASSWORD",
    "MIGRATING",
    "STARTING",
    "STOPING",
    "DELETING",
    "SUSPENDING",
    "RESUMING",
    "RESIZE",
  ].includes(status);
