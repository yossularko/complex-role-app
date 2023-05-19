"use client";
import { message } from "antd";
import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import { AccessMenu, Token, User } from "../types/login";
import { refreshToken } from "../utils/fetchApi";
import { decryptJson, encryptJson } from "../utils/myFunction";

enum ActionKind {
  RETRIEVE_DATA = "RETRIEVE_DATA",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

enum StorageKind {
  userRefresh = "userRefresh",
  userData = "userData",
  userMenu = "userMenu",
}

interface SignIn {
  token: Token;
  user: User;
  accessMenus: AccessMenu[];
}

type ACTIONTYPE =
  | {
      type: ActionKind.RETRIEVE_DATA;
      isLoading?: boolean;
      userRefresh: string;
      userData: User;
      userMenu: AccessMenu[];
    }
  | {
      type: ActionKind.LOGIN;
      isLoading?: boolean;
      userRefresh: string;
      userData: User;
      userMenu: AccessMenu[];
    }
  | {
      type: ActionKind.LOGOUT;
      isLoading?: boolean;
      userRefresh?: string;
      userData?: User;
      userMenu?: AccessMenu[];
    };

interface State {
  isLoading: boolean;
  userRefresh: string;
  userData: User;
  userMenu: AccessMenu[];
  refreshToken: (token: string) => void;
  signIn: ({ token, user, accessMenus }: SignIn) => void;
  signOut: () => Promise<void>;
  handleRefreshToken: () => Promise<void>;
}

interface Props {
  children: React.ReactNode;
}

const initialUserData: User = {
  id: 0,
  email: "",
  createdAt: "",
  updatedAt: "",
  profile: {
    id: 0,
    name: "",
    bio: null,
    avaImage: null,
    bgImage: null,
    userEmail: "",
  },
};

const initialState: State = {
  isLoading: true,
  userRefresh: "",
  userData: initialUserData,
  userMenu: [],
  refreshToken: () => {},
  signIn: () => {},
  signOut: async () => {},
  handleRefreshToken: async () => {},
};

export const AuthContext = createContext<State>(initialState);

const loginReducer = (prevState: State, action: ACTIONTYPE) => {
  switch (action.type) {
    case ActionKind.RETRIEVE_DATA:
      return {
        ...prevState,
        userRefresh: action.userRefresh,
        userData: action.userData,
        userMenu: action.userMenu,
        isLoading: false,
      };
    case ActionKind.LOGIN:
      return {
        ...prevState,
        userRefresh: action.userRefresh,
        userData: action.userData,
        userMenu: action.userMenu,
        isLoading: false,
      };
    case ActionKind.LOGOUT:
      return {
        ...prevState,
        userRefresh: "",
        userData: initialUserData,
        userMenu: [],
        isLoading: false,
      };
    default:
      return {
        ...prevState,
        isLoading: false,
      };
  }
};

const AuthProvider = ({ children }: Props): JSX.Element => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  useEffect(() => {
    const getInitial = () => {
      try {
        const userRefreshStorage = localStorage.getItem(
          StorageKind.userRefresh
        );
        const userDataStorage = localStorage.getItem(StorageKind.userData);
        const userMenuStorage = localStorage.getItem(StorageKind.userMenu);

        const userRefresh = userRefreshStorage || "";
        const userData: User = userDataStorage
          ? decryptJson(userDataStorage)
          : initialUserData;
        const userMenu: AccessMenu[] = userMenuStorage
          ? decryptJson(userMenuStorage)
          : [];

        console.log(
          `refresh: ${userRefresh}, data: ${userData}, menu: ${userMenu.length}`
        );

        dispatch({
          type: ActionKind.RETRIEVE_DATA,
          userRefresh,
          userData,
          userMenu,
        });
      } catch (error) {
        console.log("error retrieve data: ", error);

        dispatch({
          type: ActionKind.RETRIEVE_DATA,
          userRefresh: "",
          userData: initialUserData,
          userMenu: [],
        });
      }
    };

    getInitial();
  }, []);

  const signIn = useCallback(({ token, user, accessMenus }: SignIn) => {
    localStorage.setItem(StorageKind.userRefresh, token.refresh_token);
    localStorage.setItem(StorageKind.userData, encryptJson(user));
    localStorage.setItem(StorageKind.userMenu, encryptJson(accessMenus));

    return dispatch({
      type: ActionKind.LOGIN,
      userRefresh: token.refresh_token,
      userData: user,
      userMenu: accessMenus,
    });
  }, []);

  const signOut = useCallback(async () => {
    await new Promise<void>((resolve, reject) => {
      localStorage.removeItem(StorageKind.userRefresh);
      localStorage.removeItem(StorageKind.userData);
      localStorage.removeItem(StorageKind.userMenu);

      dispatch({
        type: ActionKind.LOGOUT,
      });
      resolve();
    });

    location.reload();
  }, []);

  const handleRefreshToken = useCallback(async () => {
    const dataRefresh = {
      refresh_token: state.userRefresh,
    };
    try {
      await refreshToken(dataRefresh);
      message.info("Silahkan coba lagi");
      location.reload();
    } catch (error) {
      message.error("Silahkan login kembali");
      signOut();
    }
  }, [state.userRefresh, signOut]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        handleRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
