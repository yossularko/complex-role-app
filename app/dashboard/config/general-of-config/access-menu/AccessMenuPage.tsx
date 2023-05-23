"use client";
import { AuthContext } from "@/shared/store/AuthContext";
import { UserList } from "@/shared/types";
import { ErrorResponse } from "@/shared/types/error";
import {
  AccessMenuPost,
  AccsMenuSelect,
  Menu,
  MenuNodeTree,
} from "@/shared/types/menu";
import { getAccessMenu, getMenus, getUsers } from "@/shared/utils/fetchApi";
import { myError } from "@/shared/utils/myError";
import { useQuery } from "@tanstack/react-query";
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Button, Select, Space, Typography } from "antd";
import { AccessMenu } from "@/shared/types/login";
import { DirectoryTreeProps, EventDataNode } from "antd/es/tree";
import { Tree } from "antd";
import { getMenuLeaf } from "@/shared/utils/myFunction";
import ActionList from "./ActionList";
import { CardAbsolute } from "@/shared/components/main";
import TagAction from "./TagAction";
import {
  EditFilled,
  SafetyCertificateFilled,
  CheckOutlined,
} from "@ant-design/icons";
import { useDisclosure } from "@/shared/hooks";
import DrawerConfigActions from "./DrawerConfigActions";

interface Props {
  initialUser: UserList[];
  initialMenu: Menu[];
}

type CheckVariant = {
  checked: React.Key[];
  halfChecked: React.Key[];
};

type CheckedKeys = CheckVariant | React.Key[];

const { Title } = Typography;
const { DirectoryTree } = Tree;

const initialSelected = {
  id: 0,
  slug: "",
  name: "",
  alias: "",
  parent: [],
  createdAt: "",
  updatedAt: "",
  actions: [],
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
    value: AccsMenuSelect;
  }>({
    keys: [],
    value: initialSelected,
  });
  const { handleRefreshToken } = useContext(AuthContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
          menuSlug: item.slug,
          actions: item.actions,
        }));
        const checkedVal = lists.map((item) => item.slug);
        setMasterAccsMenu(masterData);
        setCheckedKeys(checkedVal);
      },
    }
  );

  // start tree data ======================
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
    const { slug } = info.node as EventDataNode<MenuNodeTree>;
    if (!info.checked) {
      const isExist = masterAccsMenu.some((item) => item.menuSlug === slug);

      setSelected({
        keys: [],
        value: initialSelected,
      });

      if (isExist) {
        setMasterAccsMenu((prev) => prev.filter((val) => val.menuSlug !== slug));
      }
    }

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

    if (slug === selected.value.slug) {
      onOpen();
      return;
    }

    const idx = masterAccsMenu.findIndex((master) => master.menuSlug === slug);
    const dataAction = idx === -1 ? [] : masterAccsMenu[idx].actions;

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
        actions: dataAction,
        isLeaf: isLeaf || false,
      },
    });
    if (!checked && isLeaf) {
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
  // end tree data ======================

  const handleSetActions = useCallback(
    (values?: string[]) => {
      const { slug } = selected.value;
      const actions = values || ["create", "read", "update", "delete"];
      setMasterAccsMenu((prev) => {
        const isExist = prev.some((val) => val.menuSlug === slug);

        if (isExist) {
          return prev.map((item) => {
            if (item.menuSlug === slug) {
              return { ...item, actions };
            }
            return item;
          });
        }

        return [{ menuSlug: slug, actions }, ...prev];
      });
      setSelected((prev) => ({ ...prev, value: initialSelected }));
    },
    [selected.value]
  );

  const handleApplyChange = useCallback(() => {
    const newChecked = checkedKeys as CheckVariant;
    const menuListKey = [...newChecked.halfChecked, ...newChecked.checked] as string[];
    const menuPost: AccessMenuPost[] = menuListKey.map(item => {
      const idx = masterAccsMenu.findIndex(val => val.menuSlug === item);
      if(idx !== -1){
        return masterAccsMenu[idx]
      }

      return {menuSlug: item, actions: []}
    })

    console.log("menu post: ", menuPost)
  }, [checkedKeys, masterAccsMenu]);

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
      <DrawerConfigActions
        visible={isOpen}
        onClose={onClose}
        data={selected.value}
        onSubmit={(val) => handleSetActions(val)}
      />
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
        <div style={{ flex: 1, marginRight: 10 }}>
          <DirectoryTree
            checkable
            defaultExpandAll
            expandAction="doubleClick"
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
            <ActionList key={item.menuSlug} item={item} />
          ))}
        </div>
      </div>
      {/* @ts-ignore */}
      {checkedKeys.checked ? (
        <CardAbsolute style={{ zIndex: 10, bottom: 40, left: 40 }}>
          <Button
            type="primary"
            size="large"
            icon={<CheckOutlined />}
            onClick={handleApplyChange}
          >
            Apply Change
          </Button>
        </CardAbsolute>
      ) : null}
      {selected.value.slug ? (
        <CardAbsolute style={{ zIndex: 11, bottom: 40, right: 40 }}>
          <Space>
            <Title level={5}>{selected.value.alias}</Title>
            <Space>
              <Button
                type="primary"
                icon={<EditFilled />}
                shape="circle"
                size="small"
                disabled={!selected.value.isLeaf}
                onClick={onOpen}
              />
              <Button
                type="primary"
                icon={<SafetyCertificateFilled />}
                shape="circle"
                size="small"
                disabled={!selected.value.isLeaf}
                onClick={() => handleSetActions()}
              />
            </Space>
          </Space>
          <br />
          <Space size={[0, 8]} wrap>
            {selected.value.actions.map((act) => (
              <TagAction key={act} action={act} />
            ))}
          </Space>
        </CardAbsolute>
      ) : null}
    </div>
  );
};

export default AccessMenuPage;
