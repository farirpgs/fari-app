import { Box, Divider } from "@material-ui/core";
import React from "react";

export const DevTool: React.FC<{
  data: any;
}> = (props) => {
  return (
    <Box pt="0rem" pb="2rem">
      <Divider></Divider>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
      <Box>{props.children}</Box>
    </Box>
  );
};
DevTool.displayName = "DevTool";
