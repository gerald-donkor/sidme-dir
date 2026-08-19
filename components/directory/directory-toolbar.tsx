"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

const DEBOUNCE_MS = 300;

/**
 * The only client component on the directory.
 *
 * It owns the search box and nothing else. The query itself lives in the URL,
 * which is what makes a result shareable, survivable across a reload, and
 * correct under the back button — there is no second copy of it in React state
 * for the two to drift apart.
 */
function DirectoryToolbar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(initialQuery);
  const [isPending, startTransition] = React.useTransition();

  const commit = React.useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams);
      if (next.trim()) {
        params.set("q", next.trim());
      } else {
        params.delete("q");
      }
      // A new query always starts at page one; keeping the old page would ask
      // for results that may not exist.
      params.delete("page");

      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams]
  );

  // Debounced so a typed word is one request, not six.
  React.useEffect(() => {
    if (value === initialQuery) return;
    const timer = setTimeout(() => commit(value), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, initialQuery, commit]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="directory-search" className="text-sm font-medium">
        Search
      </label>
      <InputGroup className="sm:w-80">
        <InputGroupAddon>
          <SearchIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          id="directory-search"
          type="search"
          name="q"
          placeholder="Name, email or username"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <InputGroupAddon align="inline-end">
          {isPending ? (
            <Spinner aria-label="Searching" />
          ) : value ? (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Clear search"
              onClick={() => {
                setValue("");
                commit("");
              }}
            >
              <XIcon />
            </Button>
          ) : null}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export { DirectoryToolbar };
