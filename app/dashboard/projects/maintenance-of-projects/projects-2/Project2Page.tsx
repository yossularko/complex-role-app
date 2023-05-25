"use client"
import { AuthContext } from "@/shared/store/AuthContext";
import { Button, Space, Typography } from "antd";
import React, { useContext } from "react";

const { Title } = Typography;

const Project2Page = () => {
  const { menuAction } = useContext(AuthContext);
  const { isCreate, isRead, isUpdate, isDelete } = menuAction.actions;
  return (
    <div>
      <Title level={2}>Project</Title>
      <Space>
        {isCreate && <Button>Create</Button>}
        {isRead && <Button>Read</Button>}
        {isUpdate && <Button>Update</Button>}
        {isDelete && <Button>Delete</Button>}
      </Space>
    </div>
  );
};

export default Project2Page;
