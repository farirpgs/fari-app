import { makeFariFirebase } from "./firebase/firebase";
import { InternationalizationService } from "./internationalization/InternationalizationService";
import { makeLogger } from "./logger/makeLogger";
import { makeSentryService } from "./sentry/SentryService";

export function getDefaultInjections() {
  const sentryService = makeSentryService();
  const logger = makeLogger(sentryService);
  const internationalizationService = InternationalizationService(logger);
  const fariFirebase = makeFariFirebase();
  return { internationalizationService, logger, sentryService, fariFirebase };
}

export type IInjections = ReturnType<typeof getDefaultInjections>;
