import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

/**
 * Accesses the authentication context state and handlers.
 * Must be used within an AuthProvider wrapper.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

export default useAuth;
