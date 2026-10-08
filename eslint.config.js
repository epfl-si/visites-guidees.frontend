import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import unicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  globalIgnores(['dist', 'src/components/ui', 'src/components/reui', 'src/hooks/use-mobile.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      unicorn, 
    },
    rules: {
      'no-console': 'error',
      'eqeqeq': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
    }
  },
])
