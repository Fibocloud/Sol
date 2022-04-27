export interface Flavor {
  id: string;
  disk: number;
  ram: number;
  name: string;
  rxtx_factor: number;
  vcpus: number;
  "os-flavor-access:is_public": boolean;
  "OS-FLV-EXT-DATA:ephemeral": number;
}

export interface CreateFlavorInput {
  name: string;
  ram: number;
  vcpus: number;
  rx_tx_factor: number;
  disk?: number;
  swap?: number;
  is_public?: boolean;
  ephemeral?: number;
}
