import { Theme, useTheme } from "@mui/material/styles";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import React from "react";

export function makeIcon(options: {
  svg: (theme: Theme) => JSX.Element;
  name: string;
}) {
  type IProps = SvgIconProps & {};

  const IconComponent = React.forwardRef<SVGSVGElement, IProps>(
    (props, ref) => {
      const { className, ...rest } = props;
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
