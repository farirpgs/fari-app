"use client";
import { Box, Container, useTheme } from "@mui/material";
import React from "react";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Page } from "../../components/Page/Page";
import { Icons } from "../../domains/Icons/Icons";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { TldrawWriter } from "./TldrawWriterAndReader";

export const DrawRoute: React.FC = () => {
  const { t } = useTranslate();
  const theme = useTheme();

  return (
    <Page sx={{ paddingTop: "2rem" }}>
      <Container maxWidth="lg">
        <Box
          py="1rem"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icons.IllustrationIcon sx={{ fontSize: "3rem" }} color="primary" />
          <FateLabel variant="h4" align="center" color="primary">
            {"Draw"}
          </FateLabel>
        </Box>

        <Box
          border={`1px solid ${theme.palette.divider}`}
          height="60vh"
          position="relative"
          margin="0 auto"
        >
          <TldrawWriter
            state={{
              bindings: {},
              shapes: {},
            }}
          />
        </Box>
      </Container>
    </Page>
  );
};
