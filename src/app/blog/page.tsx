import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublishedBlogPostDocs } from "@/lib/firestoreBlog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog | Glass Art Techniques & Stories by MJ Frit",
  description:
    "Behind-the-scenes stories and glass art techniques from Moriah Jane of MJ Frit — fused glass landscapes, tools, and process.",
  alternates: {
    canonical: "https://mjfrit.com/blog",
  },
  robots: "index, follow",
};

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const posts = await getPublishedBlogPostDocs();

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
  const filteredPosts = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">The Studio Journal</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Techniques, process notes, and stories from behind the kiln.
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/blog">
            <Badge variant={!tag ? "default" : "outline"} className="cursor-pointer">
              All
            </Badge>
          </Link>
          {allTags.map((t) => (
            <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`}>
              <Badge variant={tag === t ? "default" : "outline"} className="cursor-pointer">
                {t}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          {tag ? `No posts tagged "${tag}" yet.` : "No posts published yet — check back soon."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.docId}>
              <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                {post.coverImageUrl && (
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <Image
                      src={post.coverImageUrl}
                      alt={post.coverImageHint || post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-headline text-primary">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between gap-4">
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/40">
                    <span>{post.publishedAt}</span>
                    <div className="flex gap-1">
                      {post.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
