import * as Sentry from "@sentry/browser";
import React, { Component } from "react";
import { ErrorReport } from "./ErrorReport";

interface IProps {}

interface IState {
  hasError?: boolean;
  eventId: string | null;
}

export class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { eventId: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorReport eventId={this.state.eventId ?? ""} />;
    }

    return this.props.children;
  }
}
