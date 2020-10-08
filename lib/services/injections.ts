import { GoogleAnalyticsService } from "./google-analytics/GoogleAnalyticsService";
import { InternationalizationService } from "./internationalization/InternationalizationService";
import { LoggerService } from "./logger/LoggerService";
import { SentryService } from "./sentry/SentryService";

const internationalizationService = new InternationalizationService();
const logger = new LoggerService();
const sentryService = new SentryService();
const googleAnalyticsService = new GoogleAnalyticsService(logger);

export const injections = {
  internationalizationService,
  logger,
  sentryService,
  googleAnalyticsService,
};
