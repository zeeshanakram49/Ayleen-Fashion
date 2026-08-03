import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    "dist/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "legacy-vite/**",
    "src/api/**",
    "src/pages/**",
    "src/services/**",
    "src/routes/**",
    "src/context/**",
    "src/hooks/**",
    "src/App.tsx",
    "src/main.tsx",
    "src/components/*.tsx",
    "vite.config.ts",
    "eslint.config.js",
  ]),
]);
