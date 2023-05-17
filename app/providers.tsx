"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "@/shared/store/AuthContext";
import React, { PropsWithChildren } from "react";
import { RootStyleRegistry } from "@/shared/components/root-style-registry";

const queryClient = new QueryClient();

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RootStyleRegistry>
        <AuthProvider>{children}</AuthProvider>
      </RootStyleRegistry>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
