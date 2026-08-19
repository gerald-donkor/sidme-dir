import { UserCard } from "@/components/directory/user-card";
import type { UserSummary } from "@/lib/users/types";

/** The list at small widths. Same data as UserTable, different presentation. */
function UserGrid({
  users,
  hrefFor,
}: {
  users: UserSummary[];
  hrefFor: (user: UserSummary) => string;
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
      {users.map((user) => (
        <li key={user.id}>
          <UserCard user={user} href={hrefFor(user)} />
        </li>
      ))}
    </ul>
  );
}

export { UserGrid };
