import { Outlet } from "react-router";

import PublicFooter from "../components/ui/PublicFooter";
import PublicHeader from "../components/ui/PublicHeader";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-text-primary">
      <PublicHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}

export default PublicLayout;
