import { useTheme } from "@material-ui/core/styles";

export const zIndex = {
  splitButton: 1,
};

export function useZIndex() {
  const theme = useTheme();

  return {
    ...theme.zIndex,
    diceModal: theme.zIndex.tooltip + 50,
  };
}
