import Fab from "@material-ui/core/Fab";
import React from "react";

export const AppFab: React.FC<{ onClick?: () => void }> = props => {
  return (
    <Fab
      color="primary"
      style={{
        position: "absolute",
        zIndex: 1,
        bottom: "2rem",
        right: "1rem"
      }}
      {...props}
    />
  );
};
