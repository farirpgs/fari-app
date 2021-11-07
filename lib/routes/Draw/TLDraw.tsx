import Box from "@mui/material/Box";
import { TLDraw, TLDrawDocument, TLDrawProps } from "@tldraw/tldraw";
import React from "react";

export function TLDrawWriter(props: {
  onChange?: (doc: TLDrawDocument) => void;
  tldrawProps?: TLDrawProps;
}) {
  const timeout = React.useRef<any>(false);

  const rDocument = React.useRef<TLDrawDocument>({
    id: "doc1",
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
  });

  const handleChange = React.useCallback((tlstate) => {
    rDocument.current = tlstate.document;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      props.onChange?.(rDocument.current);
    }, 150);
  }, []);

  return (
    <Box position="relative" width="100%" height="600px">
      <TLDraw
        document={rDocument.current}
        onChange={handleChange}
        {...(props.tldrawProps ?? {})}
      />
    </Box>
  );
}

export function TLDrawReader(props: { doc: TLDrawDocument }) {
  if (!props.doc) {
    return null;
  }

  return (
    <Box position="relative" width="100%" height="600px">
      <TLDraw document={props.doc} />
    </Box>
  );
}

export const BlankTLDrawDocument: TLDrawDocument = {
  id: "doc1",
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
