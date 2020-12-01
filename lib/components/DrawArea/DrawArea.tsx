import Dialog from "@material-ui/core/Dialog";
import React, { useState } from "react";
import { SlideUpTransition } from "../SlideUpTransition/SlideUpTransition";
import { DrawObjects } from "./DrawObjects";
import { IDrawAreaObjects, useDrawing } from "./hooks/useDrawing";

interface IProps {
  objects: IDrawAreaObjects | undefined;
  readonly: boolean;
  onChange(lines: IDrawAreaObjects): void;
  tokenTitles?: Array<string>;
}

export const DrawArea = React.forwardRef<unknown, IProps>((props, ref) => {
  const [fullScreen, setFullScreen] = useState(false);
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
      {!fullScreen && (
        <DrawObjects
          drawingManager={drawingManager}
          readonly={props.readonly}
          fullScreen={fullScreen}
          onFullScreenChange={setFullScreen}
          controls="bottom"
          tokenTitles={props.tokenTitles}
        />
      )}
      <Dialog
        open={fullScreen}
        fullScreen
        onClose={() => {
          setFullScreen(false);
        }}
        TransitionComponent={SlideUpTransition}
      >
        <DrawObjects
          drawingManager={drawingManager}
          readonly={props.readonly}
          fullScreen={fullScreen}
          onFullScreenChange={setFullScreen}
          controls="top"
          tokenTitles={props.tokenTitles}
        />
      </Dialog>
    </>
  );
});

DrawArea.displayName = "DrawArea";
