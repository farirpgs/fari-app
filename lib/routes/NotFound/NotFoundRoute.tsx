import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Page } from "../../components/Page/Page";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { Font } from "../../domains/font/Font";

export const NotFoundRoute: React.FC<{}> = () => {
  const logger = useLogger();

  useEffect(() => {
    logger.track("page_not_found");
  }, []);

  return (
    <div>
      <Page sx={{ paddingTop: "2rem" }}>
        <Box display="flex" justifyContent="center" pt="3rem">
          <Typography
            sx={{
              fontSize: "2rem",
              lineHeight: Font.lineHeight(2),
              textAlign: "center",
            }}
          >
            Page Not Found
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          pt="3rem"
          textAlign="center"
        >
          <Typography>
            The page you are trying to access doesn&apos;t exist.{" "}
          </Typography>
          <Typography>Use the menu to get out of the woods!</Typography>
        </Box>
      </Page>
    </div>
  );
};
