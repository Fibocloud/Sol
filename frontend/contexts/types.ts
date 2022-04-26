import { User } from "$/services/auth/types";

export interface DataType {
  authorized: boolean;
  auth?: User;
}

export enum Action {
  SIGN_OUT = "SIGN_OUT",
  SIGN_IN = "SIGN_IN",
  REFETCH = "REFETCH",
}

export type ReducerType = (state: DataType, action: Actions) => DataType;

export type Actions =
  | [Action.SIGN_OUT]
  | [Action.REFETCH]
  | [Action.SIGN_IN, User];

export type Type = [DataType, (action: Actions) => void];
