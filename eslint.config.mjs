import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    ignores: ['.serena', 'dist', 'node_modules', 'skills', 'sources', 'vendor'],
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
)
