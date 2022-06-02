import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import {
  ContentEditable,
  previewContentEditable
} from "../../../../../../components/ContentEditable/ContentEditable";
import { IImageBlock } from "../../../../../../domains/character/types";
import { useEvent } from "../../../../../../hooks/useEvent/useEvent";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { IBlockHandlers } from "../../types/IBlockComponentProps";
import { ThemedLabel } from "../ThemedLabel";

export const BlockImage = React.memo(
  (
    props: {
      label: string | undefined;
      value: string | undefined;
      advanced: boolean;
      readonly: boolean | undefined;
      dataCy?: string;
    } & IBlockHandlers<IImageBlock>
  ) => {
    const { t } = useTranslate();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const isLabelVisible =
      !!previewContentEditable({ value: props.label }) || props.advanced;

    const handleValueChange = useEvent(
      (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setError(false);
        props.onValueChange(event.target.value);
      }
    );

    const handleLabelChange = useEvent((value) => {
      props.onLabelChange(value);
    });

    const handleModalDialogOpen = useEvent(() => {
      setOpen(false);
    });

    const handleModalDialogClose = useEvent(() => {
      setOpen(true);
    });

    const handleError = useEvent(() => {
      setError(true);
    });

    return (
      <>
        {isLabelVisible && (
          <Box>
            <Grid
              container
              spacing={1}
              justifyContent="space-between"
              wrap="nowrap"
            >
              <Grid item xs>
                <ThemedLabel>
                  <ContentEditable
                    readonly={props.readonly}
                    border={props.advanced}
                    data-cy={`${props.dataCy}.label`}
                    value={props.label || ""}
                    onChange={handleLabelChange}
                  />
                </ThemedLabel>
              </Grid>
            </Grid>
          </Box>
        )}
        <Dialog open={open} onClose={handleModalDialogOpen}>
          <DialogTitle>
            {t("character-dialog.image-block.dialog.title")}
          </DialogTitle>
          <DialogContent>
            {!props.readonly && (
              <>
                <DialogContentText>
                  {t("character-dialog.image-block.dialog.description")}
                </DialogContentText>
                <Grid
                  container
                  wrap="nowrap"
                  justifyContent="space-around"
                  spacing={2}
                  alignItems="center"
                >
                  <Grid item xs>
                    <TextField
                      autoFocus
                      margin="dense"
                      value={props.value}
                      onChange={handleValueChange}
                      label={t(
                        "character-dialog.image-block.dialog.image-url-label"
                      )}
                      fullWidth
                      variant="standard"
                    />
                  </Grid>
                  {false && (
                    <Grid item>
                      <Button
                        color="primary"
                        variant="outlined"
                        component="a"
                        href="https://imgur.com/upload"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("character-dialog.image-block.dialog.upload")}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </>
            )}

            {renderImage(false)}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalDialogOpen} color="primary">
              {t("character-dialog.image-block.dialog.close")}
            </Button>
          </DialogActions>
        </Dialog>

        {renderImage(true)}
        {renderNoImageOrError()}
      </>
    );

    function renderNoImageOrError() {
      if (props.value && !error) {
        return null;
      }

      return (
        <Box width="100%" mt=".5rem">
          <Box
            width="100%"
            height="4rem"
            className={css({
              cursor: "pointer",
              border: `2px dashed ${
                error ? theme.palette.error.light : theme.palette.divider
              }`,
            })}
            onClick={handleModalDialogClose}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              className={css({ height: "100%" })}
            >
              <Grid item>
                <Typography
                  color={error ? "error" : "textSecondary"}
                  variant="body2"
                >
                  {error
                    ? t("character-dialog.image-block.dialog.error")
                    : t("character-dialog.image-block.dialog.add-image")}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      );
    }

    function renderImage(clickable: boolean) {
      if (!props.value || error) {
        return null;
      }

      const src = props.value;

      return (
        <Box width="100%" mt=".5rem">
          <img
            className={css({
              maxWidth: "100%",
              maxHeight: open ? undefined : "250px",
              margin: "0 auto",
              height: "auto",
              display: "flex",
              cursor: clickable ? "pointer" : "inherit",
            })}
            onError={handleError}
            onClick={clickable ? handleModalDialogClose : undefined}
            src={src}
            alt={props.label}
          />
        </Box>
      );
    }
  }
);
BlockImage.displayName = "BlockImage";
