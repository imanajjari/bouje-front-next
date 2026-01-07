// /src/services/magazine/magazineService.ts
import { API_BASE_URL } from "../../app/[locale]/api/config";

/* ------------------------------------------------------------------ */
/* Cache Control Bucket                                               */
/* ------------------------------------------------------------------ */

/**
 * 🔥 سوییچ کلی کش
 * false → همهٔ کش‌ها خاموش
 * true  → کش‌ها طبق مقادیر زیر فعال
 */
const CACHE_ENABLED = true;

/**
 * ⏱️ مدت کش (بر حسب ثانیه) برای هر سرویس

const CACHE_BUCKET = {
  blogPosts: 0,                 // لیست پست‌ها
  blogPostDetail: 60,            // پست تکی
  blogCategories: 3600,          // دسته‌بندی‌ها
  blogCollections: 300,          // کالکشن‌ها
  masterCategories: 3600,        // دسته‌بندی‌های master
  popularBlogData: 300,          // داده‌های محبوب
  blogSearch: 30,                // جستجو
};
 */
// DEBOG : FOR CHECK TO UI
const CACHE_BUCKET = {
  blogPosts: 0,                 // لیست پست‌ها
  blogPostDetail: 0,            // پست تکی
  blogCategories: 0,          // دسته‌بندی‌ها
  blogCollections: 0,          // کالکشن‌ها
  masterCategories: 0,        // دسته‌بندی‌های master
  popularBlogData: 0,          // داده‌های محبوب
  blogSearch: 0,                // جستجو
};
function cacheTime(key: keyof typeof CACHE_BUCKET) {
  return CACHE_ENABLED ? CACHE_BUCKET[key] : 0;
}

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  media: string;
  file: string | null;
  tags: string[];
  featured_level: 0 | 1 | 2 | 3;
  comments_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostDetail extends BlogPost {
  related_posts: BlogPost[];
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

export interface BlogCollection {
  id: number;
  title: string;
  slug: string;
  description?: string;
  direction?: "ltr" | "rtl";
  banner_media?: string;
  posts_count?: number;
  categories?: BlogCategory[];
  posts: BlogPost[];
}

export interface PopularBlogData {
  tags: string[];
  categories: BlogCategory[];
}

/* ------------------------------------------------------------------ */
/* Base fetch helper                                                  */
/* ------------------------------------------------------------------ */

async function request<T>(
  url: string,
  revalidateSeconds = 60
): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`شبکه یا سرور در دسترس نیست → ${url}`);
  }

  return res.json();
}

/* ------------------------------------------------------------------ */
/* Blog posts                                                         */
/* ------------------------------------------------------------------ */

export async function fetchBlogPosts(params?: {
  tag?: string;
  category?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  const query = new URLSearchParams();
  if (params?.tag) query.append("tag", params.tag);
  if (params?.category) query.append("category", params.category);
  if (params?.limit) query.append("limit", String(params.limit));

  const url =
    `${API_BASE_URL}/api/blog/posts/` +
    (query.toString() ? "?" + query.toString() : "");

  return request<BlogPost[]>(url, cacheTime("blogPosts"));
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<BlogPostDetail> {
  const url = `${API_BASE_URL}/api/blog/posts/${slug}/`;
  return request<BlogPostDetail>(url, cacheTime("blogPostDetail"));
}

export async function fetchBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  return fetchBlogPosts({ tag });
}

export async function fetchBlogPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  return fetchBlogPosts({ category });
}

/* ------------------------------------------------------------------ */
/* Categories & collections                                           */
/* ------------------------------------------------------------------ */

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const url = `${API_BASE_URL}/api/blog/categories/`;
  return request<BlogCategory[]>(url, cacheTime("blogCategories"));
}

export async function fetchMasterBlogCategories(): Promise<BlogCategory[]> {
  const url = `${API_BASE_URL}/api/blog/categories/?master=true`;
  return request<BlogCategory[]>(url, cacheTime("masterCategories"));
}

export async function fetchBlogCollections(): Promise<BlogCollection[]> {
  const url = `${API_BASE_URL}/api/blog/collections/`;
  return request<BlogCollection[]>(url, cacheTime("blogCollections"));
}

/* ------------------------------------------------------------------ */
/* Popular & search                                                   */
/* ------------------------------------------------------------------ */

export async function fetchPopularBlogData(): Promise<PopularBlogData> {
  const url = `${API_BASE_URL}/api/blog/popular/`;
  return request<PopularBlogData>(url, cacheTime("popularBlogData"));
}

export async function searchBlogPosts(params: {
  query?: string;
  category?: string;
}): Promise<BlogPost[]> {
  const query = new URLSearchParams();
  if (params.query) query.append("q", params.query);
  if (params.category) query.append("category", params.category);

  const url =
    `${API_BASE_URL}/api/blog/search/` +
    (query.toString() ? "?" + query.toString() : "");

  return request<BlogPost[]>(url, cacheTime("blogSearch"));
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                         */
/* ------------------------------------------------------------------ */

export async function subscribeToNewsletter(
  email: string
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/api/blog/subscribe/`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("ثبت‌نام در خبرنامه با خطا مواجه شد.");
  }

  return res.json();
}
