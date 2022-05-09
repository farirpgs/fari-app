import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export function useResponsiveValue<T>(props: {
  xl: T;
  lg: T;
  md: T;
  sm: T;
  xs: T;
}): T {
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
