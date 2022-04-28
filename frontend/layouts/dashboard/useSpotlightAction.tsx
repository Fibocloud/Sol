import { SpotlightAction } from "@mantine/spotlight";
import { Router } from "next/router";
import { useMemo } from "react";
import {
  BrandCodesandbox,
  ChartPie,
  CodePlus,
  Database,
  Flame,
  Key,
  Resize,
  Server,
} from "tabler-icons-react";

export interface RouterRecord {
  path: string;
  label: string;
  icon: JSX.Element;
  description: string;
}

export const menu: RouterRecord[] = [
  {
    icon: <ChartPie size={16} />,
    label: "Overview",
    path: "/dashboard",
    description: "Get full information about current system status",
  },
  {
    icon: <Server size={16} />,
    label: "Virtual servers",
    path: "/dashboard/instance",
    description: "Manage your virtual servers",
  },
  {
    icon: <Key size={16} />,
    label: "SSH keys",
    path: "/dashboard/keypair",
    description: "Manage your ssh keys",
  },
  {
    icon: <Database size={16} />,
    label: "Disks",
    path: "/dashboard/volume",
    description: "Manage your disks",
  },
  {
    icon: <Flame size={16} />,
    label: "Firewalls",
    path: "/dashboard/sec_group",
    description: "Manage your firewalls",
  },
  {
    icon: <Resize size={16} />,
    label: "Limits",
    path: "/dashboard/flavor",
    description: "Manage your limits",
  },
  {
    icon: <BrandCodesandbox size={16} />,
    label: "Cloud images",
    path: "/dashboard/image",
    description: "Manage your cloud images",
  },
];

export const createResources = [
  {
    icon: <CodePlus size={18} />,
    label: "Create a virtual machine",
    path: "/dashboard/instance",
    description: "Create new virtual machine with configuration",
  },
  {
    icon: <CodePlus size={18} />,
    label: "Create a SSH key",
    path: "/dashboard/keypair",
    description: "Create new SSH key pair",
  },
  {
    icon: <CodePlus size={18} />,
    label: "Create a firewall",
    path: "/dashboard/sec_group",
    description: "Create new firewall",
  },
  {
    icon: <CodePlus size={18} />,
    label: "Create a disk",
    path: "/dashboard/volume",
    description: "Create new disk",
  },
  {
    icon: <CodePlus size={18} />,
    label: "Create a limit",
    path: "/dashboard/flavor",
    description: "Create new limit",
  },
  {
    icon: <CodePlus size={18} />,
    label: "Create a cloud image",
    path: "/dashboard/image",
    description: "Create new cloud image",
  },
];

const useSpotlightAction = (router: Router) => {
  return useMemo<SpotlightAction[]>(() => {
    const actions: SpotlightAction[] = [];
    menu.forEach((item) => {
      actions.push({
        group: "Main",
        id: item.path + "_list",
        icon: item.icon,
        title: item.label,
        description: item.description,
        onTrigger: () => router.push(item.path),
      });
    });
    createResources.forEach((item) => {
      actions.push({
        group: "Create resource",
        id: item.path + "_create",
        icon: item.icon,
        title: item.label,
        description: item.description,
        onTrigger: () =>
          router.push({ pathname: item.path, query: { create: true } }),
      });
    });
    return actions;
  }, [router]);
};

export default useSpotlightAction;
