import { cn } from "@/lib/utils";

function PageHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-4 pt-8 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pt-12",
        className
      )}
      {...props}
    />
  );
}

function PageHeaderText({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

function PageTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
        className
      )}
      {...props}
    />
  );
}

function PageDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "max-w-[60ch] text-sm/relaxed text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export { PageHeader, PageHeaderText, PageTitle, PageDescription };
