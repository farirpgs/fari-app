import React, { Component } from "react";
import { ErrorReport } from "./ErrorReport";
import * as Sentry from "@sentry/browser";

interface IProps {}

interface IState {
  hasError?: boolean;
  eventId: string;
}

export class ExampleBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { eventId: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorReport eventId={this.state.eventId}></ErrorReport>;
    }

    return this.props.children;
  }
}
