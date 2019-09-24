import Fab from "@material-ui/core/Fab";
import React from "react";

export const AppFab: React.FC<{
  onClick?: () => void;
  variant?: "round" | "extended";
}> = props => {
  return (
    <Fab
      color="primary"
      variant={props.variant}
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
