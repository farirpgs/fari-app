import { InternationalizationService } from "./internationalization/InternationalizationService";
import { makeLogger } from "./logger/makeLogger";
import { SentryService } from "./sentry/SentryService";

const sentryService = new SentryService();
const logger = makeLogger(sentryService);
const internationalizationService = new InternationalizationService(logger);

export const injections = {
  internationalizationService,
  logger,
  sentryService,
};
