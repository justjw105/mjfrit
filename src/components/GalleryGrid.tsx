"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { subscribeToVisibleArtPieces, type ArtPieceDoc } from "@/lib/firestoreArt";

/**
 * Renders the animated gallery grid. Receives `initialPieces` already
 * fetched server-side (so the raw HTML — and search crawlers — see the
 * full grid immediately, no client-side loading flash), then subscribes
 * to Firestore for live updates after mount so admin edits still show up
 * without a page refresh.
 */
export default function GalleryGrid({ initialPieces }: { initialPieces: ArtPieceDoc[] }) {
  const [pieces, setPieces] = useState<ArtPieceDoc[]>(initialPieces);

  useEffect(() => {
    const unsubscribe = subscribeToVisibleArtPieces((data) => {
      setPieces(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence>
        {pieces.map((piece) => (
          <Link href={`/artpiece/${piece.slug}`} key={piece.docId} className="flex">
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              <ArtCard piece={piece} />
            </motion.div>
          </Link>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function ArtCard({ piece }: { piece: ArtPieceDoc }) {
  return (
    <Card className="overflow-hidden w-full flex flex-col group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
      <CardHeader className="p-0">
        <div className="aspect-[3/4] overflow-hidden relative">
          <Image
            src={piece.imageUrl}
            alt={piece.title}
            width={600}
            height={800}
            data-ai-hint={piece.imageHint}
            className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          {piece.sold && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground shadow-md">
              Sold
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col justify-between gap-3">
        <CardTitle className="text-2xl font-headline text-primary">{piece.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/40">
          {piece.framedSize && <span>Framed: {piece.framedSize}</span>}
          {piece.framedSize && piece.unframedSize && <span className="text-border">•</span>}
          {piece.unframedSize && <span>Unframed: {piece.unframedSize}</span>}
          {!piece.framedSize && !piece.unframedSize && piece.size && <span>{piece.size}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
