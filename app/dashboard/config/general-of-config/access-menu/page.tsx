import { cookies } from "next/headers";
import { getMenus, getTemplateMenus, getUsers } from "@/shared/utils/fetchApi";
import React from "react";
import AccessMenuPage from "./AccessMenuPage";
import { getErrorRes } from "@/shared/utils/myFunction";
import { ErrorResponse } from "@/shared/types/error";

const AccessMenu = async () => {
  try {
    const jwt_auth = cookies().get("jwt_auth");
    const initialUser = getUsers(jwt_auth?.value);
    const initialMenu = getMenus(jwt_auth?.value);
    const initialTemplate = getTemplateMenus(jwt_auth?.value);

    const [user, menu, template] = await Promise.all([
      initialUser,
      initialMenu,
      initialTemplate,
    ]);

    return (
      <AccessMenuPage
        initialUser={user}
        initialMenu={menu}
        initialTemplate={template}
      />
    );
  } catch (error) {
    return (
      <AccessMenuPage
        initialUser={[]}
        initialMenu={[]}
        initialTemplate={[]}
        errorRes={getErrorRes(error as ErrorResponse)}
      />
    );
  }
};

export default AccessMenu;
