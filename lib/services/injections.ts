import { makeLogger } from "./logger/makeLogger";
import { makeSentryService } from "./sentry/SentryService";

export function getDefaultInjections() {
  const sentryService = makeSentryService();
  const logger = makeLogger(sentryService);

  return {
    logger,
    sentryService,
  };
}

export type IInjections = ReturnType<typeof getDefaultInjections>;
