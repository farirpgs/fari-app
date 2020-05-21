import { useMediaQuery } from "@material-ui/core";
import produce from "immer";
import React, { useState } from "react";

interface IState {
  darkMode: boolean;
}

export function useStoreInternal() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [state, setState] = useState<IState>({
    darkMode: prefersDarkMode,
  });

  function setDarkMode(darkMode: boolean) {
    setState(
      produce((draft: IState) => {
        draft.darkMode = darkMode;
      })
    );
  }

  return {
    state: state,
    actions: { setDarkMode },
  };
}

export const StoreContext = React.createContext<
  ReturnType<typeof useStoreInternal>
>({
  state: {
    darkMode: false,
  },
  actions: { setDarkMode: () => undefined },
});
