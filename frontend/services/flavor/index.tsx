import CURL from "../index";
import { SuccessResponse } from "../types";
import { CreateFlavorInput, Flavor } from "./types";

class FLAVOR {
  public static list = () => CURL.GET<Flavor[], unknown>("/flavor/list");

  public static get = async (id: string) =>
    CURL.GET<Flavor, undefined>(`/flavor/get/${id}`);

  public static create = (body: CreateFlavorInput) =>
    CURL.POST<Flavor, CreateFlavorInput>("/flavor/create", body);

  public static delete = async (id: string) =>
    CURL.DELETE<SuccessResponse, undefined>(`/flavor/delete/${id}`);
}

export default FLAVOR;
