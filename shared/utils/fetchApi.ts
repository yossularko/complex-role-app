import axios from "axios";
import { LoginInputs } from "../types/formValue";

export const fetchApi = axios.create({
  baseURL: "http://192.168.0.102:4000/api",
});

export const loginUser = async (data: LoginInputs) => {
  const response = await fetchApi.post("/auth/signin", data, {
    withCredentials: true,
  });
  return response.data;
};
