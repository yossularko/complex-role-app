import { mainColor } from "@/shared/utils/colors";
import React from "react";

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const initStyle: React.CSSProperties = {
  position: "fixed",
  backgroundColor: "white",
  padding: 10,
  borderRadius: 14,
  border: `2px solid ${mainColor}`,
};

const CardAbsolute = ({ children, style }: Props) => {
  return (
    <div style={style ? { ...initStyle, ...style } : initStyle}>{children}</div>
  );
};

export default CardAbsolute;
