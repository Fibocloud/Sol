import CURL from "../index";
import { SuccessResponse } from "../types";
import { CreateInstanceInput, Instance, UpdateInstanceInput } from "./types";

class INSTANCE {
  public static list = () => CURL.GET<Instance[], unknown>("/instance/list");

  public static get = async (id: string) =>
    CURL.GET<Instance, undefined>(`/instance/get/${id}`);

  public static create = (body: CreateInstanceInput) =>
    CURL.POST<Instance, CreateInstanceInput>("/instance/create", body);

  public static update = (id: string, body: UpdateInstanceInput) =>
    CURL.PUT<SuccessResponse, UpdateInstanceInput>(
      `/instance/update/${id}`,
      body
    );

  public static delete = async (id: string) =>
    CURL.DELETE<SuccessResponse, undefined>(`/instance/delete/${id}`);

  public static reboot = (id: string, hard: boolean) =>
    CURL.PUT<SuccessResponse, undefined>(
      `/instance/reboot/${id}?hard=${hard ? "true" : "false"}`,
      undefined
    );

  public static resize = ({
    id,
    flavor_id,
  }: {
    id: string;
    flavor_id: string;
  }) =>
    CURL.PUT<SuccessResponse, undefined>(
      `/instance/resize/${id}/${flavor_id}`,
      undefined
    );

  public static confirmResize = (id: string) =>
    CURL.PUT<SuccessResponse, undefined>(
      `/instance/confirm-resize/${id}`,
      undefined
    );

  public static revertResize = (id: string) =>
    CURL.PUT<SuccessResponse, undefined>(
      `/instance/revert-resize/${id}`,
      undefined
    );

  public static start = (id: string) =>
    CURL.PUT<SuccessResponse, undefined>(`/instance/start/${id}`, undefined);

  public static stop = (id: string) =>
    CURL.PUT<SuccessResponse, undefined>(`/instance/stop/${id}`, undefined);

  public static resume = (id: string) =>
    CURL.PUT<SuccessResponse, undefined>(`/instance/resume/${id}`, undefined);

  public static suspend = (id: string) =>
    CURL.PUT<SuccessResponse, undefined>(`/instance/suspend/${id}`, undefined);
}

export default INSTANCE;
