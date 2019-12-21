import { LoggerService } from "./logger/LoggerSerivce";
import { GoogleAnalyticsService } from "./google-analytics/GoogleAnalyticsService";
import { SceneService } from "./scene-service/SceneService";
import { SentryService } from "./sentry/SentryService";
import { CharacterService } from "./character-service/CharacterService";

const buildNumber = process.env.BUILD_ID ?? "0";
const hash = process.env.COMMIT_REF ?? "0";
const context = process.env.CONTEXT ?? "localhost";

export const env = { buildNumber, hash, context };

export const logger = new LoggerService();
export const sentryService = new SentryService();
export const googleAnalyticsService = new GoogleAnalyticsService(logger);
export const sceneService = new SceneService();
export const characterService = new CharacterService();
