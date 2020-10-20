import ReactGA from "react-ga";
import { ILogger } from "../logger/makeLogger";
import { ISendEventParameters } from "./types/ISendEventParameters";

export class GoogleAnalyticsService {
  private readonly newProperty = "UA-150306816-1";

  constructor(private logger: ILogger) {
    if (process.env.JEST_WORKER_ID !== undefined) {
      return;
    }
    ReactGA.initialize(this.newProperty);
  }
  sendPageView() {
    if (process.env.JEST_WORKER_ID !== undefined) {
      return;
    }
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  sendEvent(parameters: ISendEventParameters) {
    if (process.env.JEST_WORKER_ID !== undefined) {
      return;
    }
    const event = {
      category: parameters.category,
      action: parameters.action,
      label: parameters.label,
      value: parameters.value,
    };
    ReactGA.event(event);

    const loggerEvent = `${event.category}.${event.action}`;
    const loggerValue = event.value !== undefined ? `(${event.value})` : "";
    this.logger.info(`Event: ${loggerEvent} ${loggerValue}`, { event });
  }
}
