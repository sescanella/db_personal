// eslint.config.js (ESLint v9 - flat, TS con references)
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended, // si quieres reglas con type-checking, cambia a: recommendedTypeChecked
  {
    files: ["src/**/*.{ts,tsx}", "vite.config.ts", "*.config.ts"],
    ignores: ["dist", "node_modules", "coverage"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // 👇 Clave: usar los TSConfigs que realmente incluyen tus archivos
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  prettier, // desactiva reglas que chocan con Prettier
]
