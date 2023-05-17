import React from "react";
import styles from "../component.module.css";

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Card = ({ children, style }: Props): JSX.Element => {
  return (
    <div style={style} className={styles.card}>
      {children}
    </div>
  );
};

export default Card;
