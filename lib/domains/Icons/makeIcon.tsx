import { Theme } from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import React from "react";

export function makeIcon(options: {
  svg: (theme: Theme) => JSX.Element;
  name: string;
}) {
  type IProps = SvgIconProps & {};

  const useStyles = makeStyles({}, { name: `Atoms.Icons.${options.name}` });

  const IconComponent = React.forwardRef<SVGSVGElement, IProps>(
    (props, ref) => {
      const { className, rotate, ...rest } = props;
      const classes = useStyles(props);
      const theme = useTheme();

      return (
        <SvgIcon className={className} {...rest} ref={ref}>
          {options.svg(theme)}
        </SvgIcon>
      );
    }
  );

  IconComponent.displayName = `Icons.${options.name}`;
  return IconComponent;
}
