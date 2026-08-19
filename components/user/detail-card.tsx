import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
 */
function DetailCard({
  title,
  fields,
  className,
}: {
  title: string;
  fields: DetailField[];
  className?: string;
}) {
  const shown = fields.filter((field) => field.value);
  if (shown.length === 0) return null;

  return (
    <Card className={className}>
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
