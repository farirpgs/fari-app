import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import React, { useEffect, useRef, useState } from "react";
import { Page } from "../Page/Page";

export function LoadingRoute(props: { pathname: string }) {
  const [fadeIn, setFadeIn] = useState(false);
  const timeout = useRef<any | undefined>(undefined);

  useEffect(() => {
    timeout.current = setTimeout(() => {
      setFadeIn(true);
    }, 400);

    return () => {
      clearTimeout(timeout.current);
    };
  });

  return (
    <Page hideHeaderLogo={props.pathname === "/"}>
      <Fade in={fadeIn}>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        </Container>
      </Fade>
    </Page>
  );
}
