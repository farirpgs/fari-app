import { SvgIconProps } from "@material-ui/core";
import {
  IEllipseObject,
  ILineObject,
  IObject,
  IPoint,
  IRectangleObject,
  ITokenObject,
  ObjectType,
} from "../hooks/useDrawing";

export class DrawObjectFactory {
  public static TokenSize = {
    width: 8,
    height: 8,
  };
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
          x: props.object.form.start.x + props.x,
          y: props.object.form.start.y + props.y,
        },
        end: {
          x: props.object.form.end.x + props.x,
          y: props.object.form.end.y + props.y,
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
          x: props.object.form.start.x + props.x,
          y: props.object.form.start.y + props.y,
        },
        end: {
          x: props.object.form.end.x + props.x,
          y: props.object.form.end.y + props.y,
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
          x: p.x + props.x,
          y: p.y + props.y,
        };
      }),
    };
  }

  static startToken(props: {
    point: IPoint;
    color: string;
    Token: React.FC<SvgIconProps>;
  }): IObject {
    return {
      type: ObjectType.Token,
      color: props.color,
      Token: props.Token,
      point: {
        x: props.point.x - this.TokenSize.width / 2,
        y: props.point.y - this.TokenSize.height / 2,
      },
    };
  }

  static moveToken(props: {
    object: ITokenObject;
    x: number;
    y: number;
  }): IObject {
    return {
      ...props.object,
      point: {
        x: props.object.point.x + props.x,
        y: props.object.point.y + props.y,
      },
    };
  }
}
