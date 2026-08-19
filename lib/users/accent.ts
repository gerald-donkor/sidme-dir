/**
 * Identity colour.
 *
 * Six hues, defined once in app/globals.css. A person's hue is derived from
 * their id, so they carry the same colour on a card, in a table row and on
 * their profile — it is a recognition aid, not decoration.
 *
 * The return value is written to `data-identity`, and the CSS in globals.css
 * binds it to `--identity` / `--identity-soft` / `--identity-ink` for the
 * subtree. That indirection is deliberate: a class name assembled by string
 * concatenation is a class name Tailwind cannot see.
 */

export const IDENTITY_HUE_COUNT = 6;

export type IdentityHue = 1 | 2 | 3 | 4 | 5 | 6;

export function identityHue(id: number): IdentityHue {
  const index = (((id - 1) % IDENTITY_HUE_COUNT) + IDENTITY_HUE_COUNT) % IDENTITY_HUE_COUNT;
  return (index + 1) as IdentityHue;
}
