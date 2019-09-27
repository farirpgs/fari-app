import LinearProgress from "@material-ui/core/LinearProgress";
import React from "react";

export const AppProgress: React.FC<{}> = props => {
  return (
    <LinearProgress
      style={{
        position: "absolute",
        top: "4.2rem",
        left: "0",
        height: "0.4rem",
        width: "100%"
      }}
    />
  );
};
