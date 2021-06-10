const buildNumber = import.meta?.env?.BUILD_NUMBER ?? "0";
const hash = import.meta?.env?.COMMIT_ID ?? "0";
const context = import.meta?.env?.CONTEXT ?? "localhost";
const version = import.meta?.env?.npm_package_version;
const isLocalHost = context === "localhost";
const isTest = import.meta?.env?.JEST_WORKER_ID;

export const env = { buildNumber, hash, context, version, isLocalHost, isTest };
