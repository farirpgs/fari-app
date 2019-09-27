import Link from "@material-ui/core/Link";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

export const AppLink: React.FC<{ to: string }> = props => {
  return (
    <Link
      component={RouterLink}
      to={props.to}
      style={{
        textDecoration: "none"
      }}
    >
      {props.children}
    </Link>
  );
};
