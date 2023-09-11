const context = process.env.NODE_ENV ?? "development";
const isDev = process.env.NODE_ENV !== "production";
const buildNumber = process.env.NEXT_PUBLIC_GITHUB_RUN_NUMBER ?? "0";
const hash = process.env.NEXT_PUBLIC_GITHUB_SHA ?? "0";
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
