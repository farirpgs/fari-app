import { GoogleAnalyticsService } from "./google-analytics/GoogleAnalyticsService";
import { InternationalizationService } from "./internationalization/InternationalizationService";
import { LoggerService } from "./logger/LoggerService";
import { SentryService } from "./sentry/SentryService";

const buildNumber = process.env.BUILD_ID ?? "0";
const hash = process.env.COMMIT_REF ?? "0";
const context = process.env.CONTEXT ?? "localhost";
const version = process.env.npm_package_version;

export const env = { buildNumber, hash, context, version };
export const internationalizationService = new InternationalizationService();
export const logger = new LoggerService();
export const sentryService = new SentryService();
export const googleAnalyticsService = new GoogleAnalyticsService(logger);
