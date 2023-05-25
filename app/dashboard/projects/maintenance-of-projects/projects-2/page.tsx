import { ErrorResponse } from "@/shared/types/error";
import { getProjects } from "@/shared/utils/fetchApi";
import { getErrorRes } from "@/shared/utils/myFunction";
import { cookies } from "next/headers";
import React from "react";
import Project2Page from "./Project2Page";

const Project2 = async () => {
  try {
    const jwt_auth = cookies().get("jwt_auth");
    const initialData = await getProjects(jwt_auth?.value);
    return <Project2Page initialData={initialData} />;
  } catch (error) {
    return (
      <Project2Page
        initialData=""
        errorRes={getErrorRes(error as ErrorResponse)}
      />
    );
  }
};

export default Project2;
