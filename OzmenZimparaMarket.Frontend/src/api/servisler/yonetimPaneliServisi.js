import apiClient from "../client";

export async function yonetimPaneliOzetGetir() {
  const response = await apiClient.get("/yonetim-paneli/ozet");

  return response.data;
}
