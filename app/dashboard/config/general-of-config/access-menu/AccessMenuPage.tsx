"use client";
import { AuthContext } from "@/shared/store/AuthContext";
import { UserList } from "@/shared/types";
import { ErrorResponse } from "@/shared/types/error";
import { Menu } from "@/shared/types/menu";
import { getAccessMenu, getMenus, getUsers } from "@/shared/utils/fetchApi";
import { myError } from "@/shared/utils/myError";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Select, Typography } from "antd";
import { AccessMenu } from "@/shared/types/login";

interface Props {
  initialUser: UserList[];
  initialMenu: Menu[];
}

const { Title } = Typography;

const getData = async () => {
  return await Promise.all([getUsers(), getMenus()]);
};

const AccessMenuPage = ({ initialUser, initialMenu }: Props) => {
  const [userId, setUserId] = useState(0);
  const { handleRefreshToken } = useContext(AuthContext);

  const { data, isLoading, isError, error } = useQuery<
    [UserList[], Menu[]],
    ErrorResponse
  >(["users-menus"], () => getData(), {
    initialData: [initialUser, initialMenu],
    refetchOnWindowFocus: false,
  });

  const accessMenu = useQuery<AccessMenu[], ErrorResponse>(
    ["access-menu", userId],
    () => getAccessMenu(userId),
    {
      enabled: userId > 0 ? true : false,
      initialData: [],
      refetchOnWindowFocus: false,
    }
  );

  if (isError) {
    myError(error, () => handleRefreshToken(true));
  }

  if (accessMenu.isError) {
    myError(accessMenu.error, () => handleRefreshToken(true));
  }
  return (
    <div>
      <Title level={2}>Access Menu{isLoading ? "..." : null}</Title>
      <Select
        placeholder="select user"
        style={{ minWidth: 210 }}
        onChange={(val) => setUserId(val)}
        options={data[0].map((item) => {
          return {
            label: item.profile.name,
            value: item.id,
          };
        })}
      />
      <pre>
        <code>{JSON.stringify(accessMenu.data, null, 2)}</code>
      </pre>
    </div>
  );
};

export default AccessMenuPage;
