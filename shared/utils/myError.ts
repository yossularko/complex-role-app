import { message } from "antd";
import { ErrorResponse } from "../types/error";

export const myError = (error: ErrorResponse, handle401?: () => void) => {
  if (error.response?.data) {
    if (error.response.status === 401) {
      if (handle401) {
        handle401();
        return;
      }
    }

    message.error(`[${error.response.status}] ${error.response.data.message}`);
    console.log("error response: ", error.response.data);
    return;
  }

  if (error.code) {
    message.error(`[${error.code}] ${error.message}`);
    console.log("error code: ", error.code, error.message);
    return;
  }

  message.error(String(error));
  console.log("error mutate: ", error);
};

export const myErrorBasic = (error: ErrorResponse) => {
  if (error.response?.data) {
    message.error(`[${error.response.status}] ${error.response.data.message}`);
    console.log("error response: ", error.response.data);
    return;
  }

  if (error.code) {
    message.error(`[${error.code}] ${error.message}`);
    console.log("error code: ", error.code, error.message);
    return;
  }

  message.error(String(error));
  console.log("error mutate: ", error);
};
