import Link from "@material-ui/core/Link";
import RouterLink from "next/link";
import React from "react";

export const AppLink: React.FC<{ to: string }> = (props) => {
  return (
    <RouterLink href={props.to}>
      <Link
        style={{
          textDecoration: "none",
        }}
      >
        <>{props.children}</>
      </Link>
    </RouterLink>
  );
};
