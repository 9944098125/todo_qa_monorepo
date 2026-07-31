const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  extends: [
    'react-app',
    'prettier',
    // 'plugin:jsx-control-statements/recommended',
  ],
  plugins: [
    'prettier',
    //  'jsx-control-statements'
  ],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'prettier/prettier': ['warn', prettierOptions],
        // 'react/jsx-no-undef': [
        // 	2,
        // 	{
        // 		allowGlobals: true,
        // 	},
        // ],
      },
    },
  ],
};
