import { cookies } from "next/headers";
import { getMenus, getUsers } from "@/shared/utils/fetchApi";
import React from "react";
import AccessMenuPage from "./AccessMenuPage";

export const dynamic = 'force-dynamic'

const AccessMenu = async () => {
  const jwt_auth = cookies().get("jwt_auth");
  const initialUser = getUsers(jwt_auth?.value);
  const initialMenu = getMenus(jwt_auth?.value);

  const [user, menu] = await Promise.all([initialUser, initialMenu])

  return <AccessMenuPage initialUser={user} initialMenu={menu} />;
};

export default AccessMenu;
