
  
export function mapPostsToGalleryItems(posts) {

    return posts.map((post) => ({
      mediaType: post.file ? 'video' : 'image',
      mediaSrc:  post.media,
      title: post.title,
      summary: post.summary, // خلاصه محتوا
      ctaText: 'مطالعه بیشتر',
      ctaHref: `/magazine/${post.slug}`,
    }));
  }