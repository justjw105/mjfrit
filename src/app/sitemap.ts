import { type MetadataRoute } from 'next';
import { artPieces } from '@/lib/artdata';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://mjfrit.com';

  const artPieceUrls = artPieces.map((piece) => ({
    url: `${siteUrl}/artpiece/${piece.slug}`,
    lastModified: new Date(piece.updatedAt),
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
  ];

  return [...staticUrls, ...artPieceUrls];
}
