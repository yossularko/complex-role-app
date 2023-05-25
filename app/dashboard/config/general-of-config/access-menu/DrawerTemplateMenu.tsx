import { AuthContext } from "@/shared/store/AuthContext";
import { ErrorResponse } from "@/shared/types/error";
import { AccessMenuPost, TemplateMenu } from "@/shared/types/menu";
import { addTemplateMenu, updateTemplateMenu } from "@/shared/utils/fetchApi";
import { myError } from "@/shared/utils/myError";
import { useMutation } from "@tanstack/react-query";
import { Button, Drawer, Input, message, Select } from "antd";
import React, { useCallback, useContext, useState } from "react";
import ActionList from "./ActionList";

interface Props {
  isUpdate?: boolean;
  visible: boolean;
  onClose: () => void;
  checkedKeys: {
    checked: React.Key[];
    halfChecked: React.Key[];
  };
  masterAccsMenu: AccessMenuPost[];
  templateMenu: TemplateMenu[];
  onFinish: () => void;
}

const DrawerTemplateMenu = ({
  isUpdate,
  visible,
  onClose,
  checkedKeys,
  masterAccsMenu,
  templateMenu,
  onFinish,
}: Props) => {
  const { handleRefreshToken } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [tempId, setTempId] = useState(0);

  const { mutate: mutateAdd, isLoading: loadingAdd } = useMutation(
    addTemplateMenu,
    {
      onSuccess: (dataSuccess) => {
        console.log("success add: ", dataSuccess);
        onClose();
        onFinish();
      },
      onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
    }
  );

  const { mutate: mutateUpdate, isLoading: loadingUpdate } = useMutation(
    updateTemplateMenu,
    {
      onSuccess: (dataSuccess) => {
        console.log("success update: ", dataSuccess);
        onClose();
        onFinish();
      },
      onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
    }
  );

  const handleSubmit = useCallback(() => {
    const menuListKey = [
      ...checkedKeys.halfChecked,
      ...checkedKeys.checked,
    ] as string[];

    if (menuListKey.length === 0) {
      message.error("Access menu is Empty!");
      return;
    }

    const menuPost: AccessMenuPost[] = menuListKey.map((item) => {
      const idx = masterAccsMenu.findIndex((val) => val.menuSlug === item);
      if (idx !== -1) {
        return masterAccsMenu[idx];
      }

      return { menuSlug: item, actions: [] };
    });

    if (isUpdate) {
      if (!tempId) {
        message.error("Please select Template!");
        return;
      }

      mutateUpdate({ id: tempId, data: { menus: menuPost } });
      return;
    }

    if (!name) {
      message.error("Please input Template Name!");
      return;
    }

    mutateAdd({ data: { name, menus: menuPost } });
  }, [
    checkedKeys,
    masterAccsMenu,
    isUpdate,
    name,
    tempId,
    mutateAdd,
    mutateUpdate,
  ]);

  return (
    <Drawer
      title="Menu Actions Config"
      placement="right"
      onClose={onClose}
      open={visible}
      footer={
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loadingAdd || loadingUpdate}
        >
          {isUpdate ? "Update Template" : "Add Template"}
        </Button>
      }
    >
      <div>
        {isUpdate ? (
          <Select
            style={{ width: "100%" }}
            placeholder="select template"
            value={tempId}
            onChange={(val) => setTempId(val)}
            options={templateMenu.map((val) => {
              return {
                label: val.name,
                value: val.id,
              };
            })}
          />
        ) : (
          <Input
            placeholder="input template name"
            value={name}
            onChange={(val) => setName(val.target.value)}
          />
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        {masterAccsMenu.map((item) => (
          <ActionList key={item.menuSlug} item={item} />
        ))}
      </div>
    </Drawer>
  );
};

export default DrawerTemplateMenu;
