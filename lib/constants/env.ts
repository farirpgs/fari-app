const buildNumber = process.env.BUILD_NUMBER ?? "0";
const hash = process.env.COMMIT_ID ?? "0";
const context = process.env.CONTEXT ?? "localhost";
const version = process.env.npm_package_version;

export const env = { buildNumber, hash, context, version };
