import { useTheme } from "@material-ui/core/styles";

export const zIndex = {
  splitButton: 1,
};

export function useZIndex() {
  const theme = useTheme();

  return {
    ...theme.zIndex,
    navBar: theme.zIndex.drawer + 1,
    diceFabDie: theme.zIndex.tooltip + 50,
    diceFab: theme.zIndex.tooltip + 100,
  };
}
