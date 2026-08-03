"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  //{ href: "/payment", label: "Make a payment" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-border">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline text-primary">
          <Image src="/MJFritLogo1.png" alt="MJ Frit Logo" width={64} height={64} data-ai-hint="logo" />
          
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground/70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline text-primary">
                  <Image src="https://placehold.co/40x40.png" alt="MJ Frit Logo" width={28} height={28} data-ai-hint="logo" />
                  MJ Frit
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-foreground/70"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
