/**
 * The project's own shape for a person.
 *
 * These types are written from the observed DummyJSON response (recorded in
 * docs/data-layer.md), not from its documentation, and they are deliberately
 * narrower than it.
 *
 * The upstream payload also carries `password`, `ssn`, `ein`, `bank`, `crypto`,
 * `macAddress`, `ip` and `userAgent`. None of that is ours to hold, none of it
 * is typed here, and lib/users/api.ts keeps it off the wire with the API's
 * `select` parameter. Adding a field here is a decision to transmit it.
 */

export type UserRole = "admin" | "moderator" | "user";

export interface Company {
  name: string;
  title: string;
  department: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
}

/** What the directory list renders. */
export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  image: string;
  role: UserRole;
  company: Company;
  address: Address;
}

/** What a profile page renders: the summary plus the personal detail. */
export interface User extends UserSummary {
  age: number;
  gender: string;
  birthDate: string;
  university: string;
  bloodGroup: string;
  eyeColor: string;
  hair: { color: string; type: string };
  heightCm: number;
  weightKg: number;
  companyAddress: Address;
}

export interface UsersPage {
  users: UserSummary[];
  /** Total matching the current query, not the size of this page. */
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}
