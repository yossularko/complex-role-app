"use client";
import { AccessMenuPost } from "@/shared/types/menu";
import { brightColor } from "@/shared/utils/colors";
import { Space, Typography } from "antd";
import React from "react";
import TagAction from "./TagAction";

const { Text } = Typography;

interface Props {
  item: AccessMenuPost;
}

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
          <TagAction key={act} action={act} />
        ))}
      </Space>
    </div>
  );
};

export default ActionList;
