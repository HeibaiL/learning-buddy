/* eslint-env node */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: [
    "@typescript-eslint",
    "import",
    "unused-imports",
    "promise",
    "sonarjs",
    "simple-import-sort",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    "next/core-web-vitals", // з eslint-config-next
    "prettier", // в кінці — вимикає конфлікти з prettier
  ],
  settings: {
    "import/resolver": {
      typescript: {}, // щоб працювали path aliases з tsconfig
      node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    },
  },
  rules: {
    // імпорти/порядок
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "import/first": "error",
    "import/newline-after-import": "warn",
    "import/no-duplicates": "warn",

    // чистота коду
    "unused-imports/no-unused-imports": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-floating-promises": "error",
    "promise/no-multiple-resolved": "error",
    "sonarjs/no-duplicate-string": "off", // в UI часто норм
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // React/Next дрібниці
    "react/self-closing-comp": "off", // якщо додаси eslint-plugin-react — можеш вмикати
  },
  overrides: [
    {
      files: ["**/*.js", "**/*.cjs"],
      rules: { "@typescript-eslint/no-var-requires": "off" },
    },
    {
      files: ["app/**/actions.ts", "app/**/route.ts"],
      rules: {
        "no-console": "off",
      },
    },
  ],
  ignorePatterns: [".next/", "node_modules/", "dist/", "build/", "coverage/"],
};
