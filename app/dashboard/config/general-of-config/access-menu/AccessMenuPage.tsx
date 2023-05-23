"use client";
import { AuthContext } from "@/shared/store/AuthContext";
import { UserList } from "@/shared/types";
import { ErrorResponse } from "@/shared/types/error";
import {
  AccessMenuPost,
  Menu,
  MenuNodeTree,
  MenuSelect,
} from "@/shared/types/menu";
import { getAccessMenu, getMenus, getUsers } from "@/shared/utils/fetchApi";
import { myError } from "@/shared/utils/myError";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useLayoutEffect, useMemo, useState } from "react";
import { Select, Typography } from "antd";
import { AccessMenu } from "@/shared/types/login";
import { DirectoryTreeProps, EventDataNode } from "antd/es/tree";
import { Tree } from "antd";
import { getMenuLeaf } from "@/shared/utils/myFunction";
import ActionList from "./ActionList";

interface Props {
  initialUser: UserList[];
  initialMenu: Menu[];
}

type CheckedKeys =
  | {
      checked: React.Key[];
      halfChecked: React.Key[];
    }
  | React.Key[];

const { Title, Text } = Typography;
const { DirectoryTree } = Tree;

const initialSelected = {
  id: 0,
  slug: "",
  name: "",
  alias: "",
  parent: [],
  createdAt: "",
  updatedAt: "",
  isLeaf: false,
};

const getData = async () => {
  return await Promise.all([getUsers(), getMenus()]);
};

const AccessMenuPage = ({ initialUser, initialMenu }: Props) => {
  const [userId, setUserId] = useState(0);
  const [masterAccsMenu, setMasterAccsMenu] = useState<AccessMenuPost[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<CheckedKeys>([]);
  const [selected, setSelected] = useState<{
    keys: React.Key[];
    value: MenuSelect;
  }>({
    keys: [],
    value: initialSelected,
  });
  const { handleRefreshToken } = useContext(AuthContext);

  const { data, isLoading, isError, error } = useQuery<
    [UserList[], Menu[]],
    ErrorResponse
  >(["users-menus"], () => getData(), {
    initialData: [initialUser, initialMenu],
    refetchOnWindowFocus: false,
  });

  const accessMenu = useQuery<AccessMenu[], ErrorResponse>(
    ["access-menu", userId],
    () => getAccessMenu(userId),
    {
      enabled: userId > 0 ? true : false,
      initialData: [],
      refetchOnWindowFocus: false,
      onSuccess: (dataSuccess) => {
        const lists = getMenuLeaf(dataSuccess);
        const masterData = lists.map((item) => ({
          slug: item.slug,
          actions: item.actions,
        }));
        const checkedVal = lists.map((item) => item.slug);
        setMasterAccsMenu(masterData);
        setCheckedKeys(checkedVal);
      },
    }
  );

  const treeData = useMemo<MenuNodeTree[]>(() => {
    const handleCreateTree = (menus: Menu[]): MenuNodeTree[] => {
      const maped: MenuNodeTree[] = menus.map((menu) => {
        if (menu.children) {
          return {
            ...menu,
            title: menu.alias,
            key: menu.slug,
            children: handleCreateTree(menu.children),
          };
        }

        return {
          ...menu,
          title: menu.alias,
          key: menu.slug,
          isLeaf: true,
          children: undefined,
        };
      });

      return maped;
    };

    return handleCreateTree(data[1]);
  }, [data]);

  const onCheck: DirectoryTreeProps["onCheck"] = (checkedKeysValue, info) => {
    // @ts-ignore
    if (checkedKeysValue.checked) {
      setCheckedKeys(checkedKeysValue);
    } else {
      setCheckedKeys({
        // @ts-ignore
        checked: checkedKeysValue,
        // @ts-ignore
        halfChecked: info.halfCheckedKeys,
      });
    }
  };

  const onSelect: DirectoryTreeProps["onSelect"] = (
    selectedKeysValue,
    info
  ) => {
    const {
      id,
      slug,
      name,
      alias,
      parent,
      createdAt,
      updatedAt,
      isLeaf,
      checked,
    } = info.node as EventDataNode<MenuNodeTree>;
    setSelected({
      keys: selectedKeysValue,
      value: {
        id,
        slug,
        name,
        alias,
        parent,
        createdAt,
        updatedAt,
        isLeaf: isLeaf || false,
      },
    });
    if (checked === false) {
      setCheckedKeys((prev) => {
        // @ts-ignore
        if (prev.checked) {
          return {
            ...prev,
            // @ts-ignore
            checked: [...prev.checked, ...selectedKeysValue],
          };
        }

        // @ts-ignore
        return [...prev, ...selectedKeysValue];
      });
    }
  };

  useLayoutEffect(() => {
    if (isError) {
      myError(error, () => handleRefreshToken(true));
    }

    if (accessMenu.isError) {
      myError(accessMenu.error, () => handleRefreshToken(true));
    }
  }, [accessMenu, error, isError, handleRefreshToken]);

  return (
    <div>
      <Title level={2}>Access Menu{isLoading ? "..." : null}</Title>
      <Select
        placeholder="select user"
        style={{ minWidth: 210 }}
        onChange={(val) => setUserId(val)}
        options={data[0].map((item) => {
          return {
            label: item.profile.name,
            value: item.id,
          };
        })}
      />
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <DirectoryTree
            checkable
            defaultExpandAll
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selected.keys}
            treeData={treeData}
          />
        </div>
        <div style={{ width: 340, paddingRight: 16 }}>
          <Title level={4}>List Menu Actions</Title>
          {masterAccsMenu.map((item) => (
            <ActionList key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessMenuPage;
