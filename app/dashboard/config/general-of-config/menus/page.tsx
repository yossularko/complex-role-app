import { cookies } from "next/headers";
import { getMenus } from "@/shared/utils/fetchApi";
import React from "react";
import MenuPage from "./MenuPage";
import { ErrorResponse } from "@/shared/types/error";
import { getErrorRes } from "@/shared/utils/myFunction";

const Menus = async () => {
  try {
    const jwt_auth = cookies().get("jwt_auth");
    const initialData = await getMenus(jwt_auth?.value);
    return <MenuPage initialData={initialData} />;
  } catch (error) {
    return (
      <MenuPage
        initialData={[]}
        errorRes={getErrorRes(error as ErrorResponse)}
      />
    );
  }
};

export default Menus;
