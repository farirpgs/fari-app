import { Dialog } from "@material-ui/core";
import React, { useState } from "react";
import { SlideUpTransition } from "../SlideUpTransition/SlideUpTransition";
import { DrawObjects } from "./DrawObjects";
import { IObjects } from "./hooks/useDrawing";

interface IProps {
  objects: IObjects;
  readonly: boolean;
  onChange(lines: IObjects): void;
}

export const DrawArea = React.forwardRef<unknown, IProps>((props, ref) => {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <>
      <DrawObjects
        objects={props.objects}
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
        <DrawObjects
          objects={props.objects}
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
