import { default as AUTH, default as auth } from "$/services/auth";
import { LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import { useQuery } from "react-query";
import { Action, DataType, ReducerType, Type } from "./types";

const defaultData: DataType = {
  authorized: AUTH.hasToken(),
};

const UserContext = createContext<Type>([
  defaultData,
  () => {
    // do nothing.
  },
]);

export const StoreProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const info = useQuery(["auth", "info"], auth.info, {
    onSuccess: (data) => setRedux([Action.SIGN_IN, data]),
    onError: (err: string) => {
      setRedux([Action.SIGN_OUT]);
      showNotification({ color: "orange", message: err });
    },
  });
  const [redux, setRedux] = useReducer<ReducerType>((state, action) => {
    switch (action[0]) {
      case Action.REFETCH:
        info.refetch();
        return state;
      case Action.SIGN_IN:
        return { ...state, auth: action[1], authorized: true };
      case Action.SIGN_OUT:
        AUTH.removeToken();
        return { ...state, auth: undefined, authorized: false };
      default:
        return state;
    }
  }, defaultData);

  return (
    <UserContext.Provider value={[redux, setRedux]}>
      {info.isLoading ? (
        <LoadingOverlay visible loaderProps={{ size: "xl" }} />
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};

export const useStore: () => Type = () => useContext<Type>(UserContext);
