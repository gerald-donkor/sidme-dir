import { Suspense } from "react";

import { Container } from "@/components/chrome/container";
import {
  PageDescription,
  PageHeader,
  PageHeaderText,
  PageTitle,
} from "@/components/chrome/page-header";
import { DirectorySkeleton } from "@/components/directory/directory-skeleton";
import { DirectoryResults } from "@/components/directory/directory-results";
import { DirectoryToolbar } from "@/components/directory/directory-toolbar";
import { parseDirectoryQuery } from "@/lib/users/search-params";

export default async function DirectoryPage(props: PageProps<"/">) {
  const { query, page } = parseDirectoryQuery(await props.searchParams);

  return (
    <main id="content" className="flex-1 pb-16">
      <Container>
        <PageHeader>
          <PageHeaderText>
            <PageTitle>Directory</PageTitle>
            <PageDescription>
              Search by name, email or username, and open
              anyone to see full profile.
            </PageDescription>
          </PageHeaderText>
          <DirectoryToolbar initialQuery={query} />
        </PageHeader>

        {/*
          Keyed on the query so a new search shows the skeleton again rather
          than holding the previous page's rows while the next one loads.
        */}
        <Suspense key={`${query}|${page}`} fallback={<DirectorySkeleton />}>
          <DirectoryResults query={query} page={page} />
        </Suspense>
      </Container>
    </main>
  );
}
