// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      // "no-undef": "error",
      "no-redeclare": "error",
      "no-constant-condition": "warn",
      "no-debugger": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "curly": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "double", { "avoidEscape": true }],
      "comma-dangle": ["error", "always-multiline"],
      "arrow-parens": ["error", "always"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "indent": ["warn", 2, { "SwitchCase": 1 }],



    },
  },
);
