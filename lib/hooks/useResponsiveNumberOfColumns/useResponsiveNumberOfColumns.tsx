import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export function useResponsiveNumberOfColumns(props: {
  xl: number;
  lg: number;
  md: number;
  sm: number;
  xs: number;
}): number {
  const theme = useTheme();
  const isXlAndUp = useMediaQuery(theme.breakpoints.up("xl"));
  const isLgAndUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMDAndUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmAndUp = useMediaQuery(theme.breakpoints.up("sm"));

  const numberOfColumnsForCards = isXlAndUp
    ? props.xl
    : isLgAndUp
    ? props.lg
    : isMDAndUp
    ? props.md
    : isSmAndUp
    ? props.sm
    : props.xs;

  return numberOfColumnsForCards;
}
