"use client";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";
import {
  Avatar,
  Breadcrumb,
  Dropdown,
  Image,
  Layout,
  Menu,
  MenuProps,
  theme,
  Typography,
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import FooterMenu from "./FooterMenu";
import Link from "next/link";
import { AuthContext } from "@/shared/store/AuthContext";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { AccessMenu } from "@/shared/types/login";
import { brightColor, labelColor } from "@/shared/utils/colors";
import fallbackAva from "@/shared/utils/fallbackAva";
import { FiLogOut } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { revokeToken } from "@/shared/utils/fetchApi";
import { ErrorResponse } from "@/shared/types/error";
import { myError } from "@/shared/utils/myError";
import styles from "./menu.module.css";

interface UserAvaProps {
  src: string;
  size: number;
}

const { Header, Content } = Layout;
const { Text } = Typography;

const UserAva = ({ src, size }: UserAvaProps) => {
  return (
    <Avatar
      style={{
        backgroundColor: brightColor,
      }}
      size={size}
      src={
        <Image
          src={src}
          style={{
            width: size,
          }}
          preview={false}
          fallback={fallbackAva}
          alt="user-profile"
        />
      }
    />
  );
};

const MainLayout = ({ children }: PropsWithChildren) => {
  const {
    isLoading,
    userData,
    userMenu,
    userRefresh,
    signOut,
    setMenuAction,
    handleRefreshToken,
  } = useContext(AuthContext);
  const { push } = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const paths = useMemo(() => {
    return pathname.split("/").filter((item) => item.length > 0);
  }, [pathname]);

  const menuList = useMemo<ItemType<MenuItemType>[]>(() => {
    const recursiveMenu = (menu: AccessMenu[]): ItemType<MenuItemType>[] => {
      return menu.map((item) => {
        const generatedKey = [...item.parent, item.slug].join("/");
        if (item.children) {
          return {
            key: `/${generatedKey}`,
            label: item.alias,
            children: recursiveMenu(item.children),
          };
        }
        return {
          key: `/${generatedKey}`,
          label: item.alias,
        };
      });
    };

    const menuDashboard: AccessMenu = {
      accessMenuId: 0,
      id: 0,
      slug: "",
      name: "Dashboard",
      alias: "Dashboard",
      parent: [],
      createdAt: "",
      updatedAt: "",
      actions: ["create", "read", "update", "delete"],
    };

    return recursiveMenu([menuDashboard, ...userMenu]);
  }, [userMenu]);

  const itemsProfile = useMemo<ItemType<MenuItemType>[]>(() => {
    return [
      {
        label: (
          <div>
            <UserAva src={`${userData.profile.avaImage}`} size={48} />
            <div style={{ marginTop: 6, fontSize: 16, width: 110 }}>
              <Text type="secondary" strong ellipsis>
                {userData.profile.name}
              </Text>
            </div>
          </div>
        ),
        key: "avatar",
      },
      {
        label: "Logout",
        key: "logout",
        icon: <FiLogOut />,
        danger: true,
      },
    ];
  }, [userData.profile]);

  const { mutate } = useMutation(revokeToken, {
    onSuccess: (dataSuccess) => {
      console.log("data success: ", dataSuccess);

      signOut();
    },
    onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
  });

  const handleSignOut = useCallback(() => {
    mutate({ refresh_token: userRefresh });
  }, [mutate, userRefresh]);

  const onClickMenuProfile: MenuProps["onClick"] = (e) => {
    console.log("click Profile ", e);
    if (e.key === "logout") {
      handleSignOut();
    }
  };

  const onClick: MenuProps["onClick"] = (e) => {
    push(`/dashboard${e.key}`);
  };

  useLayoutEffect(() => {
    if (!isLoading) {
      setMenuAction(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, pathname]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 12,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link href="/dashboard">
          <div style={{ width: 80, height: 50 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: 700 }}>
              LOGO
            </Text>
          </div>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["/dashboard"]}
          items={menuList}
          style={{ flex: 1, margin: "0 10px" }}
          onClick={onClick}
        />
        <Dropdown
          menu={{
            style: { padding: 10, borderRadius: "15px" },
            onClick: onClickMenuProfile,
            items: itemsProfile,
          }}
        >
          <div className={styles.navbarAvatarContainer}>
            <UserAva src={`${userData.profile.avaImage}`} size={36} />
            <div className={styles.navbarWelcome}>
              <Text style={{ color: labelColor, lineHeight: 1, fontSize: 12 }}>
                Welcome
              </Text>
              <Text strong style={{ color: "white", lineHeight: 1.5 }}>
                {userData.profile.name}
              </Text>
            </div>
          </div>
        </Dropdown>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={paths.map((val) => ({ title: val }))}
        />
        <div
          style={{ background: colorBgContainer, padding: 8, borderRadius: 10 }}
        >
          {children}
        </div>
      </Content>
      <FooterMenu />
    </Layout>
  );
};

export default MainLayout;
