import CURL from "../index";
import { SuccessResponse } from "../types";
import { Image } from "./types";

class IMAGE {
  public static list = () => CURL.GET<Image[], unknown>("/image/list");

  public static get = async (id: string) =>
    CURL.GET<Image, undefined>(`/image/get/${id}`);

  public static delete = async (id: string) =>
    CURL.DELETE<SuccessResponse, undefined>(`/image/delete/${id}`);
}

export default IMAGE;
