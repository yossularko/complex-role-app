"use client";
import { AuthContext } from "@/shared/store/AuthContext";
import { ErrorResponse } from "@/shared/types/error";
import { revokeToken } from "@/shared/utils/fetchApi";
import { myError } from "@/shared/utils/myError";
import { useMutation } from "@tanstack/react-query";
import { Button } from "antd";
import React, { useCallback, useContext } from "react";

const UserInfo = () => {
  const { userRefresh, userData, userMenu, handleRefreshToken, signOut } =
    useContext(AuthContext);
  const dataUser = {
    user: userData,
    access_menus: userMenu,
  };

  const { mutate, isLoading } = useMutation(revokeToken, {
    onSuccess: (dataSuccess) => {
      console.log("data success: ", dataSuccess);

      signOut();
    },
    onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
  });

  const handleSignOut = useCallback(() => {
    mutate({ refresh_token: userRefresh });
  }, [mutate, userRefresh]);

  return (
    <div>
      <p>UserInfo</p>
      <Button onClick={handleSignOut} loading={isLoading}>
        Logout
      </Button>
      <pre>
        <code>{JSON.stringify(dataUser, null, 2)}</code>
      </pre>
    </div>
  );
};

export default UserInfo;
