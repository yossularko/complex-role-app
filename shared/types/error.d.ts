import { AxiosError } from "axios";

export type ErrorResponse = AxiosError<{
  status?: number;
  statusCode?: number;
  message: string | string[];
}>;
