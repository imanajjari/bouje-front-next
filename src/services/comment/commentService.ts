// /src/services/comment/commentService.ts
import { API_BASE_URL } from '../../app/[locale]/api/config';

/* ------------------------------------------------------------------ */
/* Type definitions                                                   */
/* ------------------------------------------------------------------ */

export type Comment = {
  id: number;
  name: string;
  text: string;
  created_at: string;
  updated_at: string;
  // اگر فیلدهای دیگری دارید، اینجا اضافه کنید
};

export type CreateCommentPayload = {
  name: string;
  text: string;
};

/* ------------------------------------------------------------------ */
/* API helpers                                                        */
/* ------------------------------------------------------------------ */

/**
 * گرفتن لیست کامنت‌های یک پستِ بلاگ
 * @param blogPostId  شناسهٔ پست
 * @param revalidateSeconds  (اختیاری) زمان اعتبار مجدد در ISR
 */
export async function fetchCommentsForBlogPost(
  blogPostId: number,
  revalidateSeconds = 30
): Promise<Comment[]> {
  const res = await fetch(
    `${API_BASE_URL}/comments/blogpost/${blogPostId}/`,
    {
      // در صورت نیاز به ISR
      next: { revalidate: revalidateSeconds },
      // کامنت‌ها سریع تغییر می‌کنند؛ اگر SSR کامل می‌خواهید:
      // cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`خطا در دریافت کامنت‌های پست ${blogPostId}`);
  }

  return res.json();
}

/**
 * ایجاد یک کامنت جدید برای پست بلاگ
 * @param blogPostId  شناسهٔ پست
 * @param data        دادهٔ کامنت (name و text)
 */
export async function createCommentForBlogPost(
  blogPostId: number,
  data: CreateCommentPayload
): Promise<Comment> {
  const res = await fetch(
    `${API_BASE_URL}/comments/blogpost/${blogPostId}/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store', // POST همیشه بدون کش
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(
      `خطا در ارسال کامنت برای پست ${blogPostId}: ${detail || res.status}`
    );
  }

  return res.json();
}
