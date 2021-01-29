const buildNumber = process.env.BUILD_NUMBER ?? "0";
const hash = process.env.COMMIT_ID ?? "0";
const context = process.env.CONTEXT ?? "localhost";
const version = process.env.npm_package_version;
const isLocalHost = context === "localhost";
const isTest = process.env.JEST_WORKER_ID;
export const env = { buildNumber, hash, context, version, isLocalHost, isTest };
