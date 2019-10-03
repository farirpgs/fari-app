import React from "react";
import { CircularProgress } from "@material-ui/core";

export const AppCircularProgress: React.FC<{}> = props => {
  return (
    <div className="row center-xs">
      <div className="col-xs">
        <CircularProgress></CircularProgress>
      </div>
    </div>
  );
};
