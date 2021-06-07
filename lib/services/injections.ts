import { InternationalizationService } from "./internationalization/InternationalizationService";
import { makeLogger } from "./logger/makeLogger";
import { makeSentryService } from "./sentry/SentryService";

const sentryService = makeSentryService();
const logger = makeLogger(sentryService);
const internationalizationService = InternationalizationService(logger);

export const injections = {
  internationalizationService,
  logger,
  sentryService,
};
