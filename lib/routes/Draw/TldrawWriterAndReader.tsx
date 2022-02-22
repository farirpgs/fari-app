import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TDDocument, Tldraw, TldrawApp, TldrawProps } from "@tldraw/tldraw";
import React, { useEffect } from "react";

export function TldrawWriter(props: {
  initialDoc?: TDDocument;
  onChange?: (doc: TDDocument) => void;
  tldrawProps?: TldrawProps;
}) {
  const rDocument = React.useRef<TDDocument>(
    props.initialDoc || makeNewBlankDocument()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      props.onChange?.(JSON.parse(JSON.stringify(rDocument.current)));
    }, 2000);
    return () => {
      props.onChange?.(JSON.parse(JSON.stringify(rDocument.current)));
      clearInterval(interval);
    };
  }, []);

  function handleChange(tlstate: any) {
    rDocument.current = tlstate.document;
  }

  return (
    <Box position="relative" width="100%" height="600px">
      <Tldraw
        showPages={false}
        showMenu={false}
        document={rDocument.current}
        onChange={handleChange}
        {...(props.tldrawProps ?? {})}
      />
    </Box>
  );
}

export function TldrawReader(props: { doc: TDDocument | undefined }) {
  if (!props.doc) {
    return null;
  }

  const safeDocument = JSON.parse(JSON.stringify(props.doc));

  return (
    <Box position="relative" width="100%" height="600px">
      <Tldraw showPages={false} document={safeDocument} readOnly />
    </Box>
  );
}

export function makeNewBlankDocument(): TDDocument {
  return {
    id: "doc",
    name: "New Document",
    version: TldrawApp.version,
    assets: {},
    pages: {
      page: {
        id: "page",
        shapes: {},
        bindings: {},
      },
    },
    pageStates: {
      page: {
        id: "page",
        camera: {
          point: [0, 0],
          zoom: 1,
        },
        selectedIds: [],
      },
    },
  };
}

export class TlDrawErrorBoundary extends React.Component<
  {},
  { hasError: boolean }
> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box>
          <Typography variant="h6" color="textSecondary">
            The drawing area encountered an error.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            We are sorry for the inconvenience. The error information was sent
            to the developer and we will investigate to stabilize this feature
            as soon as possible.
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}
