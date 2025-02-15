import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import flowtype from 'eslint-plugin-flowtype'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { 
      react: { version: '18.3' },
      flowtype: {
        onlyFilesWithFlowAnnotation: true
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      flowtype
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...flowtype.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'flowtype/boolean-style': [2, 'boolean'],
      'flowtype/define-flow-type': 1,
      'flowtype/delimiter-dangle': [2, 'never'],
      'flowtype/generic-spacing': [2, 'never'],
      'flowtype/no-mixed': 2,
      'flowtype/no-primitive-constructor-types': 2,
      'flowtype/no-types-missing-file-annotation': 2,
      'flowtype/no-weak-types': 0,
      'flowtype/object-type-delimiter': [2, 'comma'],
      'flowtype/require-parameter-type': 2,
      'flowtype/require-return-type': [
        2,
        'always',
        {
          annotateUndefined: 'never'
        }
      ],
      'flowtype/require-valid-file-annotation': 2,
      'flowtype/semi': [2, 'always'],
      'flowtype/space-after-type-colon': [2, 'always'],
      'flowtype/space-before-generic-bracket': [2, 'never'],
      'flowtype/space-before-type-colon': [2, 'never'],
      'flowtype/type-id-match': [2, '^([A-Z][a-z0-9]+)+Type$'],
      'flowtype/union-intersection-spacing': [2, 'always'],
      'flowtype/use-flow-type': 1,
      'flowtype/valid-syntax': 1
    },
  },
]
