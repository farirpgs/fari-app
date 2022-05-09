import { InternationalizationService } from "./internationalization/InternationalizationService";
import { makeLiveBlocksClient as makeLiveBlocksClient } from "./liveblocks/makeLiveBlocksClient";
import { makeLogger } from "./logger/makeLogger";
import { makeSentryService } from "./sentry/SentryService";

export function getDefaultInjections() {
  const sentryService = makeSentryService();
  const logger = makeLogger(sentryService);
  const internationalizationService = InternationalizationService(logger);
  const liveBlocksClient = makeLiveBlocksClient();

  return {
    internationalizationService,
    logger,
    sentryService,
    liveBlocksClient,
  };
}

export type IInjections = ReturnType<typeof getDefaultInjections>;
