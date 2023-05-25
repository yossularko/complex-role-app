import axios, { AxiosRequestConfig } from "axios";
import {
  AccessMenuInputs,
  LoginInputs,
  MenuInputs,
  RefreshTokenInputs,
  RegisterInputs,
  TemplateMenuInputs,
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

// User
export const getUsers = async (bearer?: string) => {
  const response = await fetchApi.get("/users", findConfig(bearer));
  return response.data;
};

// Menu
export const getMenus = async (bearer?: string) => {
  const response = await fetchApi.get("/menus", findConfig(bearer));
  return response.data;
};

export const addMenu = async ({ data }: { data: MenuInputs }) => {
  const response = await fetchApi.post("/menus", data, {
    withCredentials: true,
  });
  return response.data;
};

export const updateMenu = async ({
  slug,
  data,
}: {
  slug: string;
  data: MenuInputs;
}) => {
  const response = await fetchApi.patch(`/menus/${slug}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteMenu = async ({ slug }: { slug: string }) => {
  const response = await fetchApi.delete(`/menus/${slug}`, {
    withCredentials: true,
  });
  return response.data;
};

// Access Menu
export const getAccessMenu = async (userId: number) => {
  const response = await fetchApi.get(`/access-menus?userId=${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const replaceAccessMenu = async ({
  data,
}: {
  data: AccessMenuInputs;
}) => {
  const response = await fetchApi.post("/access-menus/replace", data, {
    withCredentials: true,
  });
  return response.data;
};

// Template Menu
export const getTemplateMenus = async (bearer?: string) => {
  const response = await fetchApi.get("/template-menus", findConfig(bearer));
  return response.data;
};

export const getTemplateMenuDetail = async (id: number) => {
  const response = await fetchApi.get(`/template-menus/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const addTemplateMenu = async ({
  data,
}: {
  data: TemplateMenuInputs;
}) => {
  const response = await fetchApi.post("/template-menus", data, {
    withCredentials: true,
  });
  return response.data;
};

export const updateTemplateMenu = async ({
  id,
  data,
}: {
  id: number;
  data: TemplateMenuInputs;
}) => {
  const response = await fetchApi.patch(`/template-menus/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteTemplateMenu = async ({ id }: { id: number }) => {
  const response = await fetchApi.delete(`/template-menus/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
