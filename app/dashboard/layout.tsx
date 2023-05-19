import MainLayout from "@/shared/components/menu/MainLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  const cookieStore = cookies();
  const jwt_refresh = cookieStore.get("jwt_refresh");

  if (!jwt_refresh) {
    redirect("/auth/login");
  }

  return <MainLayout>{children}</MainLayout>;
};

export default DashboardLayout;
