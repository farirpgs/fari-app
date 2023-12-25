import { Box, CircularProgress, Container, Fade } from "@mui/material";
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
    <Page
      hideHeaderLogo={props.pathname === "/"}
      sx={{ paddingTop: "20rem", paddingBottom: "50vh" }}
    >
      <Fade in={fadeIn}>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center">
            <CircularProgress color="secondary" />
          </Box>
        </Container>
      </Fade>
    </Page>
  );
}
