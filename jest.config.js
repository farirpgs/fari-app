module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  globalSetup: "./jest-setup.js",
  reporters: ["default", "jest-junit"],
  coverageReporters: ["text", "cobertura"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
