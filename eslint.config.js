import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{j,t}sx', ],
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
      // 'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }]
    },
  },
];
