import CURL from "../index";
import { SuccessResponse } from "../types";
import {
  CreateRuleSecGroupInput,
  CreateSecGroupInput,
  SecGroup,
  UpdateSecGroupInput,
} from "./types";

class SEC_GROUP {
  public static list = () => CURL.GET<SecGroup[], unknown>("/sec_group/list");

  public static get = async (id: string) =>
    CURL.GET<SecGroup, undefined>(`/sec_group/get/${id}`);

  public static create = (body: CreateSecGroupInput) =>
    CURL.POST<SecGroup, CreateSecGroupInput>("/sec_group/create", body);

  public static update = (id: string, body: UpdateSecGroupInput) =>
    CURL.PUT<SuccessResponse, UpdateSecGroupInput>(
      `/sec_group/update/${id}`,
      body
    );

  public static delete = async (id: string) =>
    CURL.DELETE<SuccessResponse, undefined>(`/sec_group/delete/${id}`);

  public static add_server = (instance_id: string, id: string) =>
    CURL.POST<SuccessResponse, undefined>(
      `/sec_group/add_server/${instance_id}/${id}`,
      undefined
    );

  public static remove_server = (instance_id: string, id: string) =>
    CURL.DELETE<SuccessResponse, undefined>(
      `/sec_group/remove_server/${instance_id}/${id}`
    );

  public static create_rule = (body: CreateRuleSecGroupInput) =>
    CURL.POST<SuccessResponse, CreateRuleSecGroupInput>(
      "/sec_group/create_rule",
      body
    );

  public static delete_rule = async (id: string) =>
    CURL.DELETE<SuccessResponse, undefined>(`/sec_group/delete_rule/${id}`);
}

export default SEC_GROUP;
