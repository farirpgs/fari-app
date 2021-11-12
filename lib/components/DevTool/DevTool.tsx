import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import React from "react";
import { env } from "../../constants/env";

export const DevTool: React.FC<{
  data: any;
}> = (props) => {
  if (env.isDev) {
    return null;
  }

  return (
    <Box pt="2rem" pb="2rem">
      <Divider />
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
      <Box>{props.children}</Box>
    </Box>
  );
};
DevTool.displayName = "DevTool";
