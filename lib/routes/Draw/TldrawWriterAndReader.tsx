import Box from "@mui/material/Box";
import { TDDocument, Tldraw, TldrawApp, TldrawProps } from "@tldraw/tldraw";
import React, { useEffect } from "react";

export function TldrawWriter(props: {
  onChange?: (doc: TDDocument) => void;
  tldrawProps?: TldrawProps;
}) {
  const rDocument = React.useRef<TDDocument>(makeNewBlankDocument());
  const [doc, setDoc] = React.useState<TDDocument>(rDocument.current);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDoc = JSON.parse(JSON.stringify(rDocument.current));
      props.onChange?.(newDoc);
      setDoc(newDoc);
    }, 2000);
    return () => {
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
        document={doc}
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
