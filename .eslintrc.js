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
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'no-console': 'off',
    // Styles
    'space-before-function-paren': ['error', 'never'],
    'space-before-blocks': 'error',
    'brace-style': ['error', "1tbs", { "allowSingleLine": true }],
    'key-spacing': 'error',
    'array-bracket-spacing': 'error',
    'comma-spacing': 'error',
    'eol-last': 'error'
  }
}
