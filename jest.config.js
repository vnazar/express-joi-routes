module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/test/*.(ts|tsx)"],

};