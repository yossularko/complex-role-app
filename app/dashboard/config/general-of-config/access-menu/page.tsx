import { cookies } from "next/headers";
import { getMenus, getUsers } from "@/shared/utils/fetchApi";
import React from "react";
import AccessMenuPage from "./AccessMenuPage";
import { getErrorRes } from "@/shared/utils/myFunction";
import { ErrorResponse } from "@/shared/types/error";

const AccessMenu = async () => {
  try {
    const jwt_auth = cookies().get("jwt_auth");
    const initialUser = getUsers(jwt_auth?.value);
    const initialMenu = getMenus(jwt_auth?.value);

    const [user, menu] = await Promise.all([initialUser, initialMenu]);

    return <AccessMenuPage initialUser={user} initialMenu={menu} />;
  } catch (error) {
    return (
      <AccessMenuPage
        initialUser={[]}
        initialMenu={[]}
        errorRes={getErrorRes(error as ErrorResponse)}
      />
    );
  }
};

export default AccessMenu;
