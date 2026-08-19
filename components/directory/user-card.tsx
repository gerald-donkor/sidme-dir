import Link from "next/link";
import { BuildingIcon, MailIcon, MapPinIcon } from "lucide-react";

import { UserAvatar } from "@/components/user/user-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { identityHue } from "@/lib/users/accent";
import { roleLabel, shortLocation } from "@/lib/users/format";
import type { UserSummary } from "@/lib/users/types";

function CardRow({
  icon: Icon,
  children,
}: {
  icon: typeof MailIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span className="truncate">{children}</span>
    </div>
  );
}

function UserCard({ user, href }: { user: UserSummary; href: string }) {
  return (
    <Link
      href={href}
      data-identity={identityHue(user.id)}
      className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="relative h-full transition-shadow group-hover:ring-foreground/20">
        {/* The identity rail. The one place colour is allowed to be loud. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 bg-(--identity)"
        />

        <CardHeader className="flex flex-row items-center gap-3">
          <UserAvatar user={user} className="size-11" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <CardTitle className="truncate group-hover:underline group-hover:underline-offset-4">
              {user.fullName}
            </CardTitle>
            <CardDescription className="truncate">
              {user.company.title}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <CardRow icon={BuildingIcon}>{user.company.name}</CardRow>
          <CardRow icon={MapPinIcon}>{shortLocation(user.address)}</CardRow>
          <CardRow icon={MailIcon}>{user.email}</CardRow>
        </CardContent>

        <CardFooter className="gap-2">
          <Badge variant="secondary">{user.company.department}</Badge>
          {user.role !== "user" ? (
            <Badge variant="outline">{roleLabel(user.role)}</Badge>
          ) : null}
        </CardFooter>
      </Card>
    </Link>
  );
}

export { UserCard };
