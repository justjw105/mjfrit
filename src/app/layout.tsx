import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Analytics } from '@/components/Analytics';

export const metadata = {
  title: "Glass Art Gallery | Handcrafted Fine Glass Artwork by MJ Frit",
  description:
    "Glass Art Gallery featuring handcrafted fine glass artwork, blending light, color, and artistic expression into timeless glass art pieces.",
  alternates: {
    canonical: "https://mjfrit.com/",
  },
  robots: "index, follow",
  openGraph: {
    title: "Glass Art Gallery | MJ Frit",
    description:
      "Handcrafted fine glass artwork—elegant pieces shaped by light and color.",
    url: "https://mjfrit.com/",
    siteName: "MJ Frit",
    images: [
      { url: "/MJFritBanner.jpg", width: 1200, height: 630, alt: "MJ Frit Glass Art" }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glass Art Gallery | MJ Frit",
    description:
      "Handcrafted fine glass artwork—elegant pieces shaped by light and color.",
    images: ["/MJFritBanner.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: "#ffffff",
  // optional
  // keywords: ["Glass Art Gallery","Handcrafted Glass Art","Fine Glass Artwork","Art Glass"],
  // creator: "MJ Frit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="6tUaz-wb36sOd0C9HvodH30AG0KsfLsmvpcrraqfFTk" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/MJFritLogo.jpg" />
        
      </head>
      <body className="font-body antialiased bg-background text-foreground flex flex-col min-h-screen">
        <Analytics />
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
