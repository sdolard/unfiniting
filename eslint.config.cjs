// Flat ESLint config (fully migrated; legacy .eslintrc removed)
// Node + TypeScript setup
const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
// path not needed once tsconfigRootDir removed

// Helper: extract rules from plugin's recommended config (flat format spreads rules only)
const tsRecommended = tsPlugin.configs.recommended;

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  // Base JS recommended
  js.configs.recommended,
  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
  project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    rules: {
      ...tsRecommended.rules,
      // project specific relaxations (ported from legacy config)
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // stricter unused vars: allow prefix '_' to intentionally ignore
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
  // type-aware promise safety
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/require-await': 'warn',
      // import ordering & hygiene
      'import/order': ['warn', {
        groups: [
          'builtin', 'external', 'internal',
          ['parent', 'sibling', 'index'], 'object', 'type'
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }],
      'import/first': 'error',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'error'
    },
  },
  // JavaScript (scripts) overrides
  {
    files: ['scripts/**/*.js', '*.cjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    },
    rules: {
      // allow CommonJS requires in maintenance scripts
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  // Ignores
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.json',
      'coverage/**',
      '.tsbuildinfo',
    ],
  },
];
