module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // https://jestjs.io/docs/en/configuration#testmatch-arraystring
  testMatch: [
    "<rootDir>/lib/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/lib/**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  globals: {
    "window": {
      location: { search: "" },
    },
    "ts-jest": {
      isolatedModules: true,
    },
  },
  globalSetup: "./jest-setup.js",
  reporters: ["default", "jest-junit"],
  coverageReporters: ["text", "text-summary", "cobertura", "lcov"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
