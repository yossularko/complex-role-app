"use client";
import { AccessMenuPost } from "@/shared/types/menu";
import { brightColor } from "@/shared/utils/colors";
import { Space, Tag, Typography } from "antd";
import React, { useMemo } from "react";

const { Text } = Typography;

interface Props {
  item: AccessMenuPost;
}

const TagActions = ({ action }: { action: string }) => {
  const tagColor = useMemo(() => {
    return action === "create"
      ? "blue"
      : action === "read"
      ? "lime"
      : action === "update"
      ? "gold"
      : action === "delete"
      ? "red"
      : undefined;
  }, [action]);

  return <Tag color={tagColor}>{action}</Tag>;
};

const ActionList = ({ item }: Props) => {
  return (
    <div
      style={{
        backgroundColor: brightColor,
        marginBottom: 8,
        padding: 8,
        borderRadius: 10,
      }}
    >
      <Text>{item.slug}</Text>
      <br />
      <Space size={[0, 8]} wrap>
        {item.actions.map((act) => (
          <TagActions key={act} action={act} />
        ))}
      </Space>
    </div>
  );
};

export default ActionList;
