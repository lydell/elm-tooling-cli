const error = "error";
const warn = "CI" in process.env ? "error" : "warn";

module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "simple-import-sort", "jest"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  env: {
    es2020: true,
    node: true,
  },
  rules: {
    "@typescript-eslint/adjacent-overload-signatures": warn,
    "@typescript-eslint/array-type": [warn, { default: "generic" }],
    "@typescript-eslint/await-thenable": error,
    "@typescript-eslint/ban-ts-comment": error,
    "@typescript-eslint/ban-types": error,
    "@typescript-eslint/consistent-type-assertions": [
      error,
      { assertionStyle: "never" },
    ],
    "@typescript-eslint/consistent-type-definitions": [warn, "type"],
    "@typescript-eslint/default-param-last": warn,
    "@typescript-eslint/dot-notation": warn,
    "@typescript-eslint/explicit-function-return-type": warn,
    "@typescript-eslint/lines-between-class-members": warn,
    "@typescript-eslint/method-signature-style": warn,
    "@typescript-eslint/no-array-constructor": warn,
    "@typescript-eslint/no-base-to-string": error,
    "@typescript-eslint/no-dupe-class-members": error,
    "@typescript-eslint/no-empty-function": warn,
    "@typescript-eslint/no-empty-interface": warn,
    "@typescript-eslint/no-explicit-any": warn,
    "@typescript-eslint/no-floating-promises": error,
    "@typescript-eslint/no-for-in-array": warn,
    "@typescript-eslint/no-implied-eval": error,
    "@typescript-eslint/no-inferrable-types": [
      warn,
      { ignoreParameters: true },
    ],
    "@typescript-eslint/no-invalid-this": error,
    "@typescript-eslint/no-invalid-void-type": error,
    "@typescript-eslint/no-loop-func": error,
    "@typescript-eslint/no-loss-of-precision": error,
    "@typescript-eslint/no-misused-promises": error,
    "@typescript-eslint/no-namespace": error,
    "@typescript-eslint/no-non-null-assertion": error,
    "@typescript-eslint/no-require-imports": error,
    "@typescript-eslint/no-shadow": error,
    "@typescript-eslint/no-this-alias": warn,
    "@typescript-eslint/no-throw-literal": error,
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": warn,
    "@typescript-eslint/no-unnecessary-type-arguments": warn,
    "@typescript-eslint/no-unsafe-assignment": error,
    "@typescript-eslint/no-unsafe-call": error,
    "@typescript-eslint/no-unsafe-member-access": error,
    "@typescript-eslint/no-unsafe-return": error,
    "@typescript-eslint/no-unused-expressions": error,
    "@typescript-eslint/no-var-requires": error,
    "@typescript-eslint/prefer-as-const": warn,
    "@typescript-eslint/prefer-for-of": warn,
    "@typescript-eslint/prefer-function-type": warn,
    "@typescript-eslint/prefer-includes": warn,
    "@typescript-eslint/prefer-nullish-coalescing": warn,
    "@typescript-eslint/prefer-optional-chain": warn,
    "@typescript-eslint/prefer-readonly-parameter-types": warn,
    "@typescript-eslint/prefer-reduce-type-parameter": warn,
    "@typescript-eslint/prefer-regexp-exec": warn,
    "@typescript-eslint/prefer-string-starts-ends-with": warn,
    "@typescript-eslint/promise-function-async": error,
    "@typescript-eslint/require-await": error,
    "@typescript-eslint/restrict-plus-operands": error,
    "@typescript-eslint/restrict-template-expressions": error,
    "@typescript-eslint/return-await": error,
    "@typescript-eslint/strict-boolean-expressions": error,
    "@typescript-eslint/switch-exhaustiveness-check": error,
    "@typescript-eslint/triple-slash-reference": warn,
    "@typescript-eslint/unbound-method": error,
    "@typescript-eslint/unified-signatures": warn,
    // TODO: ESLint core rules.
    curly: warn,
    "no-console": warn,
    "simple-import-sort/sort": warn,
  },
  overrides: [
    {
      files: "scripts/**/*.ts",
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./scripts/tsconfig.json"],
      },
    },
    {
      files: "tests/**/*.ts",
      extends: ["plugin:jest/recommended", "plugin:jest/style"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tests/tsconfig.json"],
      },
    },
  ],
};
