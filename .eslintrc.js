module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'sourceType': 'module'
  },
  'rules': {
    'indent': ['error', 2, { 'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 } }],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'no-shadow': ['error'], // Prevent potential errors
    'no-console': 'off',
    // Styles
    'space-before-function-paren': ['error', 'never'],
    'space-before-blocks': 'error',
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'key-spacing': 'error',
    'array-bracket-spacing': 'error',
    'comma-spacing': 'error',
    'comma-dangle': 'off',
    'eol-last': 'error'
  },
  globals: {
    $: true, // Temporarily add $ to global for developing purpose
  }
}
