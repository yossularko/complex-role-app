"use client";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "@/shared/types/menu";
import React, { useContext } from "react";
import { getMenus } from "@/shared/utils/fetchApi";
import { ErrorResponse } from "@/shared/types/error";
import { myError } from "@/shared/utils/myError";
import { AuthContext } from "@/shared/store/AuthContext";
import { Button } from "antd";

interface Props {
  initialData: Menu[];
}

const MenuPage = ({ initialData }: Props) => {
  const { handleRefreshToken } = useContext(AuthContext);
  const { data, isLoading, isError, error, refetch } = useQuery<
    Menu[],
    ErrorResponse
  >(["menus"], () => getMenus(), {
    initialData: initialData,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    myError(error, handleRefreshToken);
  }
  return (
    <div>
      <p>MenuPage{isLoading ? "..." : null}</p>
      <Button onClick={() => refetch()}>refetch</Button>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
};

export default MenuPage;
