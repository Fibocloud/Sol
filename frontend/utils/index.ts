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

export const formatByte = (value: number, decimals = 1) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  if (value === 0) return "0";
  const k: number = 1024;
  const i = Math.floor(Math.log(value) / Math.log(k));
  const tmp = k ** i;
  const dm = decimals < 0 ? 0 : decimals;
  return `${parseFloat((value / tmp).toFixed(dm))}${sizes[i]}`;
};

export const formatKB = (value: number, decimals = 1) => {
  return formatByte(value * 1024, decimals);
};

export const formatMB = (value: number, decimals = 2) => {
  return formatByte(value * 1024 * 1024, decimals);
};

export const formatGB = (value: number, decimals = 2) => {
  return formatByte(value * 1024 * 1024 * 1024, decimals);
};

export const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(0)}%`;
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

export const textSearch = (source = "", keyboard = "") =>
  source.toLowerCase().includes(keyboard.toLowerCase());
