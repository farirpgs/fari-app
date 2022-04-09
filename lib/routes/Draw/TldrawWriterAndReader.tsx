import { LiveMap } from "@liveblocks/client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { TDBinding, TDShape, TldrawApp } from "@tldraw/tldraw";
import { Tldraw, TldrawProps } from "@tldraw/tldraw";
import React, { useEffect } from "react";

export type IDrawingAreaState = {
  shapes: Record<string, TDShape>;
  bindings: Record<string, TDBinding>;
};

export type IDrawingAreaInternalState = {
  shapes: LiveMap<string, TDShape>;
  bindings: LiveMap<string, TDBinding>;
};

export function TldrawWriter(props: {
  state: IDrawingAreaState;
  onChange?: (state: IDrawingAreaState) => void;
  tldrawProps?: TldrawProps;
}) {
  const shapesRef = React.useRef<LiveMap<string, TDShape>>(
    new LiveMap<string, TDShape>()
  );
  const bindingsRef = React.useRef<LiveMap<string, TDBinding>>(
    new LiveMap<string, TDBinding>()
  );
  const dirtyRef = React.useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      change();
    }, 2000);
    return () => {
      change();
      clearInterval(interval);
    };
  }, []);

  function change() {
    if (dirtyRef.current) {
      const shapesObject = Object.fromEntries(shapesRef.current.entries());
      const bindingsObject = Object.fromEntries(bindingsRef.current.entries());
      console.log("shapesObject", shapesObject);
      console.log("bindingsObject", bindingsObject);
      props.onChange?.({
        shapes: shapesObject,
        bindings: bindingsObject,
      });
    }
    dirtyRef.current = false;
  }

  function handleTldrawMount(app: TldrawApp) {
    if (props.state.shapes && props.state.bindings) {
      app?.replacePageContent(props.state.shapes, props.state.bindings, {});
    }
  }

  function handleTldrawChange(
    app: TldrawApp,
    shapes: Record<string, TDShape | undefined>,
    bindings: Record<string, TDBinding | undefined>
  ) {
    dirtyRef.current = true;
    console.log("change", shapes);
    Object.entries(shapes).forEach(([id, shape]) => {
      if (!shape) {
        shapesRef.current.delete(id);
      } else {
        shapesRef.current.set(shape.id, shape);
      }
    });

    Object.entries(bindings).forEach(([id, binding]) => {
      if (!binding) {
        bindingsRef.current.delete(id);
      } else {
        bindingsRef.current.set(binding.id, binding);
      }
    });
  }

  return (
    <Box position="relative" width="100%" height="600px">
      <Tldraw
        showPages={false}
        showMenu={false}
        onChangePage={(app, shapes, bindings) => {
          handleTldrawChange(app, shapes, bindings);
        }}
        onMount={(app) => {
          handleTldrawMount(app);
        }}
        {...(props.tldrawProps ?? {})}
      />
    </Box>
  );
}

export function TldrawReader(props: { state: IDrawingAreaState }) {
  const [app, setApp] = React.useState<TldrawApp>();

  useEffect(() => {
    if (props.state.shapes && props.state.bindings) {
      app?.replacePageContent(props.state.shapes, props.state.bindings, {});
    }
  }, [app, props.state.shapes, props.state.bindings]);

  return (
    <Box position="relative" width="100%" height="600px">
      <Tldraw
        onMount={(app) => {
          setApp(app);
        }}
        showPages={false}
        readOnly
      />
    </Box>
  );
}

export class TlDrawErrorBoundary extends React.Component<
  {},
  { hasError: boolean }
> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
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
