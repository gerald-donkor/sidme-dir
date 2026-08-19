import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { identityHue } from "@/lib/users/accent";
import { initials } from "@/lib/users/format";
import type { UserSummary } from "@/lib/users/types";
import { cn } from "@/lib/utils";

/**
 * A person's avatar: their initials on their identity hue.
 *
 * The API does supply an `image`, and it was rendered here first. It is a
 * generated pixel-art identicon in fixed dark blue — invisible against the dark
 * theme, generic against the light one, and carrying no information about the
 * person that their initials do not carry better. Rendering it would be
 * faithful to the payload and worse for the reader, so it is deliberately not
 * used. docs/data-layer.md records the decision, and `image` is left on
 * UserSummary so a real photograph could be dropped in without a data change.
 *
 * `aria-hidden`: every use of this sits beside the person's name, and a second
 * announcement of their initials is noise.
 */
function UserAvatar({
  user,
  className,
}: {
  user: Pick<UserSummary, "id" | "firstName" | "lastName">;
  className?: string;
}) {
  return (
    <Avatar
      aria-hidden
      data-identity={identityHue(user.id)}
      className={cn(
        "ring-[3px] ring-(--identity)/15 after:border-(--identity)/30",
        className
      )}
    >
      <AvatarFallback className="bg-(--identity-soft) font-medium text-(--identity-ink)">
        {initials(user.firstName, user.lastName)}
      </AvatarFallback>
    </Avatar>
  );
}

export { UserAvatar };
