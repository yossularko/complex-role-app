"use client";
import { AuthContext } from "@/shared/store/AuthContext";
import { UserList } from "@/shared/types";
import { ErrorObj, ErrorResponse } from "@/shared/types/error";
import {
  AccessMenuPost,
  AccsMenuSelect,
  Menu,
  MenuNodeTree,
  TemplateMenu,
} from "@/shared/types/menu";
import {
  getAccessMenu,
  getMenus,
  getTemplateMenuDetail,
  getTemplateMenus,
  getUsers,
  replaceAccessMenu,
} from "@/shared/utils/fetchApi";
import { myError } from "@/shared/utils/myError";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Dropdown,
  message,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import { AccessMenu } from "@/shared/types/login";
import { DirectoryTreeProps, EventDataNode } from "antd/es/tree";
import { Tree } from "antd";
import { getMenuLeaf } from "@/shared/utils/myFunction";
import ActionList from "./ActionList";
import { CardAbsolute, ErrorComp } from "@/shared/components/main";
import TagAction from "./TagAction";
import { EditFilled, SafetyCertificateFilled } from "@ant-design/icons";
import { useDisclosure } from "@/shared/hooks";
import DrawerConfigActions from "./DrawerConfigActions";
import DrawerTemplateMenu from "./DrawerTemplateMenu";
import { brightColor } from "@/shared/utils/colors";

interface Props {
  initialUser: UserList[];
  initialMenu: Menu[];
  initialTemplate: TemplateMenu[];
  errorRes?: ErrorObj;
}

type CheckVariant = {
  checked: React.Key[];
  halfChecked: React.Key[];
};

type CheckedKeys = CheckVariant | React.Key[];

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
  actions: [],
  isLeaf: false,
};

const getData = async () => {
  return await Promise.all([getUsers(), getMenus(), getTemplateMenus()]);
};

const AccessMenuPage = ({
  initialUser,
  initialMenu,
  initialTemplate,
  errorRes,
}: Props) => {
  const [userId, setUserId] = useState(0);
  const [isUpdateTemp, setIsUpdateTemp] = useState(false);

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
  const {
    isOpen: isTemplate,
    onOpen: openTemplate,
    onClose: closeTemplate,
  } = useDisclosure();

  const { data, isLoading, isError, error, refetch } = useQuery<
    [UserList[], Menu[], TemplateMenu[]],
    ErrorResponse
  >(["users-menus"], () => getData(), {
    enabled: errorRes ? false : true,
    initialData: [initialUser, initialMenu, initialTemplate],
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

  const { mutate: mutateReplace, isLoading: loadingReplace } = useMutation(
    replaceAccessMenu,
    {
      onSuccess: (dataSuccess) => {
        console.log("success replace: ", dataSuccess);
        setSelected({
          keys: [],
          value: initialSelected,
        });
        accessMenu.refetch();
      },
      onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
    }
  );

  const { mutate: mutateGetTemplate, isLoading: loadingGetTemplate } =
    useMutation(getTemplateMenuDetail, {
      onSuccess: (dataSuccess) => {
        const initData = dataSuccess;
        const lists = getMenuLeaf(initData.menus as AccessMenu[]);
        const masterData = lists.map((item) => ({
          menuSlug: item.slug,
          actions: item.actions,
        }));
        const checkedVal = lists.map((item) => item.slug);
        setMasterAccsMenu(masterData);
        setCheckedKeys(checkedVal);
      },
      onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
    });

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
        setMasterAccsMenu((prev) =>
          prev.filter((val) => val.menuSlug !== slug)
        );
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
    if (!userId) {
      message.error("User Id is empty!");
      return;
    }

    const newChecked = checkedKeys as CheckVariant;
    const menuListKey = [
      ...newChecked.halfChecked,
      ...newChecked.checked,
    ] as string[];

    if (menuListKey.length === 0) {
      message.error("Please select menu!");
      return;
    }

    const menuPost: AccessMenuPost[] = menuListKey.map((item) => {
      const idx = masterAccsMenu.findIndex((val) => val.menuSlug === item);
      if (idx !== -1) {
        return masterAccsMenu[idx];
      }

      return { menuSlug: item, actions: [] };
    });

    mutateReplace({ data: { userId, menus: menuPost } });
  }, [checkedKeys, masterAccsMenu, mutateReplace, userId]);

  const handleApplyTemp = useCallback(
    (template: TemplateMenu) => {
      mutateGetTemplate(template.id);
    },
    [mutateGetTemplate]
  );

  const handleMore = useCallback(
    (key: string) => {
      if (key === "add") {
        setIsUpdateTemp(false);
        openTemplate();
        return;
      }

      setIsUpdateTemp(true);
      openTemplate();
    },
    [openTemplate]
  );

  useLayoutEffect(() => {
    if (isError) {
      myError(error, () => handleRefreshToken(true));
    }

    if (accessMenu.isError) {
      myError(accessMenu.error, () => handleRefreshToken(true));
    }
  }, [accessMenu, error, isError, handleRefreshToken]);

  if (errorRes) {
    return <ErrorComp error={errorRes} />;
  }

  return (
    <div>
      <DrawerConfigActions
        visible={isOpen}
        onClose={onClose}
        data={selected.value}
        onSubmit={(val) => handleSetActions(val)}
      />
      <DrawerTemplateMenu
        isUpdate={isUpdateTemp}
        visible={isTemplate}
        onClose={closeTemplate}
        checkedKeys={checkedKeys as CheckVariant}
        masterAccsMenu={masterAccsMenu}
        templateMenu={data[2]}
        onFinish={() => {
          refetch().then(() => {
            setMasterAccsMenu([]);
            setCheckedKeys([]);
            setSelected({
              keys: [],
              value: initialSelected,
            });
            setUserId(0);
          });
        }}
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
          <Title level={4}>
            Template Menu {loadingGetTemplate && <Spin size="small" />}
          </Title>
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {data[2].map((item) => {
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    backgroundColor: brightColor,
                    marginBottom: 8,
                    padding: 8,
                    borderRadius: 10,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Text>{item.name}</Text>
                  </div>
                  <Button
                    type="primary"
                    shape="round"
                    size="small"
                    onClick={() => handleApplyTemp(item)}
                  >
                    Apply
                  </Button>
                </div>
              );
            })}
          </div>
          <Space style={{ marginTop: 20 }}>
            <Title level={4}>
              List Menu Actions {`(${masterAccsMenu.length})`}
            </Title>
            <Button
              onClick={() => {
                setMasterAccsMenu([]);
                setCheckedKeys([]);
                setSelected({
                  keys: [],
                  value: initialSelected,
                });
              }}
            >
              Clear
            </Button>
          </Space>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {masterAccsMenu.map((item) => (
              <ActionList key={item.menuSlug} item={item} />
            ))}
          </div>
        </div>
      </div>
      {/* @ts-ignore */}
      {checkedKeys.checked ? (
        <CardAbsolute style={{ zIndex: 10, bottom: 40, left: 40 }}>
          <Dropdown.Button
            menu={{
              items: [
                { key: "add", label: "Add Template" },
                { key: "update", label: "Update Template" },
              ],
              onClick: (e) => handleMore(e.key),
            }}
            type="primary"
            size="large"
            onClick={handleApplyChange}
            loading={loadingReplace}
          >
            Apply Change
          </Dropdown.Button>
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
