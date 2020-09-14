import { Dialog } from "@material-ui/core";
import React, { useState } from "react";
import { SlideUpTransition } from "../SlideUpTransition/SlideUpTransition";
import { DrawLines } from "./DrawLines";
import { ILines } from "./useDrawing";

interface IProps {
  lines: ILines;
  readonly: boolean;
  onChange(lines: ILines): void;
}

export const DrawArea = React.forwardRef<unknown, IProps>((props, ref) => {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <>
      <DrawLines
        lines={props.lines}
        readonly={props.readonly}
        fullScreen={fullScreen}
        onChange={props.onChange}
        onFullScreenChange={setFullScreen}
        controls="bottom"
      />
      <Dialog
        open={fullScreen}
        fullScreen
        onClose={() => {
          setFullScreen(false);
        }}
        TransitionComponent={SlideUpTransition}
      >
        <DrawLines
          lines={props.lines}
          readonly={props.readonly}
          fullScreen={fullScreen}
          onChange={props.onChange}
          onFullScreenChange={setFullScreen}
          controls="top"
        />
      </Dialog>
    </>
  );
});

DrawArea.displayName = "DrawArea";
