import { createContext, useState } from "react";
export const PreloaderContext = createContext();
export const PreloaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <PreloaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </PreloaderContext.Provider>
  );
};
