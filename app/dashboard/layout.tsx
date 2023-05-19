import MainLayout from "@/shared/components/menu/MainLayout";
import { refreshToken } from "@/shared/utils/fetchApi";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  const cookieStore = cookies();
  const jwt_auth = cookieStore.get("jwt_auth");
  const jwt_refresh = cookieStore.get("jwt_refresh");

  if (!jwt_refresh) {
    redirect("/auth/login");
  }

  if (!jwt_auth) {
    const dataRefresh = {
      refresh_token: jwt_refresh.value,
    };

    await refreshToken(dataRefresh)
      .then(() => {
        return <MainLayout>{children}</MainLayout>;
      })
      .catch((err) => {
        console.log("error refresh: ", err);
        redirect("/auth/login");
      });
  }

  return <MainLayout>{children}</MainLayout>;
};

export default DashboardLayout;
