import { message } from "antd";
import { ErrorResponse } from "../types/error";

export const myError = (error: ErrorResponse, handle401?: () => void) => {
  console.log("error: ", error)
  if (error.response?.data) {
    const { statusCode, status, message: messageRes } = error.response.data;
    if (statusCode) {
      if (statusCode === 401) {
        if (handle401) {
          handle401();
          return;
        }
      }

      message.error(`[${statusCode}] ${messageRes}`);
      console.log("error response: ", error.response.data);
      return;
    }

    if (status === 401) {
      if (handle401) {
        handle401();
        return;
      }
    }

    message.error(`[${status}] ${messageRes}`);
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
    const { statusCode, status, message: messageRes } = error.response.data;
    if (statusCode) {
      message.error(`[${statusCode}] ${messageRes}`);
      console.log("error response: ", error.response.data);
      return;
    }

    message.error(`[${status}] ${messageRes}`);
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
