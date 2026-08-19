import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IdentityHue } from "@/lib/users/accent";
import { cn } from "@/lib/utils";

export interface DetailField {
  label: string;
  value: string;
  /** Figures and identifiers are set in mono so they line up and read exactly. */
  mono?: boolean;
}

/**
 * A group of facts as a description list.
 *
 * `<dl>` rather than a grid of divs: these really are term/definition pairs,
 * and the markup is what tells a screen reader that "Email" labels the address
 * beside it.
 *
 * The wash is the *complement* of the person's identity hue — the same
 * `data-identity` the hero carries, read as a different local. A teal hero puts
 * a rose wash on the cards below it, so the record reads as the counterweight
 * to the portrait rather than a repeat of it, and the cards stop reading as raw
 * white. It lives here and not in components/ui/card.tsx precisely so it cannot
 * leak to any other Card in the app; docs/design-system.md owns the reasoning.
 *
 * The top rail carries the full-strength complement `--identity-comp`, matching
 * the directory cards' top rails while echoing the complement relationship.
 *
 * Light mode only for the wash. In dark mode --identity-comp-soft resolves to --card,
 * so the same gradient flattens to a plain card and this file needs no dark: branch.
 */
function DetailCard({
  hue,
  title,
  fields,
  className,
}: {
  hue: IdentityHue;
  title: string;
  fields: DetailField[];
  className?: string;
}) {
  const shown = fields.filter((field) => field.value);
  if (shown.length === 0) return null;

  return (
    <Card
      data-identity={hue}
      className={cn(
        "relative bg-linear-to-br from-(--identity-comp-soft) to-card to-60%",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-(--identity-comp)"
      />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-3">
          {shown.map((field) => (
            <div
              key={field.label}
              className="grid gap-0.5 sm:grid-cols-[10rem_1fr] sm:gap-4"
            >
              <dt className="text-sm text-muted-foreground">{field.label}</dt>
              <dd
                className={cn(
                  "text-sm break-words",
                  field.mono && "font-mono text-[0.8125rem] tabular"
                )}
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export { DetailCard };
