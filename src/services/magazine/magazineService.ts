// /src/services/magazine/magazineService.ts
import { API_BASE_URL } from "../../app/[locale]/api/config";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;           // ← NEW
  content: string;
  media: string;
  file: string | null;
  tags: string[];
  featured_level: 0 | 1 | 2 | 3; // ← NEW
  comments_count: number;        // ← NEW
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PopularBlogData {
  tags: string[];
  categories: BlogCategory[];
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
  direction?: 'ltr' | 'rtl';
  banner_media?: string;
  posts_count?: number;
  categories?: BlogCategory[];
  posts: BlogPost[];
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
    /* for easier debugging you could log res.status/res.text() here */
    throw new Error(`شبکه یا سرور در دسترس نیست → ${url}`);
  }
  return res.json();
}

/* ------------------------------------------------------------------ */
/* Blog posts                                                         */
/* ------------------------------------------------------------------ */

/** گرفتن همهٔ پست‌ها – می‌توان فیلتر تگ یا کتگوری نیز ارسال کرد */
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

  return request<BlogPost[]>(url, 0);
}

/** گرفتن پستِ تکی بر اساس slug */
export async function fetchBlogPostBySlug(
  slug: string
): Promise<BlogPostDetail> {
  const url = `${API_BASE_URL}/api/blog/posts/${slug}/`;
  return request<BlogPostDetail>(url, 60);
}

/** شورت‌کات برای گرفتن پست‌ها بر اساس تگ */
export async function fetchBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  return fetchBlogPosts({ tag });
}

/* ------------------------------------------------------------------ */
/* دسته‌بندی‌ها و کالکشن‌ها                                           */
/* ------------------------------------------------------------------ */

/** همهٔ دسته‌بندی‌ها */
export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const url = `${API_BASE_URL}/api/blog/categories/`;
  return request<BlogCategory[]>(url, 0); // یک ساعت
}

/** همهٔ کالکشن‌ها */
export async function fetchBlogCollections(): Promise<BlogCollection[]> {
  const url = `${API_BASE_URL}/api/blog/collections/`;
  return request<BlogCollection[]>(url, 300); // کش ۵ دقیقه‌ای
}

/** گرفتن فقط دسته‌بندی‌هایی که is_master=true دارند */
export async function fetchMasterBlogCategories(): Promise<BlogCategory[]> {
  const url = `${API_BASE_URL}/api/blog/categories/?master=true/`;
  return request<BlogCategory[]>(url, 3600); // کش یک‌ساعته
}

/** ثبت‌نام در خبرنامه */
export async function subscribeToNewsletter(email: string): Promise<{ message: string }> {
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

/** گرفتن تگ‌ها و دسته‌بندی‌های پرطرفدار */
export async function fetchPopularBlogData(): Promise<PopularBlogData> {
  const url = `${API_BASE_URL}/api/blog/popular/`;
  return request<PopularBlogData>(url, 300); // کش 5 دقیقه‌ای
}


/** شورت‌کات برای گرفتن پست‌ها بر اساس دسته‌بندی */
export async function fetchBlogPostsByCategory(category: string) {
  return fetchBlogPosts({ category });
}

/* ------------------------------------------------------------------ */
/* Blog search (title & category)                                     */
/* ------------------------------------------------------------------ */

/** جستجوی پست‌ها بر اساس عنوان و/یا دسته‌بندی */
export async function searchBlogPosts(params: {
  query?: string;
  category?: string;
}): Promise<BlogPost[]> {
  const query = new URLSearchParams();
  if (params.query) query.append('q', params.query);
  if (params.category) query.append('category', params.category);

  const url =
    `${API_BASE_URL}/api/blog/search/` +
    (query.toString() ? '?' + query.toString() : '');

  return request<BlogPost[]>(url, 30); // کش ۳۰ ثانیه‌ای
}


