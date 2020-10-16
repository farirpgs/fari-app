import { Box, Typography } from "@material-ui/core";
import { css } from "emotion";
import React, { useEffect } from "react";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { Font } from "../../domains/font/Font";

export const NotFoundRoute: React.FC<{}> = (props) => {
  const logger = useLogger();

  useEffect(() => {
    logger.info("Route:NotFound");
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
            <p>The page you are trying to access doesn&apos;t exist.</p>
            <p>Use the menu to get out of the woods.</p>
          </Typography>
        </Box>
      </Page>
    </div>
  );
};

NotFoundRoute.displayName = "NotFoundRoute";
