import Fab from "@material-ui/core/Fab";
import React from "react";

export const AppFab: React.FC<{ onClick?: () => void }> = props => {
  return (
    <Fab
      color="primary"
      style={{
        position: "fixed",
        zIndex: 1,
        bottom: "5rem",
        right: "1rem"
      }}
      {...props}
    />
  );
};
