import { AxiosError } from "axios";

export type ErrorResponse = AxiosError<{
  status?: number;
  status_code?: number;
  message: string | string[];
}>;
