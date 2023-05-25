"use client"; // Error components must be Client Components
import { AuthContext } from "@/shared/store/AuthContext";
import { ErrorObj, ErrorResponse } from "@/shared/types/error";
import { refreshToken, revokeToken } from "@/shared/utils/fetchApi";
import { myError } from "@/shared/utils/myError";
import { useMutation } from "@tanstack/react-query";
import { Button, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const { Title, Paragraph } = Typography;

interface Props {
  error: ErrorObj;
}

const ErrorComp = ({ error }: Props) => {
  const { push } = useRouter();
  const { userRefresh, handleRefreshToken, signOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const { mutate, isLoading } = useMutation(revokeToken, {
    onSuccess: (dataSuccess) => {
      console.log("data success: ", dataSuccess);

      signOut();
    },
    onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
  });

  const handleRefresh = useRef<() => Promise<void>>(async () => {});

  handleRefresh.current = async () => {
    setLoading(true);
    const dataRefresh = {
      refresh_token: userRefresh,
    };
    try {
      await refreshToken(dataRefresh);
      location.reload();
    } catch (error) {
      console.log(error);
      setLoading(false);
      myError(error as ErrorResponse, signOut);
    }
  };

  const handleSignOut = useCallback(() => {
    mutate({ refresh_token: userRefresh });
  }, [mutate, userRefresh]);

  useEffect(() => {
    // Log the error to an error reporting service
    if (error.code === 401) {
      handleRefresh.current();
    } else {
      setLoading(false);
    }
  }, [error]);

  return loading ? null : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
      }}
    >
      <Title level={2}>{error.code || "Something went wrong!"}</Title>
      <Paragraph>{error.message}</Paragraph>
      <Space>
        <Button onClick={() => push("/dashboard")}>Dashboard</Button>
        <Button onClick={() => handleRefresh.current()}>Try again</Button>
        <Button onClick={handleSignOut} loading={isLoading}>
          Logout
        </Button>
      </Space>
    </div>
  );
};

export default ErrorComp;
