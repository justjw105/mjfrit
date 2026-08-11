import { type MetadataRoute } from 'next';
import { getVisibleArtPieceDocs } from '@/lib/firestoreArt';
import { getPublishedBlogPostDocs } from '@/lib/firestoreBlog';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://mjfrit.com';

  const [artPieces, blogPosts] = await Promise.all([
    getVisibleArtPieceDocs(),
    getPublishedBlogPostDocs(),
  ]);

  const artPieceUrls = artPieces.map((piece) => ({
    url: `${siteUrl}/artpiece/${piece.slug}`,
    lastModified: new Date(piece.updatedAt),
  }));

  const blogPostUrls = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
  }));

  const staticUrls = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
    },
  ];

  return [...staticUrls, ...artPieceUrls, ...blogPostUrls];
}
