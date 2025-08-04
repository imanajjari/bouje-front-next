
  
export function mapPostsToGalleryItems(posts) {
    return posts.map((post) => ({
      mediaType: post.file ? 'video' : 'image',
      mediaSrc: post.file ?? post.media,
      title: post.title,
      description: post.content.slice(0, 100), // خلاصه محتوا
      ctaText: 'مطالعه بیشتر',
      ctaHref: `/magazine/${post.slug}`,
    }));
  }