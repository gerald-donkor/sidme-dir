import type { Metadata } from "next";

import { Container } from "@/components/chrome/container";
import {
  PageDescription,
  PageHeader,
  PageHeaderText,
  PageTitle,
} from "@/components/chrome/page-header";
import { DirectorySkeleton } from "@/components/directory/directory-skeleton";
import { EmptyResults } from "@/components/directory/empty-results";
import { UserCard } from "@/components/directory/user-card";
import { UserTable } from "@/components/directory/user-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DetailCard } from "@/components/user/detail-card";
import { IDENTITY_HUE_COUNT, identityHue } from "@/lib/users/accent";
import type { User, UserSummary } from "@/lib/users/types";

export const metadata: Metadata = {
  title: "Design system",
  description:
    "The tokens, type scale and component states the directory is built from.",
};

/**
 * The reference, and the drift-catcher.
 *
 * It renders the real components in their real states — including the ones
 * that are hard to reach in the app, like the skeleton and the empty result —
 * so a token change can be judged without hunting for a page that shows it.
 *
 * The people below are fixtures, shaped like the API's records. Nothing here
 * fetches; this page must stay viewable when the service is down.
 */
const FIXTURES: User[] = [
  {
    id: 1,
    firstName: "Amara",
    lastName: "Osei",
    fullName: "Amara Osei",
    username: "amarao",
    email: "amara.osei@example.com",
    phone: "+233 24 555 0182",
    image: "",
    role: "admin",
    company: {
      name: "Larkspur Instruments",
      title: "Head of Platform",
      department: "Engineering",
    },
    address: {
      street: "12 Ring Road East",
      city: "Accra",
      state: "Greater Accra",
      stateCode: "GA",
      postalCode: "GA-184",
      country: "Ghana",
    },
    age: 34,
    gender: "female",
    birthDate: "1991-4-12",
    university: "Kwame Nkrumah University of Science and Technology",
    bloodGroup: "A+",
    eyeColor: "Brown",
    hair: { color: "Black", type: "Coily" },
    heightCm: 168,
    weightKg: 61,
    companyAddress: {
      street: "4 Independence Avenue",
      city: "Accra",
      state: "Greater Accra",
      stateCode: "GA",
      postalCode: "GA-107",
      country: "Ghana",
    },
  },
  {
    id: 3,
    firstName: "Tobias",
    lastName: "Ferreira",
    fullName: "Tobias Ferreira",
    username: "tobiasf",
    email: "tobias.ferreira@example.com",
    phone: "+351 21 555 0117",
    image: "",
    role: "moderator",
    company: {
      name: "Meridian Freight",
      title: "Operations Lead",
      department: "Services",
    },
    address: {
      street: "48 Rua da Prata",
      city: "Lisbon",
      state: "Lisboa",
      stateCode: "LI",
      postalCode: "1100-052",
      country: "Portugal",
    },
    age: 41,
    gender: "male",
    birthDate: "1984-11-3",
    university: "Universidade de Lisboa",
    bloodGroup: "O-",
    eyeColor: "Hazel",
    hair: { color: "Brown", type: "Wavy" },
    heightCm: 181,
    weightKg: 78,
    companyAddress: {
      street: "9 Avenida da Liberdade",
      city: "Lisbon",
      state: "Lisboa",
      stateCode: "LI",
      postalCode: "1250-144",
      country: "Portugal",
    },
  },
];

const SUMMARIES: UserSummary[] = FIXTURES;

const TYPE_SCALE = [
  { name: "Page title", className: "font-display text-4xl font-semibold tracking-tight" },
  { name: "Section title", className: "font-display text-2xl font-semibold tracking-tight" },
  { name: "Card title", className: "font-heading text-base font-medium" },
  { name: "Body", className: "text-sm" },
  { name: "Muted body", className: "text-sm text-muted-foreground" },
  { name: "Figure", className: "font-mono text-[0.8125rem] tabular" },
];

const SEMANTIC_TOKENS = [
  { name: "background", className: "bg-background" },
  { name: "card", className: "bg-card" },
  { name: "muted", className: "bg-muted" },
  { name: "secondary", className: "bg-secondary" },
  { name: "accent", className: "bg-accent" },
  { name: "primary", className: "bg-primary" },
  { name: "destructive", className: "bg-destructive" },
  { name: "border", className: "bg-border" },
];

