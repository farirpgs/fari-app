import Box from "@mui/material/Box";
import { TDDocument, Tldraw, TldrawApp, TldrawProps } from "@tldraw/tldraw";
import React from "react";

export function TldrawWriter(props: {
  onChange?: (doc: TDDocument) => void;
  tldrawProps?: TldrawProps;
}) {
  const timeout = React.useRef<any>(false);

  const rDocument = React.useRef<TDDocument>(BlankTDDocument);

  const handleChange = React.useCallback((tlstate) => {
    rDocument.current = tlstate.document;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      props.onChange?.(rDocument.current);
    }, 150);
  }, []);

  return (
    <Box position="relative" width="100%" height="600px">
      <Tldraw
        showPages={false}
        document={rDocument.current}
        onChange={handleChange}
        {...(props.tldrawProps ?? {})}
      />
    </Box>
  );
}

export function TldrawReader(props: { doc: TDDocument }) {
  if (!props.doc) {
    return null;
  }

  return (
    <Box position="relative" width="100%" height="600px">
      <Tldraw showPages={false} document={props.doc} readOnly />
    </Box>
  );
}

export const BlankTDDocument: TDDocument = {
  id: "doc",
  name: "New Document",
  version: TldrawApp.version,
  assets: {},
  pages: {
    page1: {
      id: "page1",
      shapes: {},
      bindings: {},
    },
  },
  pageStates: {
    page1: {
      id: "page1",
      camera: {
        point: [0, 0],
        zoom: 1,
      },
      selectedIds: [],
    },
  },
};
