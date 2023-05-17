import { cookies } from "next/headers";
import { getMenus } from "@/shared/utils/fetchApi";
import React from "react";
import MenuPage from "./MenuPage";

const Menus = async () => {
  const jwt_auth = cookies().get("jwt_auth");
  const initialData = await getMenus(jwt_auth?.value);
  return <MenuPage initialData={initialData} />;
};

export default Menus;
