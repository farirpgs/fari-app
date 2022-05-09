import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { Font } from "../../domains/font/Font";

export const NotFoundRoute: React.FC<{}> = () => {
  const logger = useLogger();

  useEffect(() => {
    logger.track("page_not_found");
  }, []);

  return (
    <div>
      <Page>
        <PageMeta title="Page Not Found" noIndex />
        <Box display="flex" justifyContent="center" pt="3rem">
          <Typography
            className={css({
              fontSize: "2rem",
              lineHeight: Font.lineHeight(2),
              textAlign: "center",
            })}
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

NotFoundRoute.displayName = "NotFoundRoute";
export default NotFoundRoute;
