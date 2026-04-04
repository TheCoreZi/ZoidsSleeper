import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import solid from 'eslint-plugin-solid/configs/typescript';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
    rules: {
      ...solid.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'arrow-spacing': 'error',
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        imports: 'always-multiline',
        objects: 'always-multiline',
      }],
      'curly': 'error',
      'indent': ['error', 2, { SwitchCase: 1 }],
      'keyword-spacing': 'error',
      'no-alert': 'error',
      'no-tabs': 'error',
      'no-trailing-spaces': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'semi-spacing': 'error',
      'space-before-blocks': ['error', 'always'],
      'space-infix-ops': 'error',
      'template-curly-spacing': ['error', 'never'],
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
);
