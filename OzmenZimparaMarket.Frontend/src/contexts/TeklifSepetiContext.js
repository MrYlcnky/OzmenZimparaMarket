import { createContext, useContext } from "react";

const TeklifSepetiContext = createContext(null);

export function useTeklifSepeti() {
  const context = useContext(TeklifSepetiContext);

  if (!context) {
    throw new Error(
      "useTeklifSepeti, TeklifSepetiProvider içerisinde kullanılmalıdır.",
    );
  }

  return context;
}

export default TeklifSepetiContext;
