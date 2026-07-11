import { useContext } from "react";
import { StoreContext, StoreContextType } from "../context/StoreContext";

/**
 * Accesses the global data store state and CRUD handlers.
 * Must be used within a StoreProvider wrapper.
 */
export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  
  return context;
};

export default useStore;
