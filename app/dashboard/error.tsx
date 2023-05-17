"use client"; // Error components must be Client Components
import { AuthContext } from "@/shared/store/AuthContext";
import { ErrorResponse } from "@/shared/types/error";
import { revokeToken } from "@/shared/utils/fetchApi";
import { myError } from "@/shared/utils/myError";
import { useMutation } from "@tanstack/react-query";
import { Button, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo } from "react";

const { Title, Paragraph } = Typography;

export default function Error({
  error,
  reset,
}: {
  error: ErrorResponse;
  reset: () => void;
}) {
  const { push } = useRouter();
  const { userRefresh, handleRefreshToken, signOut } = useContext(AuthContext);

  const { mutate, isLoading } = useMutation(revokeToken, {
    onSuccess: (dataSuccess) => {
      console.log("data success: ", dataSuccess);

      signOut();
    },
    onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
  });

  const errorData = useMemo(() => {
    if (error.response?.data) {
      return {
        code: error.response.status,
        message: error.response.data.message,
      };
    }

    if (error.code) {
      return {
        code: error.code,
        message: error.message,
      };
    }

    return {
      message: String(error),
    };
  }, [error]);

  const handleSignOut = useCallback(() => {
    mutate({ refresh_token: userRefresh });
  }, [mutate, userRefresh]);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("error res: ", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
      }}
    >
      <Title level={2}>{errorData.code || "Something went wrong!"}</Title>
      <Paragraph>{errorData.message}</Paragraph>
      <Space>
        <Button onClick={() => push("/dashboard")}>Dashboard</Button>
        <Button onClick={() => reset()}>Try again</Button>
        <Button onClick={handleSignOut} loading={isLoading}>
          Logout
        </Button>
      </Space>
    </div>
  );
}