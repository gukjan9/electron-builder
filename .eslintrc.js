module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    '@stylistic',
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parserOptions: {
    project: ["./packages/*/tsconfig.json"],
  },
  rules: {
    "@typescript-eslint/no-require-imports": "off",
    semi: "off",
    "prettier/prettier": "warn",
    "@typescript-eslint/prefer-promise-reject-errors": "off",
    "@stylistic/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "none",
        },
      },
    ],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-constant-condition": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn", // or "error"
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "off",
      {
        // "allowExpressions": false,
      },
    ],
    "@typescript-eslint/no-redundant-type-constituents": "off",
  },
}
