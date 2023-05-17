"use client";
import { Layout } from "antd";
import React, { PropsWithChildren } from "react";
import FooterMenu from "./FooterMenu";

const { Content } = Layout;

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content>{children}</Content>
      <FooterMenu />
    </Layout>
  );
};

export default AuthLayout;
