module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "eslint:recommended",
    "google",
    "plugin:react/recommended",
  ],
  "parserOptions": {
    sourceType: "module",
  },
  "plugins": [
    "react",
  ],
  "rules": {
    "quotes": ["error", "double"],
    "linebreak-style": "off",
    "max-len": ["error", {
      "code": 80,
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true
    }],
    "semi": "error",
    "react/prop-types": "off",
    "no-use-before-define": "off",
    "valid-jsdoc": [
      "error",
      {
        "requireReturn": false,
        "requireParamType": false,
      },
    ],
    "require-jsdoc": "off",
  },
};
