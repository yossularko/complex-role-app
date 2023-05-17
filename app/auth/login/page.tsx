"use client";
import { Card } from "@/shared/components/main";
import { AuthContext } from "@/shared/store/AuthContext";
import { ErrorResponse } from "@/shared/types/error";
import { LoginInputs } from "@/shared/types/formValue";
import { AccessMenu, Token, User } from "@/shared/types/login";
import { mainColor } from "@/shared/utils/colors";
import { loginUser } from "@/shared/utils/fetchApi";
import { myErrorBasic } from "@/shared/utils/myError";
import { rules } from "@/shared/utils/myRules";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Typography } from "antd";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import styles from "../auth.module.css";
import { FiMail, FiLock, FiNavigation } from "react-icons/fi";
import Link from "next/link";

const { Text, Title } = Typography;

const Login = () => {
  const { replace, push } = useRouter();
  const { signIn } = useContext(AuthContext);

  const { mutate, isLoading } = useMutation(loginUser, {
    onSuccess: ({
      token,
      user,
      accessMenus,
    }: {
      token: Token;
      user: User;
      accessMenus: AccessMenu[];
    }) => {
      console.log("data success: ", user);

      signIn({ token, user, accessMenus });
      message.success(`Selamat datang ${user.profile.name}`);

      setTimeout(() => {
        replace("/");
      }, 500);
    },
    onError: (err: ErrorResponse) => myErrorBasic(err),
  });

  const onFinish = (values: LoginInputs) => {
    console.log("Data submit: ", values);
    return mutate(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className={styles.authHeader}>
      <Card style={{ minWidth: 320, maxWidth: 340 }}>
        <div className={styles.authHeaderContent}>
          <Title style={{ color: mainColor, fontWeight: "bold" }}>
            Welcome,
          </Title>
          <Text type="secondary">Sign in to continue!</Text>
        </div>
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item name="email" rules={rules.email} hasFeedback>
            <Input
              prefix={<FiMail color="rgba(0,0,0,.25)" />}
              placeholder="masukan email"
              size="large"
            />
          </Form.Item>
          <Form.Item name="password" rules={rules.password} hasFeedback>
            <Input.Password
              prefix={<FiLock color="rgba(0,0,0,.25)" />}
              placeholder="masukan password"
              size="large"
            />
          </Form.Item>
          <div style={{ marginBottom: 10 }}>
            <Link href="/auth/forgot">Forgot Password?</Link>
          </div>
          <Form.Item>
            <Button
              type="primary"
              shape="round"
              icon={<FiNavigation style={{ marginRight: "6px" }} />}
              size="large"
              style={{ width: "100%" }}
              htmlType="submit"
              loading={isLoading}
            >
              Sign In
            </Button>
          </Form.Item>
          <div className={styles.authGoSignup}>
            <Text type="secondary">
              I&apos;m a new user,{" "}
              <Text
                strong
                onClick={() => push("/auth/register")}
                style={{ cursor: "pointer" }}
              >
                Sign Up
              </Text>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
