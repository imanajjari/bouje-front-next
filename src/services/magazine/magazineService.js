// /src/services/magazine/magazineService.js
import { API_BASE_URL } from "../../app/[locale]/api/config";

/* ------------------------------------------------------------------ */
/* Cache Control Bucket                                               */
/* ------------------------------------------------------------------ */

const CACHE_ENABLED = true;
const CACHE_BUCKET = {
  blogPosts: 0,
  blogPostDetail: 0,
  blogCategories: 0,
  blogCollections: 0,
  masterCategories: 0,
  popularBlogData: 0,
  blogSearch: 0
};

function cacheTime(key) {
  return CACHE_ENABLED ? CACHE_BUCKET[key] : 0;
}

/* ------------------------------------------------------------------ */
/* Base fetch helper                                                  */
/* ------------------------------------------------------------------ */

async function request(url, revalidateSeconds = 60) {
  const res = await fetch(url, {
    next: { revalidate: revalidateSeconds }
  });

  if (!res.ok) {
    throw new Error(`شبکه یا سرور در دسترس نیست → ${url}`);
  }

  return res.json();
}

/* ------------------------------------------------------------------ */
/* Blog posts                                                         */
/* ------------------------------------------------------------------ */

// نکته مهم: اسلش ابتدایی از شروع مسیرها حذف شد چون API_BASE_URL خودش اسلش دارد.

export async function fetchBlogPosts(params = {}) {
  const query = new URLSearchParams(params);

  // تغییر: حذف اسلش قبل از api
  const url = `${API_BASE_URL}api/blog/posts/` +
    (query.toString() ? "?" + query.toString() : "");

  return request(url, cacheTime("blogPosts"));
}

export async function fetchBlogPostBySlug(slug) {
  // تغییر: حذف اسلش قبل از api
  const url = `${API_BASE_URL}api/blog/posts/${slug}/`;
  return request(url, cacheTime("blogPostDetail"));
}

export async function fetchBlogPostsByTag(tag) {
  return fetchBlogPosts({ tag });
}

export async function fetchBlogPostsByCategory(category) {
  return fetchBlogPosts({ category });
}

/* ------------------------------------------------------------------ */
/* Categories & collections                                           */
/* ------------------------------------------------------------------ */

export async function fetchBlogCategories() {
  // تغییر: حذف اسلش قبل از api
  const url = `${API_BASE_URL}api/blog/categories/`;
  return request(url, cacheTime("blogCategories"));
}

export async function fetchMasterBlogCategories() {
  // تغییر: حذف اسلش قبل از api
  const url = `${API_BASE_URL}api/blog/categories/?master=true`;
  return request(url, cacheTime("masterCategories"));
}

export async function fetchBlogCollections() {
  // تغییر: حذف اسلش قبل از api
  const url = `${API_BASE_URL}api/blog/collections/`;
  return request(url, cacheTime("blogCollections"));
}

/* ------------------------------------------------------------------ */
/* Popular & search                                                   */
/* ------------------------------------------------------------------ */

export async function fetchPopularBlogData() {
  // تغییر: حذف اسلش قبل از api
  const url = `${API_BASE_URL}api/blog/popular/`;
  return request(url, cacheTime("popularBlogData"));
}

export async function searchBlogPosts(params) {
  const query = new URLSearchParams(params);

  // تغییر: حذف اسلش قبل از api
  const url = `${API_BASE_URL}api/blog/search/` +
    (query.toString() ? "?" + query.toString() : "");

  return request(url, cacheTime("blogSearch"));
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                         */
/* ------------------------------------------------------------------ */

export async function subscribeToNewsletter(email) {
  // تغییر: حذف اسلش قبل از api
  const url = `${API_BASE_URL}api/blog/subscribe/`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  if (!res.ok) {
    throw new Error("ثبت‌نام در خبرنامه با خطا مواجه شد.");
  }

  return res.json();
}
