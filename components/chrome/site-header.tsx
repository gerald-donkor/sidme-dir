import Link from "next/link";
import { HouseIcon } from "lucide-react";

import { Container } from "@/components/chrome/container";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { Button } from "@/components/ui/button";

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/40 backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_0_oklch(1_0_0_/_0.15)]">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-md font-display text-sm font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Sidme
        </Link>
        <div className="flex items-center gap-1">
          {/*
            On mobile (<sm) the icon carries the button to avoid crowding;
            on larger screens (>=sm) the icon is hidden and the text label is shown.
          */}
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            aria-label="Home"
            className="sm:px-2.5"
            render={<Link href="/" />}
          >
            <HouseIcon data-icon="inline-start" className="sm:hidden" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}

export { SiteHeader };
