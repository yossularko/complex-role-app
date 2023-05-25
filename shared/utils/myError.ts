import { message } from "antd";
import { ErrorResponse } from "../types/error";
import { getErrorRes } from "./myFunction";

export const myError = (error: ErrorResponse, handle401?: () => void) => {
  const err = getErrorRes(error);

  if (err.code === 401) {
    if (handle401) {
      handle401();
      return;
    }
  }

  message.error(`[${err.code}] ${err.message}`);
};

export const myErrorBasic = (error: ErrorResponse) => {
  const err = getErrorRes(error);

  message.error(`[${err.code}] ${err.message}`);
};
