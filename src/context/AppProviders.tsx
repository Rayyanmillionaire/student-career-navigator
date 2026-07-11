"use client";

import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "./AuthContext";
import { StoreProvider } from "./StoreContext";

const StoreWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const token = auth ? auth.token : null;
  return <StoreProvider authToken={token}>{children}</StoreProvider>;
};

/**
 * AppProviders combines the authentication provider and global state store provider,
 * making state reactive across the entire application shell.
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <StoreWrapper>{children}</StoreWrapper>
    </AuthProvider>
  );
};

export default AppProviders;
