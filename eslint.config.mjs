/** @ts-check
  * rules:
  * - js: https://eslint.org/docs/latest/rules/
  * - ts: https://typescript-eslint.io/rules/
  * - vue: https://eslint.vuejs.org/rules/
  **/

import js from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.strict,
  ...ts.configs.stylistic,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        project: './tsconfig.app.json',
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    plugins: {
      'typescript-eslint': ts.plugin,
    }
  },
  {
    ignores: ['dist/**', 'eslint.config.mjs', 'vite.config.ts'],
  },
  {
    rules: {
      "sort-imports": ["error", { "allowSeparatedGroups": true, "ignoreCase": true, "ignoreDeclarationSort": true }],
      "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": true}],
      "sort-vars": ["error"],
      "vue/max-attributes-per-line": ["error", {"singleline": { "max": 5 }, "multiline": { "max": 1 } }],
      "vue/multi-word-component-names": "off",
      "vue/no-mutating-props": ["error", { "shallowOnly": true }]
    }
  }
);