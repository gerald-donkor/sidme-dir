import { cache } from "react";
import { notFound } from "next/navigation";

import type {
  Address,
  Company,
  User,
  UserRole,
  UserSummary,
  UsersPage,
} from "@/lib/users/types";

/**
 * The only module in this codebase that calls `fetch`.
 *
 * Everything above it — routes, components — asks for people and receives the
 * project's own types. A change to the upstream shape is this file's problem
 * and no one else's.
 */

const API_BASE = "https://dummyjson.com";

export const PAGE_SIZE = 24;

/**
 * Requested explicitly rather than taking the whole record. The full payload
 * includes credentials and financial identifiers we have no business holding;
 * see lib/users/types.ts.
 */
const LIST_FIELDS =
  "id,firstName,lastName,username,email,phone,image,role,company,address";

const DETAIL_FIELDS = `${LIST_FIELDS},age,gender,birthDate,university,bloodGroup,eyeColor,hair,height,weight`;

/**
 * Cached for an hour and tagged, so the directory does not re-hit a read-only
 * public API on every request. Caching is opt-in in Next 16 — without this the
 * fetch is uncached and the page is fully dynamic.
 */
const REQUEST_INIT = {
  next: { revalidate: 3600, tags: ["users"] },
} satisfies RequestInit;

/** A non-ok response that is not a 404. Carries the status so the boundary can say something true. */
export class UserApiError extends Error {
  constructor(
    readonly status: number,
    readonly url: string
  ) {
    super(`The directory service responded with ${status}.`);
    this.name = "UserApiError";
  }
}

/* -------------------------------------------------------------------------- */
/* Raw upstream shapes — internal to this module.                             */
/* -------------------------------------------------------------------------- */

interface RawAddress {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
}

interface RawCompany {
  name: string;
  title: string;
  department: string;
  address: RawAddress;
}

interface RawUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  image: string;
  role: string;
  company: RawCompany;
  address: RawAddress;
  age?: number;
  gender?: string;
  birthDate?: string;
  university?: string;
  bloodGroup?: string;
  eyeColor?: string;
  hair?: { color: string; type: string };
  height?: number;
  weight?: number;
}

interface RawUsersResponse {
  users: RawUser[];
  total: number;
  skip: number;
  limit: number;
}

/* -------------------------------------------------------------------------- */
/* Mapping                                                                    */
/* -------------------------------------------------------------------------- */

const ROLES: readonly UserRole[] = ["admin", "moderator", "user"];

function toRole(value: string): UserRole {
  return (ROLES as readonly string[]).includes(value)
    ? (value as UserRole)
    : "user";
}

function toAddress(raw: RawAddress): Address {
  return {
    street: raw.address,
    city: raw.city,
    state: raw.state,
    stateCode: raw.stateCode,
    postalCode: raw.postalCode,
    country: raw.country,
  };
}

function toCompany(raw: RawCompany): Company {
  return { name: raw.name, title: raw.title, department: raw.department };
}

function toSummary(raw: RawUser): UserSummary {
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    fullName: `${raw.firstName} ${raw.lastName}`,
    username: raw.username,
    email: raw.email,
    phone: raw.phone,
    image: raw.image,
    role: toRole(raw.role),
    company: toCompany(raw.company),
    address: toAddress(raw.address),
  };
}

function toUser(raw: RawUser): User {
  return {
    ...toSummary(raw),
    age: raw.age ?? 0,
    gender: raw.gender ?? "",
    birthDate: raw.birthDate ?? "",
    university: raw.university ?? "",
    bloodGroup: raw.bloodGroup ?? "",
    eyeColor: raw.eyeColor ?? "",
    hair: raw.hair ?? { color: "", type: "" },
    heightCm: raw.height ?? 0,
    weightKg: raw.weight ?? 0,
    companyAddress: toAddress(raw.company.address),
  };
}

/* -------------------------------------------------------------------------- */
/* Requests                                                                   */
/* -------------------------------------------------------------------------- */

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, REQUEST_INIT);

  if (!response.ok) {
    throw new UserApiError(response.status, url);
  }

  return (await response.json()) as T;
}

export interface ListUsersOptions {
  /** 1-based. Out-of-range values are clamped by the caller's page parsing. */
  page?: number;
  /** Free-text search across the directory. Empty means "everyone". */
  query?: string;
}

/**
 * One page of the directory.
 *
 * Wrapped in `cache()` so a route that reads the result twice in one render —
 * the header's count and the list itself — makes one request.
 */
export const listUsers = cache(async function listUsers({
  page = 1,
  query = "",
}: ListUsersOptions = {}): Promise<UsersPage> {
  const trimmed = query.trim();
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String((page - 1) * PAGE_SIZE),
    select: LIST_FIELDS,
  });

  if (trimmed) {
    params.set("q", trimmed);
  }

  const url = `${API_BASE}/users${trimmed ? "/search" : ""}?${params}`;
  const data = await getJson<RawUsersResponse>(url);

  return {
    users: data.users.map(toSummary),
    total: data.total,
    page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(data.total / PAGE_SIZE)),
  };
});

/**
 * One person.
 *
 * `cache()` matters here: the page body and `generateMetadata` both need this
 * user, and without it that is two requests for one render.
 *
 * A 404 is not an error state — it is a route that does not exist — so it goes
 * to `notFound()` and renders not-found.tsx. Every other failure reaches the
 * error boundary as a `UserApiError`.
 */
export const getUser = cache(async function getUser(id: string): Promise<User> {
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const url = `${API_BASE}/users/${id}?select=${DETAIL_FIELDS}`;
  const response = await fetch(url, REQUEST_INIT);

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new UserApiError(response.status, url);
  }

  return toUser((await response.json()) as RawUser);
});
