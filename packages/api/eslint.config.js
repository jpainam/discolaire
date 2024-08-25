import baseConfig from "@repo/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
    rules: {
      //"@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
  ...baseConfig,
];
