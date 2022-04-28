import CURL from "../index";
import { HypervisorCompute, LimitCompute } from "./types";

class SYSTEM {
  public static compute = () =>
    CURL.GET<HypervisorCompute, unknown>("/system/compute");

  public static limit = () => CURL.GET<LimitCompute, unknown>("/system/limit");
}

export default SYSTEM;
