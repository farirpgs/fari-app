const context = import.meta.env?.MODE ?? "development";
const isDev = import.meta.env?.DEV;
const buildNumber = import.meta.env?.VITE_GITHUB_RUN_NUMBER ?? "0";
const hash = import.meta.env?.VITE_GITHUB_SHA ?? "0";
const version = process.env.npm_package_version;
const isTest = process.env.JEST_WORKER_ID;

export const env = {
  buildNumber,
  hash,
  context,
  version,
  isDev: isDev,
  isTest,
};
