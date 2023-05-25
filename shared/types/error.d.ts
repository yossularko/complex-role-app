import { AxiosError } from "axios";

export type ErrorResponse = AxiosError<{
  status?: number;
  statusCode?: number;
  message: string | string[];
}>;

export interface ErrorObj {
  code: string | number;
  message: string;
}
