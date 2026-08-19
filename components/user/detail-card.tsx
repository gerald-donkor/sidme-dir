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
 * The wash carries the person's identity hue, the same one on their avatar and
 * in the hero, so the four cards read as one record rather than four white
 * boxes. It lives here and not in components/ui/card.tsx precisely so it cannot
 * leak to any other Card in the app; docs/design-system.md owns the reasoning.
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
        "bg-linear-to-br from-(--identity-soft) to-card to-60%",
        className
      )}
    >
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
