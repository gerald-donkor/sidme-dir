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
 * The wash and top rail use the person's identity complement hue in light mode,
 * resolving to the primary identity hue in dark mode via CSS token redeclaration.
 * This keeps card styling self-contained and off components/ui/card.tsx;
 * docs/design-system.md owns the reasoning.
 *
 * In light mode, `--identity-comp` accents the top rail and `--identity-comp-soft`
 * provides an ambient wash. In dark mode, these map to `--identity` and `--identity-soft`
 * so the detail cards match the hero banner without requiring any dark: utility classes.
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
