import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const cookieStore = cookies();
  const jwt_auth = cookieStore.get("jwt_auth");

  if (!jwt_auth) {
    redirect("/auth/login");
  }
  return (
    <div>
      <p>Dashboard Layout</p>
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
