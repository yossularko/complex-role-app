"use client";
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useSearchParams } from "next/navigation";

const AccessMenu = () => {
  const [name, setName] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    setName(searchParams.get("name") || "");
  }, [searchParams]);
  return (
    <div>
      <p>AccessMenu{name}</p>
      <Button>Test</Button>
    </div>
  );
};

export default AccessMenu;
