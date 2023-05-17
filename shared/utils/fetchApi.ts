import axios, { AxiosRequestConfig } from "axios";
import {
  LoginInputs,
  RefreshTokenInputs,
  RegisterInputs,
} from "../types/formValue";

export const fetchApi = axios.create({
  baseURL: "http://192.168.0.102:4000/api",
});

const findConfig = (bearer?: string): AxiosRequestConfig => {
  return bearer
    ? {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
      }
    : {
        withCredentials: true,
      };
};

export const loginUser = async (data: LoginInputs) => {
  const response = await fetchApi.post("/auth/signin", data, {
    withCredentials: true,
  });
  return response.data;
};

export const registerUser = async (data: RegisterInputs) => {
  const response = await fetchApi.post("/auth/signup", data);
  return response.data;
};

export const refreshToken = async (data: RefreshTokenInputs) => {
  const response = await fetchApi.post("/auth/refresh-token", data, {
    withCredentials: true,
  });
  return response.data;
};

export const revokeToken = async (data: RefreshTokenInputs) => {
  const response = await fetchApi.patch("/auth/revoke", data, {
    withCredentials: true,
  });
  return response.data;
};

export const getMenus = async (bearer?: string) => {
  const response = await fetchApi.get("/menus", findConfig(bearer));
  return response.data;
};
