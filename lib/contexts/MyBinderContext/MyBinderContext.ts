import React, { useRef, useState } from "react";

type IManagerCallback = (entity: any) => void | undefined;
export type IFolders = "characters" | "scenes" | "index-card-collections";

export function useMyBinder() {
  const managerCallback = useRef<IManagerCallback | undefined>(undefined);

  const [open, setOpen] = useState(false);
  const [folder, setFolder] = useState<IFolders>();

  function openDialog(
    props: { folder?: IFolders; callback?: IManagerCallback } = {}
  ) {
    setOpen(true);
    setFolder(props.folder);
    managerCallback.current = props.callback;
  }

  function closeDialog() {
    setOpen(false);
    setFolder(undefined);
    managerCallback.current = undefined;
  }

  return {
    state: { open, managerCallback, folder },
    actions: { open: openDialog, close: closeDialog },
  };
}

export const MyBinderContext = React.createContext<
  ReturnType<typeof useMyBinder>
>(undefined as any);
