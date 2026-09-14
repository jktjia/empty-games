//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      '@typescript-eslint/array-type': [
        'error',
        { default: 'array', readonly: 'array' },
      ],
    },
  },
  {
    ignores: ['src/components/ui/*'],
  },
]
