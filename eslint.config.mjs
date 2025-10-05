// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

// React plugins
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig([
  // Base (all files)
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // JavaScript-only stylistic rules
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    rules: {
      'brace-style': ['error', 'allman', { allowSingleLine: false }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      // Keep indent only for JS; the core rule is unreliable on TS AST
      'indent': ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', 'never'],
    },
  },

  // TypeScript recommended (must come before TS-specific overrides)
  ...tseslint.configs.recommended,

  // TypeScript-only stylistic rules (use core ESLint rules, not @typescript-eslint variants)
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    rules: {
      'brace-style': ['error', 'allman', { allowSingleLine: false }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', 'never'],
    },
  },

  // React best practices (JSX/TSX)
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Core React
      'react/jsx-key': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
      'react/jsx-pascal-case': 'error',
      'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'react/no-deprecated': 'warn',
      // Modern JSX runtime (no need to import React)
      'react/react-in-jsx-scope': 'off',
      // PropTypes not needed with TS
      'react/prop-types': 'off',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': ['warn', {
        additionalHooks: '(useMemoOne|useDebouncedCallback|useAsyncCallback)',
      }],

      // Accessibility (a11y)
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          aspects: ['invalidHref', 'preferButton'],
          components: ['Link'],
          specialLink: ['to', 'hrefLeft', 'hrefRight'],
        },
      ],
      'jsx-a11y/no-autofocus': ['warn', { ignoreNonDOM: true }],
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'jsx-a11y/label-has-associated-control': [
        'error',
        { depth: 2 },
      ],
    },
  },

  // If you truly need plain script mode for .js (matches your original)
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
]);
