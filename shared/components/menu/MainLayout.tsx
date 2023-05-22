"use client";
import React, {
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";
import { Breadcrumb, Layout, Menu, MenuProps, theme, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import FooterMenu from "./FooterMenu";
import Link from "next/link";
import { AuthContext } from "@/shared/store/AuthContext";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { AccessMenu } from "@/shared/types/login";

const { Header, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }: PropsWithChildren) => {
  const { isLoading, userMenu, setMenuAction } = useContext(AuthContext);
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
          zIndex: 1,
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
          style={{ width: "100%" }}
          onClick={onClick}
        />
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
