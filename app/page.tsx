import { Suspense } from "react";

import { Container } from "@/components/chrome/container";
import {
  PageDescription,
  PageHeader,
  PageHeaderText,
  PageTitle,
} from "@/components/chrome/page-header";
import { DirectoryBoundary } from "@/components/directory/directory-boundary";
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
            <PageTitle>Users</PageTitle>
            <PageDescription>
              Search by name, email or username, and open
              any user to view their details.
            </PageDescription>
          </PageHeaderText>
          <DirectoryToolbar initialQuery={query} />
        </PageHeader>

        {/*
          The boundary wraps the results only, so a failed load leaves the
          header and the search box mounted and the reader can change the query
          that failed. app/error.tsx stays as the net for the shell itself.

          The Suspense inside is keyed on the query so a new search shows the
          skeleton again rather than holding the previous page's rows while the
          next one loads.
        */}
        <DirectoryBoundary>
          <Suspense key={`${query}|${page}`} fallback={<DirectorySkeleton />}>
            <DirectoryResults query={query} page={page} />
          </Suspense>
        </DirectoryBoundary>
      </Container>
    </main>
  );
}
