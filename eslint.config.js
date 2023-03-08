module.exports = {
    plugins: ['html'],
    parser: 'html-eslint-parser',
    overrides: [
      {
        files: ['*.html'],
        rules: {
          'no-unused-vars': 'off',
          'no-undef': 'off',
          'no-console': 'off',
          'no-alert': 'off',
          'no-debugger': 'off',
          'quotes': ['error', 'single'],
          'semi': ['error', 'never'],
          'indent': ['error', 2],
          'html/html-extensions': ['error', { 'extensions': ['.html', '.hbs'] }],
          'html/no-self-closing': 'off'
        }
      },
      {
        files: ['*.js'],
        rules: {
          'quotes': ['error', 'single'],
          'semi': ['error', 'never'],
          'indent': ['error', 2]
        }
      }
    ]
  };
