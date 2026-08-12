"use client";

import { motion } from "framer-motion";

/**
 * Client component isolated to just the hero fade-in animation. Framer
 * Motion elements still render their real content server-side (SSR) —
 * only the mount-in opacity/transform transition runs client-side — so
 * isolating this doesn't cost anything for SEO/crawlability.
 */
export default function HeroText() {
  return (
    <>
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
        className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90 drop-shadow-md mx-auto"
      >
        Moriah Jane uses frit (powder, fine, medium) glass on clear or white Tekta to create landscapes. She uses color to create whimsy and different techniques or stringers, rods, and vitrograph to create contrast and textures. Her favorite tools to use are powder sifting buckets, small angle brushes, toothpicks, and a hand dandy spoon.
      </motion.p>
    </>
  );
}
