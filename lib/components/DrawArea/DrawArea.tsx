import React from "react";
import { IDrawAreaObjects } from "./hooks/useDrawing";

interface IProps {
  objects: IDrawAreaObjects | undefined;
  readonly: boolean;
  onChange(lines: IDrawAreaObjects): void;
  tokenTitles?: Array<string>;
}

interface KonvaLine {
  tool: string;
  points: any[];
}
// const pos = e.target.getStage().getPointerPosition();

export const DrawArea = React.forwardRef<unknown, IProps>((props, ref) => {
  return <></>;
  // const drawingManager = useDrawing({
  //   objects: props.objects,
  //   readonly: props.readonly,
  //   onChange: props.onChange,
  // });
  // if (!props.objects) {
  //   return null;
  // }
  // return (
  //   <>
  //     <DrawObjects
  //       drawingManager={drawingManager}
  //       readonly={props.readonly}
  //       controls="top"
  //       tokenTitles={props.tokenTitles}
  //     />
  //   </>
  // );
});

DrawArea.displayName = "DrawArea";
