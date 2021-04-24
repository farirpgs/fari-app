import React from "react";
import { Layer, Line, Stage, Text } from "react-konva";

interface IProps {
  // objects: IDrawAreaObjects | undefined;
  // readonly: boolean;
  // onChange(lines: IDrawAreaObjects): void;
  // tokenTitles?: Array<string>;
}

interface KonvaLine {
  tool: string;
  points: any[];
}

export const DrawArea = React.forwardRef<unknown, IProps>((props, ref) => {
  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState<KonvaLine[]>([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          <Text text="Just start drawing" x={5} y={30} />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
    </div>
  );
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
