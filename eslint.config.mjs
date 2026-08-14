import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";

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
    // Project-specific:
    "node_modules/**",
    "coverage/**",
    "lib/generated/**",
  ]),

  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",

      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Side effect imports ("server-only", "dotenv/config", polyfills).
            ["^\\u0000"],
            // React / Next / other packages.
            ["^react", "^next", "^@?\\w"],
            // Path aliases, most specific first.
            ["^@/stores(/.*|$)"],
            ["^@/components(/.*|$)"],
            ["^@/hooks(/.*|$)"],
            ["^@/lib(/.*|$)"],
            ["^@/services(/.*|$)"],
            ["^@/utils(/.*|$)"],
            ["^@/types(/.*|$)"],
            ["^@/"],
            // Parent imports, then sibling / index imports.
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports.
            ["^.+\\.?(css)$"],
          ],
        },
      ],
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // Must stay last: disables stylistic rules that clash with Prettier and
  // reports Prettier differences as ESLint errors.
  prettierRecommended,
]);

export default eslintConfig;
