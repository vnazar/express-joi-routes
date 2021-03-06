const RULE = { OFF: 0, WARN: 1, ERROR: 2 };

module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off"
    "@typescript-eslint/no-explicit-any": RULE.OFF,
    "@typescript-eslint/no-unused-vars": [RULE.ERROR, {"varsIgnorePattern": "_"}],
    "@typescript-eslint/typedef": [RULE.ERROR, {"variableDeclaration": true}],
    "@typescript-eslint/no-inferrable-types": [RULE.OFF],
    "max-len": [RULE.ERROR, {"code": 140}]
  },
};
