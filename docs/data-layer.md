# Data layer

`lib/users/` — the only part of the codebase that knows an HTTP API exists.

## The source, as observed

**DummyJSON**, `https://dummyjson.com`, read-only and unauthenticated. Verified live on
19 Aug 2026 — the shapes below are transcribed from real responses, not from documentation.

| endpoint | used for |
| --- | --- |
| `GET /users?limit=&skip=&select=` | the directory list and its pagination |
| `GET /users/search?q=&limit=&skip=&select=` | the same list, filtered. **`select` works here too** |
| `GET /users/:id?select=` | one profile. Returns a real **HTTP 404** for an unknown id |

`GET /users?limit=2` returns `{ users: [...], total: 208, skip: 0, limit: 2 }`. One record, trimmed
to the parts this app keeps:

```json
{
  "id": 1,
  "firstName": "Emily", "lastName": "Johnson",
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "phone": "+81 965-431-3024",
  "image": "https://dummyjson.com/icon/emilys/128",
  "role": "admin",
  "birthDate": "1996-5-30",
  "company": {
    "department": "Engineering",
    "name": "Dooley, Kozey and Cronin",
    "title": "Sales Manager",
    "address": { "address": "263 Tenth Street", "city": "San Francisco", "stateCode": "WI", ... }
  },
  "address": { "address": "626 Main Street", "city": "Phoenix", "stateCode": "MS", ... }
}
```

Counts, as measured: **208 people**; roles are `user` (193), `moderator` (10), `admin` (5);
twelve departments, from `Marketing` (23) down to `Business Development` (7).

## What is deliberately not taken

The full record also carries **`password`, `ssn`, `ein`, `bank` (card number, IBAN), `crypto`
(wallet), `macAddress`, `ip` and `userAgent`.**

None of it is in `lib/users/types.ts`, and `api.ts` names its fields through the API's `select`
parameter so the rest never crosses the wire. It is fixture data on a public toy API, and it costs
nothing to take it all — which is exactly why the decision is worth making explicitly. **Requesting
a field is a decision to transmit it.** Adding one to the type is the same decision.

## Shape

```
lib/users/
  types.ts           UserSummary, User, UsersPage — the project's own shapes
  api.ts             listUsers(), getUser() — the only fetch caller
  accent.ts          identityHue(id) -> 1..6
  format.ts          initials, shortLocation, fullAddress, formatBirthDate, roleLabel, ...
  search-params.ts   parseDirectoryQuery, directoryHref, profileHref
```

`api.ts` never returns an upstream object. Raw shapes are private to the module and mapped through
`toSummary` / `toUser`, so an upstream rename is one file's problem. `role` is narrowed through a
whitelist and falls back to `"user"` rather than trusting the string.

## Caching

`{ next: { revalidate: 3600, tags: ["users"] } }` on every request.

**This is not the default.** In Next 16 `fetch` is uncached unless told otherwise, so without this
line every page view would re-hit a public API that changes never. An hour is arbitrary but honest
for fixture data; the `users` tag is there so `revalidateTag` is available if a write path ever
appears.

`listUsers` and `getUser` are both wrapped in **`React.cache()`**. For `getUser` that is load-bearing
rather than decorative: `generateMetadata` and the page body each need the same person, and without
it one render makes two identical requests.

## Errors

| upstream | becomes | renders |
| --- | --- | --- |
| 404 from `/users/:id` | `notFound()` | `app/users/[id]/not-found.tsx` |
| a non-numeric id in the URL | `notFound()`, before any request | the same |
| any other non-`ok` | `UserApiError(status, url)` | the nearest `error.tsx`, with `retry` |
| a network failure | the thrown `TypeError` | the same boundary |

A missing person is a route that does not exist, not a failure — which is why it gets its own
screen and its own copy rather than the generic "something went wrong".

## Decisions worth knowing

**`generateStaticParams` is not used.** 208 profiles is the wrong trade for an app of this size: it
would push 208 requests into every build to save a first-visit render that `revalidate: 3600`
already warms after one hit. `/users/[id]` renders on demand.

**The API's avatar is not rendered.** `image` is a generated pixel-art identicon in fixed dark blue.
It is invisible against the dark theme, generic against the light one, and it says nothing about the
person that their initials do not say better. `UserAvatar` renders initials on the person's identity
hue instead. `image` stays on `UserSummary` so a real photograph could be dropped in without a data
change, and `next.config.ts` carries **no** `images.remotePatterns` because nothing loads a remote
image — an unused config entry is a claim the code does not make.

**Page size is 24**, which divides evenly into the three- and four-column grids and gives nine pages
over 208 people — enough for pagination to be worth demonstrating without being tedious.
