import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: "About | Glass Art Gallery by MJ Frit",
  description: "Learn more about the artist MJ Frit and her passion for creating fine glass art landscapes.",
  alternates: {
    canonical: "https://mjfrit.com/about",
  },
  robots: "index, follow",
};

export default function AboutPage() {
  const techniques = [
    "Pâte De Verre",
    "Lost Wax casting",
    "Two part mould making",
    "Freeze and fuse",
    "Bead making",
    "Slumping",
    "Coldworking",
    "Enamel Jewelry",
    "Mosaic",
    "Glass Painting with Enamels",
    "Stained Glass"
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <Card className="shadow-lg overflow-hidden">
            <div className="relative aspect-[4/3]">
               <Image
                src="/PXL_20250807_010435779.PORTRAIT.jpg"
                alt="Artist MJ Frit"
                fill
                className="object-cover"
                data-ai-hint="artist portrait"
              />
            </div>
          </Card>
           <div className="grid grid-cols-2 gap-4">
             <Card className="shadow-lg overflow-hidden">
                <div className="relative aspect-[3/4]">
                    <Image
                        src="/PXL_20250420_190622861.jpg"
                        alt="Glass art piece in progress"
                        fill
                        className="object-cover"
                        data-ai-hint="art progress"
                    />
                </div>
              </Card>
              <Card className="shadow-lg overflow-hidden">
                <div className="relative aspect-[3/4]">
                    <Image
                        src="/PXL_20250709_150744805.jpg"
                        alt="Finished glass art landscape"
                        fill
                        className="object-cover"
                        data-ai-hint="art landscape"
                    />
                </div>
              </Card>
              <Card className="shadow-lg overflow-hidden">
                <div className="relative aspect-[3/4]">
                    <Image
                        src="/moriah_about.jpg"
                        alt="Finished glass art landscape"
                        fill
                        className="object-cover"
                        data-ai-hint="art landscape"
                    />
                </div>
              </Card>
           </div>
        </div>
        <div className="space-y-8 pt-4">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold font-headline text-primary">About the Artist: Moriah Jane</h1>
            <p className="text-lg text-foreground/80">
            I’m Moriah Jane Guy-Wilkins and for my art I sign the name Moriah Jane. I’ve been creating glass art since 2020. In 2022 I had my son and to understand my art and ways, I feel you need to know a bit about my personal life. My son was born very prematurely due to some previously unknown health issues of my own and spent 94 days in the NICU and over 200 days in the hospital for the first year of life. He had a severe brain bleed during his NICU stay and will need life long care for all needs but is the absolute light of our lives and very loved.
            </p>
            <p className="text-lg text-foreground/80">
            In 2024 I ended up leaving work for many reasons including managing my son’s care needs and constant appointments. With the high stress point in life, glass is a way to channel my energy, provides me joy and a large measure of peace. In finding my way to glass art I took two back to back classes with Nadine Booth and fell in love with creating landscapes using fusible glass of all shapes and sizes, but mainly using glass frit. I use many of the techniques taught to me by Nadine Booth as well as techniques I’ve learned from other classes or have learned on my own through trial and error. You can often find me in the local glass studio, The Vinery Stained Glass Studio in Whitewater WI, where Josh and Shaina create a wonderful, welcoming environment for glass artists and glass lovers of all stages.
            </p>
             <p className="text-lg text-foreground/80">
             Each piece is fired in the Kiln three to four times, minimum. Focal points (trees, rocks, figures) are often made and fired on separate shelves and put into the landscape scene after their initial firing. On average I have two to three pieces I’m working on at a time (in various stages of the artistic process) and I can normally complete a piece in a month, sometimes two.
            </p>
            
            <div className="pt-6 space-y-4">
              <h2 className="text-2xl font-bold font-headline text-primary">I have trained in many techniques at this stage including:</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-lg text-foreground/80 list-disc pl-5">
                {techniques.map((tech) => (
                  <li key={tech} className="font-body">{tech}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
