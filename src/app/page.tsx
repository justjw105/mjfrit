import KenBurnsImage from "@/components/KenBurnsImage";
import HeroText from "@/components/HeroText";
import GalleryGrid from "@/components/GalleryGrid";
import { getVisibleArtPieceDocs } from "@/lib/firestoreArt";

// Re-fetch from Firestore at most every 5 minutes, matching the other
// content pages, so admin edits show up quickly without hitting Firestore
// on every single request.
export const revalidate = 300;

export default async function HomePage() {
  const pieces = await getVisibleArtPieceDocs();

  return (
    <div className="flex flex-col gap-16">
      <section className="relative h-[60vh] -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 flex items-center justify-center text-center rounded-b-lg overflow-hidden shadow-lg">
        <KenBurnsImage src="/MJFritBanner.jpg" imageHint="art gallery" alt="Abstract glass art background" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-primary/40" />
        <div className="relative z-10 p-4">
          <HeroText />
        </div>
      </section>

      <section>
        <GalleryGrid initialPieces={pieces} />
      </section>
    </div>
  );
}
