import baseConfig from "@repo/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  {
    ignores: [],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
];
