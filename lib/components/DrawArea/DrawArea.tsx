import React from "react";
import { DrawObjects } from "./DrawObjects";
import { IDrawAreaObjects, useDrawing } from "./hooks/useDrawing";

interface IProps {
  objects: IDrawAreaObjects | undefined;
  readonly: boolean;
  onChange(lines: IDrawAreaObjects): void;
  tokenTitles?: Array<string>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DrawArea = React.forwardRef<unknown, IProps>((props, ref) => {
  const drawingManager = useDrawing({
    objects: props.objects,
    readonly: props.readonly,
    onChange: props.onChange,
  });

  if (!props.objects) {
    return null;
  }

  return (
    <>
      <DrawObjects
        drawingManager={drawingManager}
        readonly={props.readonly}
        controls="top"
        tokenTitles={props.tokenTitles}
      />
    </>
  );
});

DrawArea.displayName = "DrawArea";
