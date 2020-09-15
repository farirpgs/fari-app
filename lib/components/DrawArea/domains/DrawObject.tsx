import {
  IEllipseObject,
  ILineObject,
  IObject,
  IPoint,
  IRectangleObject,
  ObjectType,
} from "../useDrawing";

export class DrawObject {
  static startRectangle(props: { point: IPoint; color: string }): IObject {
    return {
      type: ObjectType.Rectangle,
      color: props.color,
      form: {
        start: props.point,
        end: props.point,
      },
    };
  }

  static continueRectangle(props: {
    object: IRectangleObject;
    point: IPoint;
  }): IObject {
    return {
      ...props.object,
      form: {
        start: props.object.form.start,
        end: props.point,
      },
    };
  }

  static moveRectangle(props: {
    object: IRectangleObject;
    x: number;
    y: number;
  }): IObject {
    return {
      ...props.object,
      form: {
        start: {
          percentX: props.object.form.start.percentX + props.x,
          percentY: props.object.form.start.percentY + props.y,
        },
        end: {
          percentX: props.object.form.end.percentX + props.x,
          percentY: props.object.form.end.percentY + props.y,
        },
      },
    };
  }

  static startEllipse(props: { point: IPoint; color: string }): IObject {
    return {
      type: ObjectType.Ellipse,
      color: props.color,
      form: {
        start: props.point,
        end: props.point,
      },
    };
  }

  static continueEllipse(props: {
    object: IEllipseObject;
    point: IPoint;
  }): IObject {
    return {
      ...props.object,
      form: {
        start: props.object.form.start,
        end: props.point,
      },
    };
  }

  static moveEllipse(props: {
    object: IEllipseObject;
    x: number;
    y: number;
  }): IObject {
    return {
      ...props.object,
      form: {
        start: {
          percentX: props.object.form.start.percentX + props.x,
          percentY: props.object.form.start.percentY + props.y,
        },
        end: {
          percentX: props.object.form.end.percentX + props.x,
          percentY: props.object.form.end.percentY + props.y,
        },
      },
    };
  }

  static startLine(props: { point: IPoint; color: string }): IObject {
    return {
      type: ObjectType.Line,
      color: props.color,
      points: [props.point],
    };
  }

  static continueLine(props: { object: ILineObject; point: IPoint }): IObject {
    return {
      ...props.object,
      points: [...props.object.points, props.point],
    };
  }

  static moveLine(props: {
    object: ILineObject;
    x: number;
    y: number;
  }): IObject {
    return {
      ...props.object,
      points: props.object.points.map((p) => {
        return {
          percentX: p.percentX + props.x,
          percentY: p.percentY + props.y,
        };
      }),
    };
  }
}
