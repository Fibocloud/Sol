import CURL from "../index";
import { Network } from "./types";

class NETWORK {
  public static list = () => CURL.GET<Network[], unknown>("/network/list");

  public static get = async (id: string) =>
    CURL.GET<Network, undefined>(`/network/get/${id}`);
}

export default NETWORK;
