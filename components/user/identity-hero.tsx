import { UserAvatar } from "@/components/user/user-avatar";
import { Badge } from "@/components/ui/badge";
import { identityHue } from "@/lib/users/accent";
import { roleLabel, shortLocation } from "@/lib/users/format";
import type { User } from "@/lib/users/types";

/**
 * The profile header.
 *
 * The wash is the person's identity hue, the same one that marked their card in
 * the list — the point is that arriving here feels like the same person, not a
 * new page.
 */
function IdentityHero({ user }: { user: User }) {
  return (
    <section
      data-identity={identityHue(user.id)}
      className="relative overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-(--identity-soft) to-transparent"
      />
      <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
        <UserAvatar user={user} className="size-20 sm:size-24" />
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {user.fullName}
            </h1>
            {user.role !== "user" ? (
              <Badge variant="outline">{roleLabel(user.role)}</Badge>
            ) : null}
          </div>
          <p className="text-muted-foreground">
            {user.company.title} at {user.company.name}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{user.company.department}</Badge>
            <span className="text-sm text-muted-foreground">
              {shortLocation(user.address)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export { IdentityHero };
