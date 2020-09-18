import { Dialog } from "@material-ui/core";
import React, { useState } from "react";
import { SlideUpTransition } from "../SlideUpTransition/SlideUpTransition";
import { DrawObjects } from "./DrawObjects";
import { IDrawAreaObjects } from "./hooks/useDrawing";

interface IProps {
  objects: IDrawAreaObjects | undefined;
  readonly: boolean;
  onChange(lines: IDrawAreaObjects): void;
  tokenTitles?: Array<string | undefined>;
}

export const DrawArea = React.forwardRef<unknown, IProps>((props, ref) => {
  const [fullScreen, setFullScreen] = useState(false);
  if (!props.objects) {
    return null;
  }
  return (
    <>
      {!fullScreen && (
        <DrawObjects
          objects={props.objects}
          readonly={props.readonly}
          fullScreen={fullScreen}
          onChange={props.onChange}
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
          objects={props.objects}
          readonly={props.readonly}
          fullScreen={fullScreen}
          onChange={props.onChange}
          onFullScreenChange={setFullScreen}
          controls="top"
          tokenTitles={props.tokenTitles}
        />
      </Dialog>
    </>
  );
});

DrawArea.displayName = "DrawArea";
