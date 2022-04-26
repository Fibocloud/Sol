import CURL from "../index";
import { LoginInput, LoginResponse, User } from "./types";

class AUTH {
  public static userKey = "app.user";
  public static tokenKey = "app.token";
  static browser = typeof window !== "undefined";

  public static saveToken = (token: string) => {
    AUTH.browser && localStorage.setItem(AUTH.tokenKey, token);
  };

  public static rememberUser = (values: LoginInput) => {
    if (values.remember) {
      AUTH.browser &&
        localStorage.setItem(AUTH.userKey, JSON.stringify(values));
    } else {
      AUTH.browser && localStorage.removeItem(AUTH.userKey);
    }
  };

  public static getRememberUser = () => {
    const userData = localStorage.getItem(AUTH.userKey);
    if (userData) {
      const _userData = JSON.parse(userData) as LoginInput;
      return _userData;
    }
    return undefined;
  };

  public static getToken = () =>
    AUTH.browser && localStorage.getItem(AUTH.tokenKey);
  public static hasToken = () =>
    AUTH.browser && !!localStorage.getItem(AUTH.tokenKey);
  public static removeToken = () =>
    AUTH.browser && localStorage.removeItem(AUTH.tokenKey);

  public static info = () => CURL.GET<User, undefined>("/auth/info");
  public static login = (body: LoginInput) =>
    CURL.POST<LoginResponse, LoginInput>("/auth/login", body);
}

export default AUTH;
