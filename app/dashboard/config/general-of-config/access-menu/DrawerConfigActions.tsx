import { AccsMenuSelect } from "@/shared/types/menu";
import { Drawer, Typography, Select, Button } from "antd";
import type { SelectProps } from "antd";
import React, { useEffect, useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  data: AccsMenuSelect;
  onSubmit: (values: string[]) => void;
}

const { Text } = Typography;

const options: SelectProps["options"] = [
  { label: "Create", value: "create" },
  { label: "Read", value: "read" },
  { label: "Update", value: "update" },
  { label: "Delete", value: "delete" },
];

const DrawerConfigActions = ({ visible, onClose, data, onSubmit }: Props) => {
  const [selectVal, setSelectVal] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setSelectVal(data.actions);
    }
  }, [visible, data.actions]);
  return (
    <Drawer
      title="Menu Actions Config"
      placement="right"
      onClose={onClose}
      open={visible}
      footer={
        <Button
          type="primary"
          onClick={() => {
            onClose();
            onSubmit(selectVal);
          }}
        >
          Apply
        </Button>
      }
    >
      <Text type="secondary">Name</Text>
      <br />
      <Text style={{ fontSize: 18, fontWeight: 500 }}>{data.alias}</Text>
      <br />
      <br />
      <Text type="secondary">Select Actions</Text>
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder="Please select actions"
        value={selectVal}
        onChange={(val) => setSelectVal(val)}
        options={options}
      />
    </Drawer>
  );
};

export default DrawerConfigActions;
