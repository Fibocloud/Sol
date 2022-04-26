import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import axios from "axios";
import AUTH from "./auth";
import type { BaseResponse } from "./types";

class CURL {
  private static headers: AxiosRequestHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  private static handleError =
    (reject: (reason?: string) => void) => (error: Error | AxiosError) => {
      let errorMsg = "";
      if (axios.isAxiosError(error)) {
        console.log(error);
        if (error.response?.status === 401) {
          AUTH.removeToken();
        }
        if (error.response?.data) {
          errorMsg = error.response.data;
        }
        if (error.response?.data.message) {
          errorMsg = error.response?.data.message;
        }
      } else {
        errorMsg = error.message;
      }
      return reject(errorMsg);
    };

  public static request = async <T,>(options: AxiosRequestConfig) => {
    const token = AUTH.getToken();
    const headers = { ...CURL.headers };
    if (token) headers.Authorization = `Bearer ${token}`;

    return new Promise<T>((resolve, reject) =>
      axios
        .request<BaseResponse<T>>({
          ...options,
          headers: headers,
          baseURL: process.env.NEXT_PUBLIC_BACK_URL,
        })
        .then((resp) => resolve(resp.data.body))
        .catch(CURL.handleError(reject))
    );
  };

  public static GET = async <T, P>(url: string, params?: P) =>
    CURL.request<T>({ method: "GET", url, params });

  public static POST = async <T, P>(url: string, data: P) =>
    CURL.request<T>({ method: "POST", url, data });

  public static PUT = async <T, P>(url: string, data: P) =>
    CURL.request<T>({ method: "PUT", url, data });

  public static DELETE = async <T, P>(url: string, data?: P) =>
    CURL.request<T>({ method: "DELETE", url, data });

  public static cancelToken = axios.CancelToken.source();
}

export default CURL;
