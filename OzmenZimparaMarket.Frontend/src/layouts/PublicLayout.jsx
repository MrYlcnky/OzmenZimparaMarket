import { Outlet } from "react-router";

import PublicSiteProvider from "../contexts/PublicSiteProvider";
import TeklifSepetiProvider from "../contexts/TeklifSepetiProvider";

import PublicHeader from "../components/public/layout/PublicHeader";
import PublicFooter from "../components/public/layout/PublicFooter";

import ScrollToTop from "../components/common/ScrollToTop";

function PublicLayout() {
  return (
    <PublicSiteProvider>
      <TeklifSepetiProvider>
        <div
          className="
            flex
            min-h-screen
            flex-col
            bg-[#050711]
            text-white
          "
        >
          <ScrollToTop />

          <PublicHeader />

          <main
            className="
              relative
              flex-1
            "
          >
            <Outlet />
          </main>

          <PublicFooter />
        </div>
      </TeklifSepetiProvider>
    </PublicSiteProvider>
  );
}

export default PublicLayout;
