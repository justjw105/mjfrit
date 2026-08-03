export default function Footer() {
  return (
    <footer className="bg-card/80 border-t border-border mt-auto">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-foreground/60">
        <p>&copy; {new Date().getFullYear()} MJ Frit. All rights reserved.</p>
      </div>
    </footer>
  );
}
