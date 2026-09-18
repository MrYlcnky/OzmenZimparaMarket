import { createContext, useContext } from "react";

const PublicSiteContext = createContext(null);

export function usePublicSite() {
  const context = useContext(PublicSiteContext);

  if (!context) {
    throw new Error(
      "usePublicSite, PublicSiteProvider içerisinde kullanılmalıdır.",
    );
  }

  return context;
}

export default PublicSiteContext;
