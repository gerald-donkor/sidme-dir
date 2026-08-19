import Link from "next/link";

import { Container } from "@/components/chrome/container";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { Button } from "@/components/ui/button";

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/65 backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_0_oklch(1_0_0_/_0.15)]">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-md font-display text-sm font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Sidme
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Home
          </Button>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}

export { SiteHeader };
