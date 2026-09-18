import { Navigate, Outlet } from "react-router";

import { mevcutOturumGetir } from "../../api/servisler/authServisi";

function YonetimKorumasi() {
  const oturum = mevcutOturumGetir();

  if (!oturum) {
    return <Navigate to="/ozmen-zimpara-yonetim/sign-in" replace />;
  }

  return <Outlet />;
}

export default YonetimKorumasi;
