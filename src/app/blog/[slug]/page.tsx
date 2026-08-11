import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/firestoreBlog";
import { renderMarkdown } from "@/lib/markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export const dynamicParams = true;
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return {
    title: `${post.title} | MJ Frit Studio Journal`,
    description: post.excerpt,
    alternates: {
      canonical: `https://mjfrit.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl || undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "MJ Frit",
    },
    mainEntityOfPage: `https://mjfrit.com/blog/${post.slug}`,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-8">
        <Button asChild variant="ghost">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Link>
        </Button>
      </div>

      {post.coverImageUrl && (
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-8">
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageHint || post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <span>&middot;</span>
          <span>{post.publishedAt}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((t) => (
              <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`}>
                <Badge variant="secondary">{t}</Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      <article>{renderMarkdown(post.content)}</article>
    </div>
  );
}
