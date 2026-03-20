import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    ignores: ['.serena', 'dist', 'docs', 'node_modules', 'skills', 'sources', 'vendor'],
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
)
