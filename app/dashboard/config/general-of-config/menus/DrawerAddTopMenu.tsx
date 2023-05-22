"use client";
import { AuthContext } from "@/shared/store/AuthContext";
import { ErrorResponse } from "@/shared/types/error";
import { MenuInputs } from "@/shared/types/formValue";
import { MenuSelect } from "@/shared/types/menu";
import { addMenu, updateMenu } from "@/shared/utils/fetchApi";
import { myError } from "@/shared/utils/myError";
import { useMutation } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useContext, useEffect, useMemo } from "react";

interface Props {
  type: "parent" | "update" | "add child";
  data: MenuSelect;
  isOpen: boolean;
  onClose: () => void;
  onFinish: () => void;
}

const { Text } = Typography;

const DrawerAddTopMenu = ({ type, data, isOpen, onClose, onFinish }: Props) => {
  const { handleRefreshToken } = useContext(AuthContext);

  const [form] = useForm<MenuInputs>();

  const { mutate: mutateAdd, isLoading: loadingAdd } = useMutation(addMenu, {
    onSuccess: (dataSuccess) => {
      console.log("success post: ", dataSuccess);

      onClose();
      onFinish();
    },
    onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
  });

  const { mutate: mutateUpdate, isLoading: loadingUpdate } = useMutation(
    updateMenu,
    {
      onSuccess: (dataSuccess) => {
        console.log("success update: ", dataSuccess);
        onClose();
        onFinish();
      },
      onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
    }
  );

  const parentSlug = useMemo(() => {
    const value = [...data.parent, data.slug];
    const display = `/ ${value.join(" / ")}`;

    return { value, display };
  }, [data]);

  const titleDrawer = useMemo(() => {
    return type === "parent"
      ? "Add Top Parent Menu"
      : type === "update"
      ? "Update Menu"
      : "Add Menu Child";
  }, [type]);

  const onSubmit = (values: MenuInputs) => {
    const { name, alias } = values;
    const dataPost = {
      name,
      alias,
      parent: type === "parent" ? [] : parentSlug.value,
    };

    const dataUpdate = {
      name,
      alias,
    };

    if (type !== "update") {
      mutateAdd({ data: dataPost });
      return;
    }

    mutateUpdate({ data: dataUpdate, slug: data.slug });
  };

  const onSubmitFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (type === "update") {
      form.setFieldsValue({ name: data.name, alias: data.alias });
    } else {
      form.resetFields();
    }
  }, [data, form, type]);

  return (
    <Drawer
      title={titleDrawer}
      placement="right"
      onClose={onClose}
      open={isOpen}
    >
      {type !== "parent" ? (
        <div style={{ marginBottom: 10 }}>
          <Text type="secondary">Parent</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 16 }}>
            {parentSlug.display}
          </Text>
        </div>
      ) : null}
      <Form
        form={form}
        name="addTopParent"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onSubmitFailed}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input placeholder="input name" />
        </Form.Item>

        <Form.Item
          label="Display Name"
          name="alias"
          rules={[{ required: true, message: "Please input display name!" }]}
        >
          <Input placeholder="input display name" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loadingAdd || loadingUpdate}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DrawerAddTopMenu;
