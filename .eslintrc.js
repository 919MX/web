module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "globals": {
    "$": true,
    "google": true,
    "mapboxgl": true,
    "document": true,
    "Headers": true,
    "fetch": true,
  },
  "rules": {
    "camelcase": 1,
    "function-paren-newline": 0,
    "object-curly-newline": [2, { "consistent": true }],
    "max-len": [2, { "ignoreStrings": true, "ignoreTemplateLiterals": true, "ignoreTrailingComments": true, "ignoreComments": true, "tabWidth": 2, "code": 100 }],
    "arrow-body-style": 0,
    "indent": [2, 2],
    "quotes": [2, "single"],
    "linebreak-style": [2, "unix"],
    "semi": [2, "never"],
    "comma-dangle": [2, "always-multiline"],
    "no-restricted-syntax": [0],
    "no-underscore-dangle": 0,
    "no-labels": 0,
    "no-continue": 0,
    "no-mixed-operators": 0,
    "no-unused-vars": 1,
    "no-empty": 1,
    "no-console": 1,
    "react/forbid-prop-types": 1,
    "react/require-default-props": 0,
    "react/jsx-filename-extension": 0,
    "react/no-array-index-key": 1,
    "import/no-extraneous-dependencies": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/anchor-is-valid": 0,
  },
};
