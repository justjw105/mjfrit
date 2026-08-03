"use client";

import Link from "next/link";
import Image from "next/image";
import { artPieces, type ArtPiece } from "@/lib/artdata";
import KenBurnsImage from "@/components/KenBurnsImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="relative h-[60vh] -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 flex items-center justify-center text-center rounded-b-lg overflow-hidden shadow-lg">
        <KenBurnsImage src="/MJFritBanner.jpg" imageHint="art gallery" alt="Abstract glass art background" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-primary/40" />
        <div className="relative z-10 p-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground drop-shadow-lg"
          >
            Fine Art Glass Landscapes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90 drop-shadow-md"
          >
            Moriah Jane uses frit (powder, fine, medium) glass on clear or white Tekta to create landscapes. She uses color to create whimsy and different techniques or stringers, rods, and vitrograph to create contrast and textures. Her favorite tools to use are powder sifting buckets, small angle brushes, toothpicks, and a hand dandy spoon.
          </motion.p>
        </div>
      </section>
      
      <section>
        <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            <AnimatePresence>
            {artPieces.map((piece) => (
              <Link href={`/artpiece/${piece.slug}`} key={piece.slug} className="flex">
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
      </section>
    </div>
  );
}

function ArtCard({ piece }: { piece: ArtPiece }) {
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
