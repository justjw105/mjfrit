import Image from 'next/image';
import { notFound } from 'next/navigation';
import { artPieces } from '@/lib/artdata';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pieceId = slug;
  const piece = artPieces.find((p) => p.slug === pieceId);

  if (!piece) {
    notFound();
  }

  return {
    title: `${piece.title} | Glass Art Gallery`,
    description: piece.description,
    openGraph: {
        images: [piece.imageUrl],
    },
  };
}

export default async function ArtPiecePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pieceId = slug;
  const piece = artPieces.find((p) => p.slug === pieceId);

  if (!piece) {
    return (
      <div>{slug} not found</div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
        <div className="mb-8">
            <Button asChild variant="ghost">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Gallery
                </Link>
            </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                <Image
                src={piece.imageUrl}
                alt={piece.title}
                fill
                className="object-cover"
                data-ai-hint={piece.imageHint}
                />
            </div>
            <div className="space-y-6 pt-4">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold font-headline text-primary">{piece.title}</h1>
                    <p className="text-2xl text-accent font-semibold">${piece.price}</p>
                </div>
                <div className="space-y-4 text-lg text-foreground/80">
                    <p>{piece.description}</p>
                    <p className="text-base italic">{piece.technicalDetails}</p>
                    <div className="pt-3 border-t border-border/80">
                        <p className="font-semibold text-foreground mb-3">Dimensions & Framing</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {piece.framedSize && (
                                <div className="bg-secondary/60 rounded-md p-3 border border-border/60">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Framed Size</p>
                                    <p className="text-base font-medium text-foreground mt-0.5">{piece.framedSize}</p>
                                </div>
                            )}
                            {piece.unframedSize && (
                                <div className="bg-secondary/60 rounded-md p-3 border border-border/60">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unframed Size</p>
                                    <p className="text-base font-medium text-foreground mt-0.5">{piece.unframedSize}</p>
                                </div>
                            )}
                            {!piece.framedSize && !piece.unframedSize && piece.size && (
                                <div className="bg-secondary/60 rounded-md p-3 border border-border/60 col-span-full">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Size</p>
                                    <p className="text-base font-medium text-foreground mt-0.5">{piece.size}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Button size="lg" className="w-full md:w-auto">
                    <Link href="/contact">
                        Inquire About This Piece
                    </Link>
                </Button>
            </div>
        </div>
    </div>
  );
}
