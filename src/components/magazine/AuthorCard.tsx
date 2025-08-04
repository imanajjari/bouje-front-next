// components/magazine/AuthorCard.tsx
import Image from 'next/image';

interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface AuthorCardProps {
  author: Author;
  locale: string;
}

export default function AuthorCard({ author, locale }: AuthorCardProps) {
  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{author.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{author.bio}</p>
          <div className="flex gap-3">
            {author.social.twitter && (
              <a
                href={`https://twitter.com/${author.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
            {author.social.instagram && (
              <a
                href={`https://instagram.com/${author.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.321-1.283C4.198 14.553 3.642 13.28 3.642 11.987c0-1.297.49-2.448 1.284-3.321C5.809 7.793 7.082 7.237 8.375 7.237c1.297 0 2.448.49 3.321 1.283.873.863 1.429 2.136 1.429 3.429 0 1.297-.49 2.448-1.284 3.321-.863.873-2.136 1.429-3.429 1.429zm7.154-1.569c-.309.309-.68.463-1.113.463-.433 0-.804-.154-1.113-.463-.309-.309-.463-.68-.463-1.113 0-.433.154-.804.463-1.113.309-.309.68-.463 1.113-.463.433 0 .804.154 1.113.463.309.309.463.68.463 1.113 0 .433-.154.804-.463 1.113z"/>
                </svg>
              </a>
            )}
            {author.social.linkedin && (
              <a
                href={`https://linkedin.com/in/${author.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}