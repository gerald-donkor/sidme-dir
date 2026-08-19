import Link from "next/link";

import { UserAvatar } from "@/components/user/user-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { identityHue } from "@/lib/users/accent";
import { roleLabel, shortLocation } from "@/lib/users/format";
import type { UserSummary } from "@/lib/users/types";

/**
 * The list at md and up. Same array as UserGrid, rendered denser.
 *
 * Only the name is a link. A row-wide click target would either nest
 * interactive elements or need a JS row handler that keyboard users cannot
 * reach, and neither is worth it here.
 */
function UserTable({
  users,
  hrefFor,
}: {
  users: UserSummary[];
  hrefFor: (user: UserSummary) => string;
}) {
  return (
    <div className="hidden overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-px" />
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden lg:table-cell">Company</TableHead>
            <TableHead className="hidden xl:table-cell">Department</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              data-identity={identityHue(user.id)}
              className="group"
            >
              <TableCell className="p-0">
                <span
                  aria-hidden
                  className="block h-10 w-1 rounded-r-full bg-(--identity)"
                />
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} />
                  <div className="flex min-w-0 flex-col">
                    <Link
                      href={hrefFor(user)}
                      className="truncate rounded-sm font-medium outline-none hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {user.fullName}
                    </Link>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="truncate">{user.company.title}</span>
                  {user.role !== "user" ? (
                    <Badge variant="outline" className="w-fit">
                      {roleLabel(user.role)}
                    </Badge>
                  ) : null}
                </div>
              </TableCell>

              <TableCell className="hidden max-w-[18ch] truncate text-muted-foreground lg:table-cell">
                {user.company.name}
              </TableCell>

              <TableCell className="hidden xl:table-cell">
                <Badge variant="secondary">{user.company.department}</Badge>
              </TableCell>

              <TableCell className="text-muted-foreground">
                {shortLocation(user.address)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { UserTable };
