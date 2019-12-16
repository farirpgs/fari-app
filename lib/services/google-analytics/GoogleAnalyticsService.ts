import ReactGA from "react-ga";
import { ISendEventParameters } from "./types/ISendEventParameters";
import { LoggerService } from "../logger/LoggerSerivce";

export class GoogleAnalyticsService {
  private readonly newProperty = "UA-150306816-1";

  constructor(private logger: LoggerService) {
    ReactGA.initialize(this.newProperty);
  }
  sendPageView() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  sendEvent(parameters: ISendEventParameters) {
    const event = {
      category: parameters.category,
      action: parameters.action,
      label: parameters.label,
      value: parameters.value
    };
    if (location.host !== "localhost:1234") {
    }
    ReactGA.event(event);

    const loggerEvent = `${event.category}.${event.action}`;
    const loggerValue = event.value !== undefined ? `(${event.value})` : "";
    this.logger.info(`Event: ${loggerEvent} ${loggerValue}`, event);
  }
}
