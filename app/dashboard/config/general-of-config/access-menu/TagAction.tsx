"use client";
import { Tag } from "antd";
import React, { useMemo } from "react";

const TagAction = ({ action }: { action: string }) => {
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

export default TagAction;
