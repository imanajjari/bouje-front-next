import { API_BASE_URL } from "../../app/[locale]/api/config";

const fetcher = async (endpoint) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch ${endpoint}: ${errorText}`);
  }

  return res.json();
};

export const homeService = {
  getBanners: () => fetcher("/api/home/banners/"),
  getServices: () => fetcher("/api/home/services/"),
  getCollections: () => fetcher("/api/home/collections/"),
  getFeatureBlocks: () => fetcher("/api/home/features/"),
  getCategoryBanners: () => fetcher("/api/home/category-banners/"),
};
