import { CharacterService } from "./character-service/CharacterService";
import { GoogleAnalyticsService } from "./google-analytics/GoogleAnalyticsService";
import { LoggerService } from "./logger/LoggerSerivce";
import { SentryService } from "./sentry/SentryService";

const buildNumber = process.env.BUILD_ID ?? "0";
const hash = process.env.COMMIT_REF ?? "0";
const context: "localhost" | string = process.env.CONTEXT ?? "localhost";

export const env = { buildNumber, hash, context };

export const logger = new LoggerService();
export const sentryService = new SentryService();
export const googleAnalyticsService = new GoogleAnalyticsService(logger);
export const characterService = new CharacterService();
