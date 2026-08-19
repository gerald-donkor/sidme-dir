import Link from "next/link";
import { ContactRoundIcon } from "lucide-react";

import { Container } from "@/components/chrome/container";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { Button } from "@/components/ui/button";

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md font-display text-sm font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ContactRoundIcon className="size-3.5" />
          </span>
          Sidme Directory
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/design-system" />}
          >
            Design system
          </Button>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}

export { SiteHeader };
