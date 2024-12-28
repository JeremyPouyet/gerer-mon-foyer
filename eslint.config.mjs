/** @ts-check
  * rules:
  * - js: https://eslint.org/docs/latest/rules/
  * - ts: https://typescript-eslint.io/rules/
  * - stylisticTs: https://eslint.style/packages/ts#rules
  * - vue: https://eslint.vuejs.org/rules/
  **/

import js from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import stylisticTs from '@stylistic/eslint-plugin-ts'

// eslint-disable-next-line no-restricted-syntax
const apostropheMsg = 'Use the curly apostrophe (’) instead of the straight apostrophe (\').'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.strict,
  ...ts.configs.stylistic,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: ts.parser,
        project: './tsconfig.app.json',
        sourceType: 'module',
      },
    },
    plugins: {
      'typescript-eslint': ts.plugin
    }
  },
  {
    ignores: ['dist/**', '.vite-ssg-temp/**', 'vite.config.ts'],
  },
  {
    plugins: {
      '@stylistic/ts': stylisticTs
    },
    rules: {
      '@stylistic/ts/block-spacing': ['error', 'always'],
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/semi': ['error', 'never'],
      // eslint-disable-next-line no-restricted-syntax
      'no-restricted-syntax': ['error', { message: apostropheMsg, selector: 'Literal[value=/.*\'.*/]' }],
      'sort-imports': ['error', { allowSeparatedGroups: true, ignoreCase: true, ignoreDeclarationSort: true }],
      'sort-keys': ['error', 'asc', { 'caseSensitive': true, 'natural': true }],
      'sort-vars': ['error'],
      'vue/attributes-order': ['error', { alphabetical: true }],
      'vue/max-attributes-per-line': ['error', { multiline: { max: 1 }, singleline: { max: 5 } }],
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': ['error', { shallowOnly: true }],
      // eslint-disable-next-line no-restricted-syntax
      'vue/no-restricted-syntax': ['error', { message: apostropheMsg, selector: 'VElement[name=/^(p|span|h1|h2|h3|h4)$/] > VText[value=/.*\'.*/]' }],
    }
  },
)