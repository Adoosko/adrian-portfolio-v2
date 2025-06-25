// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js základné konfigurácie
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Vlastné pravidlá pre limitovanie errorov
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      // ✅ TypeScript pravidlá - zmeň na 'warn' alebo 'off'
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',

      // React pravidlá
      'react/no-unescaped-entities': 'warn',
      'react/jsx-key': 'warn',
      'react/jsx-no-duplicate-props': 'warn',
      'react/jsx-no-undef': 'warn',
      'react/no-children-prop': 'warn',
      'react/no-danger-with-children': 'warn',
      'react/no-deprecated': 'warn',
      'react/no-direct-mutation-state': 'warn',
      'react/no-find-dom-node': 'warn',
      'react/no-is-mounted': 'warn',
      'react/no-render-return-value': 'warn',
      'react/no-string-refs': 'warn',
      'react/no-unknown-property': 'warn',
      'react/require-render-return': 'warn',

      // Všeobecné pravidlá
      'no-console': 'warn', // Povoľ console.log v developmente
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error', // Toto nechaj ako error

      // Import/Export pravidlá
      'no-duplicate-imports': 'warn',

      // Next.js špecifické pravidlá - zmierni
      '@next/next/no-img-element': 'warn',
      '@next/next/no-page-custom-font': 'warn',
      '@next/next/no-unwanted-polyfillio': 'warn',
      '@next/next/no-before-interactive-script-outside-document': 'warn',
      '@next/next/no-css-tags': 'warn',
      '@next/next/no-head-element': 'warn',
      '@next/next/no-html-link-for-pages': 'warn',
      '@next/next/no-sync-scripts': 'warn',
      '@next/next/no-title-in-document-head': 'warn',
    },
  },

  // Špecifické pravidlá pre config súbory
  {
    files: ['*.config.{js,mjs,ts}', 'next.config.{js,mjs,ts}'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },

  // Ignorované súbory a priečinky
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'build/',
      'dist/',
      '*.config.js',
      'public/',
      '.env*',
      '*.log',
    ],
  },
];

export default eslintConfig;
