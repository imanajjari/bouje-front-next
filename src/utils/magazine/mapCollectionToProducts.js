// utils/magazine/mapCollectionToProducts.js

export function mapCollectionToProducts(collection, locale) {
    return collection.posts.map((post) => ({
      title: post.title,
      image: post.media,
      price: '', // اگر قیمت نداری، خالی بگذار یا پنهان کن
      url:`/${locale}/magazine/${post.slug}`
    }));
  }
  