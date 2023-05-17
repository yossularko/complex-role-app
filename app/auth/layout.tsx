import React, { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <p>AuthLayout</p>
      <div>{children}</div>
    </div>
  );
};

export default AuthLayout;
