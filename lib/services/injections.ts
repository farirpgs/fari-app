import { InternationalizationService } from "./internationalization/InternationalizationService";
import { makeLogger } from "./logger/makeLogger";
import { makeSentryService } from "./sentry/SentryService";

export function getDefaultInjections() {
  const sentryService = makeSentryService();
  const logger = makeLogger(sentryService);
  const internationalizationService = InternationalizationService(logger);
  return { internationalizationService, logger, sentryService };
}

export type IInjections = ReturnType<typeof getDefaultInjections>;
