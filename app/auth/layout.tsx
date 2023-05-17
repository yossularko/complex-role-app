import AuthLayout from "@/shared/components/menu/AuthLayout";
import React, { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
