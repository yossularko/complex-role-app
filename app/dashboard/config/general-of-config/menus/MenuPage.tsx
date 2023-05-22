"use client";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "@/shared/types/menu";
import React, { useContext, useMemo } from "react";
import { getMenus } from "@/shared/utils/fetchApi";
import { ErrorResponse } from "@/shared/types/error";
import { myError } from "@/shared/utils/myError";
import { AuthContext } from "@/shared/store/AuthContext";
import { Button, Tree } from "antd";
import type { DataNode, DirectoryTreeProps } from "antd/es/tree";

interface Props {
  initialData: Menu[];
}

type NewDataNode = DataNode & {
  id: number;
  slug: string;
  name: string;
  alias: string;
  parent: string[];
  createdAt: string;
  updatedAt: string;
};

const { DirectoryTree } = Tree;

const MenuPage = ({ initialData }: Props) => {
  const { handleRefreshToken } = useContext(AuthContext);
  const { data, isLoading, isError, error, refetch } = useQuery<
    Menu[],
    ErrorResponse
  >(["menus"], () => getMenus(), {
    initialData: initialData,
    refetchOnWindowFocus: false,
  });

  const treeData = useMemo<NewDataNode[]>(() => {
    const handleCreateTree = (menus: Menu[]): NewDataNode[] => {
      const maped: NewDataNode[] = menus.map((menu) => {
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

    return handleCreateTree(data);
  }, [data]);

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };

  if (isError) {
    myError(error, handleRefreshToken);
  }
  return (
    <div>
      <p>MenuPage{isLoading ? "..." : null}</p>
      <Button onClick={() => refetch()}>refetch</Button>
      <DirectoryTree
        multiple
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={treeData}
      />
    </div>
  );
};

export default MenuPage;
