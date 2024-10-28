"use strict";

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  overrides: [
    // ts,js files
    {
      files: ['**/*.{js,ts}'],
      plugins: ['ember'],
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended', // or other configuration
      ],
      rules: {
        // override / enable optional rules
        'ember/no-replace-test-comments': 'error',
        'no-unused-vars': "off",
        '@typescript-eslint/no-unused-vars': "error",
      }
    },
    {
      files: ["**/*.gts"],
      parser: "ember-eslint-parser",
      plugins: ["ember"],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gts'
      ],
      rules: {
        'ember/no-empty-glimmer-component-classes': 'off', //Not named properly in ember-inspector ATM
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-undef': 'off' //Does not know how to handle correctly for TS
      }
    },
    {
      files: ["**/*.gjs"],
      parser: "ember-eslint-parser",
      plugins: ["ember"],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gjs',
      ],
    },
    // node files
    {
      files: [
        "./.eslintrc.cjs",
        "./.template-lintrc.cjs",
        "./addon-main.cjs",
        "./index.js",
      ],
      parserOptions: {
        sourceType: "script",
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ["n"],
      extends: ["plugin:n/recommended"],
    },
  ],
};
