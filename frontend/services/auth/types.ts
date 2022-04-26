import { Base } from "../types";

export interface LoginInput {
  username: string;
  password: string;
  remember: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface OSCredential {
  username: string;
  password: string;
  tenant_id: string;
}

export interface User extends Base {
  username: string;
  password: string;
  enable: boolean;
  os_credential: OSCredential;
  last_login_date: Date;
}
