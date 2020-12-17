import Link from "@material-ui/core/Link";
// import { Link as RouterLink } from "react-router-dom";
import RouterLink from "next/link";
import React from "react";

export const AppLink: React.FC<{ to: string }> = (props) => {
  return (
    <Link
      component={RouterLink}
      href={props.to}
      style={{
        textDecoration: "none",
      }}
    >
      <>{props.children}</>
    </Link>
  );
};
