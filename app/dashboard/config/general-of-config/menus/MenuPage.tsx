"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Menu, MenuNodeTree, MenuSelect } from "@/shared/types/menu";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { deleteMenu, getMenus } from "@/shared/utils/fetchApi";
import { ErrorResponse } from "@/shared/types/error";
import { myError } from "@/shared/utils/myError";
import { AuthContext } from "@/shared/store/AuthContext";
import { Button, Space, Tree, Typography } from "antd";
import type { DirectoryTreeProps, EventDataNode } from "antd/es/tree";
import { useDisclosure } from "@/shared/hooks";
import DrawerAddTopMenu from "./DrawerAddTopMenu";
import { CardAbsolute } from "@/shared/components/main";

interface Props {
  initialData: Menu[];
}

const { DirectoryTree } = Tree;
const { Title } = Typography;

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

const MenuPage = ({ initialData }: Props) => {
  const [selected, setSelected] = useState<MenuSelect>(initialSelected);
  const [selectType, setSeletType] = useState<
    "parent" | "update" | "add child"
  >("parent");
  const { handleRefreshToken } = useContext(AuthContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading, isError, error, refetch } = useQuery<
    Menu[],
    ErrorResponse
  >(["menus"], () => getMenus(), {
    initialData: initialData,
    refetchOnWindowFocus: false,
  });

  const { mutate: mutateDelete, isLoading: loadingDelete } = useMutation(
    deleteMenu,
    {
      onSuccess: (dataSuccess) => {
        console.log("success delete: ", dataSuccess);
        refetch();
        setSelected(initialSelected);
      },
      onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
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

    return handleCreateTree(data);
  }, [data]);

  const handleDeleteMenu = useCallback(() => {
    mutateDelete({ slug: selected.slug });
  }, [selected.slug, mutateDelete]);

  const onSelect: DirectoryTreeProps["onSelect"] = async (keys, info) => {
    const { id, slug, name, alias, parent, createdAt, updatedAt, isLeaf } =
      info.node as EventDataNode<MenuNodeTree>;
    setSelected({
      id,
      slug,
      name,
      alias,
      parent,
      createdAt,
      updatedAt,
      isLeaf: isLeaf || false,
    });
  };

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };

  useEffect(() => {
    if (isError) {
      myError(error, () => handleRefreshToken(true));
    }
  }, [isError, error, handleRefreshToken]);

  return (
    <div>
      <DrawerAddTopMenu
        type={selectType}
        data={selected}
        isOpen={isOpen}
        onClose={onClose}
        onFinish={() => {
          refetch();
          setSelected(initialSelected);
        }}
      />
      <Title level={2}>Menu{isLoading ? "..." : null}</Title>
      <Space style={{ marginBottom: 10 }}>
        <Button onClick={() => refetch()}>Refetch</Button>
        <Button
          type="primary"
          onClick={() => {
            setSeletType("parent");
            onOpen();
          }}
        >
          Add Top Parent Menu
        </Button>
      </Space>
      <DirectoryTree
        multiple
        defaultExpandAll
        expandAction="doubleClick"
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={treeData}
      />
      {selected.slug ? (
        <CardAbsolute style={{ zIndex: 10, bottom: 40, right: 40 }}>
          <Title level={5}>{selected.alias}</Title>
          <Space>
            <Button
              onClick={() => {
                setSeletType("update");
                onOpen();
              }}
            >
              Update
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setSeletType("add child");
                onOpen();
              }}
            >
              Add Child
            </Button>
            {selected.isLeaf ? (
              <Button danger onClick={handleDeleteMenu} loading={loadingDelete}>
                Delete
              </Button>
            ) : null}
          </Space>
        </CardAbsolute>
      ) : null}
    </div>
  );
};

export default MenuPage;
