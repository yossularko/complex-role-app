"use client";
import { ErrorComp } from "@/shared/components/main";
import { AuthContext } from "@/shared/store/AuthContext";
import { ErrorObj, ErrorResponse } from "@/shared/types/error";
import {
  addProject,
  deleteProject,
  getProjectDetail,
  updateProject,
} from "@/shared/utils/fetchApi";
import { myError } from "@/shared/utils/myError";
import { useMutation } from "@tanstack/react-query";
import { Button, message, Space, Typography } from "antd";
import React, { useContext } from "react";

interface Props {
  initialData: string;
  errorRes?: ErrorObj;
}

const { Title } = Typography;

const Project2Page = ({ initialData, errorRes }: Props) => {
  const { menuAction, handleRefreshToken } = useContext(AuthContext);
  const { isCreate, isRead, isUpdate, isDelete } = menuAction.actions;

  const { mutate: mutateGet, isLoading: loadingGet } = useMutation(
    getProjectDetail,
    {
      onSuccess: (dataSuccess) => {
        message.success(dataSuccess);
      },
      onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
    }
  );

  const { mutate: mutateCreate, isLoading: loadingCreate } = useMutation(
    addProject,
    {
      onSuccess: (dataSuccess) => {
        message.success(dataSuccess);
      },
      onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
    }
  );

  const { mutate: mutateUpdate, isLoading: loadingUpdate } = useMutation(
    updateProject,
    {
      onSuccess: (dataSuccess) => {
        message.success(dataSuccess);
      },
      onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
    }
  );

  const { mutate: mutateDelete, isLoading: loadingDelete } = useMutation(
    deleteProject,
    {
      onSuccess: (dataSuccess) => {
        message.success(dataSuccess);
      },
      onError: (err: ErrorResponse) => myError(err, handleRefreshToken),
    }
  );

  if (errorRes) {
    return <ErrorComp error={errorRes} />;
  }
  return (
    <div>
      <Title level={2}>Project</Title>
      <Space>
        {isCreate && (
          <Button onClick={() => mutateCreate()} loading={loadingCreate}>
            Create
          </Button>
        )}
        {isRead && (
          <Button onClick={() => mutateGet(123)} loading={loadingGet}>
            Read
          </Button>
        )}
        {isUpdate && (
          <Button
            onClick={() => mutateUpdate({ id: 123 })}
            loading={loadingUpdate}
          >
            Update
          </Button>
        )}
        {isDelete && (
          <Button
            onClick={() => mutateDelete({ id: 123 })}
            loading={loadingDelete}
          >
            Delete
          </Button>
        )}
      </Space>
      <div style={{ marginTop: 20 }}>
        <pre>
          <code>{JSON.stringify(initialData)}</code>
        </pre>
      </div>
    </div>
  );
};

export default Project2Page;
