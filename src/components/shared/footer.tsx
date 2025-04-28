export function Footer() {
  return (
    <footer className="bg-secondary py-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} EventFlow. All rights reserved.
      </div>
    </footer>
  );
}
