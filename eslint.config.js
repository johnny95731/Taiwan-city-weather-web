import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      react: pluginReact
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaFeatures: {
          jsx: true,
        },
      },
    }
  },
  {
    rules: {
      'linebreak-style': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
      'func-call-spacing': 'off',
      'import/first': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'react/jsx-first-prop-new-line': ['error'],
      'react/jsx-max-props-per-line': ['error', { 'maximum': 1 }],
    },
  },
];
