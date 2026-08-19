import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Container } from "@/components/chrome/container";
import { Button } from "@/components/ui/button";
import { DetailCard } from "@/components/user/detail-card";
import { IdentityHero } from "@/components/user/identity-hero";
import { identityHue } from "@/lib/users/accent";
import { getUser } from "@/lib/users/api";
import {
  formatBirthDate,
  formatHeight,
  formatWeight,
  fullAddress,
} from "@/lib/users/format";
import {
  directoryHref,
  parseDirectoryQuery,
  parseUserSlug,
  profileHref,
  userSlug,
} from "@/lib/users/search-params";

/**
 * `getUser` is wrapped in React.cache(), so this and the page body below share
 * a single request rather than fetching the same person twice per render.
 */
/**
 * The segment carries the username for readability, but the id is the key. A
 * segment with no leading digits is not a profile at all.
 */
function requireUserId(segment: string): string {
  const id = parseUserSlug(segment);
  if (id === null) notFound();
  return id;
}

export async function generateMetadata(
  props: PageProps<"/users/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const user = await getUser(requireUserId(id));

  return {
    title: user.fullName,
    description: `${user.company.title} at ${user.company.name}. Contact details and profile.`,
  };
}

export default async function UserProfilePage(
  props: PageProps<"/users/[id]">
) {
  const [{ id }, rawSearchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const user = await getUser(requireUserId(id));

  // Old and hand-typed links (/users/22) keep working; they land on the
  // canonical slug instead. The search params come along, because losing them
  // would break "Back to directory" — the reason they are on the URL at all.
  // redirect() throws, so it sits outside any try.
  const query = parseDirectoryQuery(rawSearchParams);
  if (id !== userSlug(user)) {
    redirect(profileHref(user, query));
  }

  // The list the reader came from, so "Back" returns to their search and page
  // rather than dumping them at the top of the directory.
  const backHref = directoryHref(query);
  const hue = identityHue(user.id);

  return (
    <main id="content" className="flex-1 pb-16">
      <Container className="flex flex-col gap-6 pt-6">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="w-fit"
          render={<Link href={backHref} />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back to directory
        </Button>

        <IdentityHero user={user} />

        <div className="grid gap-4 lg:grid-cols-2">
          <DetailCard
            hue={hue}
            title="Contact"
            fields={[
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone, mono: true },
              { label: "Username", value: user.username, mono: true },
            ]}
          />
          <DetailCard
            hue={hue}
            title="Company"
            fields={[
              { label: "Company", value: user.company.name },
              { label: "Job title", value: user.company.title },
              { label: "Department", value: user.company.department },
              { label: "Office", value: fullAddress(user.companyAddress) },
            ]}
          />
          <DetailCard
            hue={hue}
            title="Location"
            fields={[
              { label: "Address", value: fullAddress(user.address) },
              { label: "City", value: user.address.city },
              { label: "State", value: user.address.state },
              { label: "Country", value: user.address.country },
            ]}
          />
          <DetailCard
            hue={hue}
            title="Personal"
            fields={[
              { label: "Age", value: user.age ? String(user.age) : "", mono: true },
              { label: "Date of birth", value: formatBirthDate(user.birthDate) },
              { label: "University", value: user.university },
              { label: "Blood group", value: user.bloodGroup, mono: true },
              { label: "Height", value: formatHeight(user.heightCm), mono: true },
              { label: "Weight", value: formatWeight(user.weightKg), mono: true },
              { label: "Eye colour", value: user.eyeColor },
              {
                label: "Hair",
                value: [user.hair.color, user.hair.type]
                  .filter(Boolean)
                  .join(", "),
              },
            ]}
          />
        </div>
      </Container>
    </main>
  );
}
