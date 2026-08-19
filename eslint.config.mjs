import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // The shadcn registry is generated, vendored code. AGENTS.md holds it
    // unedited so it stays regenerable, which means its lint findings are
    // upstream's to fix and not ours to suppress by rewriting the files.
    // Two of them trip react-hooks/set-state-in-effect: components/ui/carousel.tsx
    // and hooks/use-mobile.ts, neither of which this app renders.
    files: ["components/ui/**", "hooks/**"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
