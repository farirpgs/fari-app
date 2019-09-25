import { Paper } from "@material-ui/core";
import React from "react";

export const AppPaper: React.FC<{}> = props => {
  return <Paper style={{ padding: "1rem" }}>{props.children}</Paper>;
};
