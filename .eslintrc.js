module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {},
  extends: ["plugin:prettier/recommended"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  rules: {
    semi: ["error", "always"],
  },
};