const RADII = [
  { name: "sm", className: "rounded-sm" },
  { name: "md", className: "rounded-md" },
  { name: "lg", className: "rounded-lg" },
  { name: "xl", className: "rounded-xl" },
  { name: "2xl", className: "rounded-2xl" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="max-w-[70ch] text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Separator />
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const hues = Array.from({ length: IDENTITY_HUE_COUNT }, (_, i) => i + 1);

  return (
    <main id="content" className="flex-1 pb-24">
      <Container>
        <PageHeader>
          <PageHeaderText>
            <PageTitle>Design system</PageTitle>
            <PageDescription>
              Quiet chrome, colourful data. Every token below is defined once
              in app/globals.css; nothing on this page hardcodes a colour.
              Switch the theme in the header to check both.
            </PageDescription>
          </PageHeaderText>
        </PageHeader>

        <div className="flex flex-col gap-14">
          <Section
            title="Semantic colour"
            description="The chrome. These are the only colours interactive elements are allowed to use, and components reference them by role rather than by value."
          >
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SEMANTIC_TOKENS.map((token) => (
                <li key={token.name} className="flex flex-col gap-2">
                  <div
                    className={`h-16 rounded-lg ring-1 ring-foreground/10 ${token.className}`}
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {token.name}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Identity palette"
            description="Six hues at a fixed lightness and chroma, so every person's colour carries the same contrast. A hue is derived from a user's id, not chosen, and it appears on identity surfaces: the card rail, the avatar, the profile hero wash, and the detail cards' top rail and soft ambient wash. Detail cards use the 180° rotated complement hue in light mode and match the hero's identity hue in dark mode. This is a deliberate exception to the one-accent rule, and docs/design-system.md holds the reasoning."
          >
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {hues.map((hue) => (
                <li
                  key={hue}
                  data-identity={hue}
                  className="flex flex-col gap-2"
                >
                  {/*
                    Split so the full identity hue and its soft tint sit together:
                    the left half is what accents the rail and hero, the right half
                    is what softly washes their record.
                  */}
                  <div className="grid h-16 grid-cols-2 overflow-hidden rounded-lg">
                    <div className="bg-(--identity)" />
                    <div className="bg-(--identity-soft)" />
                  </div>
                  <div className="flex h-10 items-center justify-center rounded-lg bg-(--identity-soft) text-sm font-medium text-(--identity-ink)">
                    Aa
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    identity-{hue}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Type"
            description="Outfit sets headings and page titles, Geist sets everything else, and Geist Mono carries figures so numbers line up down a column."
          >
            <dl className="flex flex-col gap-4">
              {TYPE_SCALE.map((entry) => (
                <div
                  key={entry.name}
                  className="grid gap-1 sm:grid-cols-[12rem_1fr] sm:items-baseline sm:gap-4"
                >
                  <dt className="font-mono text-xs text-muted-foreground">
                    {entry.name}
                  </dt>
                  <dd className={entry.className}>
                    The quick brown fox, 0123456789
                  </dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section
            title="Radius"
            description="One scale, derived from a single --radius. Soft throughout; nothing in the app is square and nothing is a pill except a badge."
          >
            <ul className="flex flex-wrap gap-4">
              {RADII.map((radius) => (
                <li key={radius.name} className="flex flex-col items-center gap-2">
                  <div
                    className={`size-16 bg-muted ring-1 ring-foreground/10 ${radius.className}`}
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {radius.name}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Controls"
            description="Registry primitives at the variants this app actually uses. Anything not shown here is not in use."
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button>Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Engineering</Badge>
                <Badge variant="outline">Admin</Badge>
              </div>
            </div>
          </Section>

          <Section
            title="A person, two ways"
            description="One record, two presentations. The card is the list below md; the table is the list above it. They are never both rendered to the reader, and never fetched twice."
          >
            <div className="flex flex-col gap-6">
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {SUMMARIES.map((user) => (
                  <li key={user.id}>
                    <UserCard user={user} href="#" />
                  </li>
                ))}
              </ul>
              <div className="[&>div]:block">
                <UserTable users={SUMMARIES} hrefFor={() => "#"} />
              </div>
              {/*
                Two people, two hues, so the wash is visibly theirs and not a
                single tint applied to every card.
              */}
              <div className="grid gap-4 sm:grid-cols-2">
                {FIXTURES.map((user) => (
                  <DetailCard
                    key={user.id}
                    hue={identityHue(user.id)}
                    title="Contact"
                    fields={[
                      { label: "Email", value: user.email },
                      { label: "Phone", value: user.phone, mono: true },
                      { label: "Username", value: user.username, mono: true },
                    ]}
                  />
                ))}
              </div>
            </div>
          </Section>

          <Section
            title="States"
            description="Every data surface ships four. These are the real components, not mock-ups of them, which is what makes this page catch drift."
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-xs text-muted-foreground">
                  loading
                </h3>
                <DirectorySkeleton rows={2} />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-xs text-muted-foreground">
                  empty
                </h3>
                <EmptyResults query="qqzzy" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-xs text-muted-foreground">
                  error
                </h3>
                {/*
                  Rendered statically rather than through DirectoryError, which
                  is a client component with a live retry, and this page must not
                  ship an interactive control that does nothing.
                */}
                <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
                  See app/error.tsx and app/users/[id]/error.tsx. Both render
                  the shared DirectoryError with the Next 16.3 retry prop, so
                  the button re-runs the failed render instead of only clearing
                  the error.
                </div>
              </div>
            </div>
          </Section>
        </div>
      </Container>
    </main>
  );
}
