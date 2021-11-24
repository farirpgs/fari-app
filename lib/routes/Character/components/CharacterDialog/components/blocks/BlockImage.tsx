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
  previewContentEditable,
} from "../../../../../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../../../../../components/FateLabel/FateLabel";
import { IImageBlock } from "../../../../../../domains/character/types";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { IBlockComponentProps } from "../../types/IBlockComponentProps";

export function BlockImage(props: IBlockComponentProps<IImageBlock> & {}) {
  const { t } = useTranslate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const isLabelVisible =
    !!previewContentEditable({ value: props.block.label }) || props.advanced;

  function handleOnClose() {
    setOpen(false);
  }

  function handleOnOpen() {
    setOpen(true);
  }

  /**
   * Doc: https://apidocs.imgur.com/#de179b6a-3eda-4406-a8d7-1fb06c17cb9c
   * Status: https://status.imgur.com/
   * Example:
   *  curl --location --request POST 'https://api.imgur.com/3/image' \
   *   --header 'Authorization: Client-ID {{clientId}}' \
   *   --form 'image="R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"'
   */
  // async function handleOnImport(files: FileList | null) {
  //   if (files) {
  //     const body = new FormData();
  //     body.append("image", files[0]);

  //     const clientId = "f5bf423182afd45";
  //     const response = await fetch("https://api.imgur.com/3/image", {
  //       method: "POST",
  //       body: body,
  //       headers: {
  //         "Authorization": `Client-ID ${clientId}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     const jsonResponse = response.json();
  //     console.debug("response", jsonResponse);
  //   }
  // }

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
              <FateLabel display="inline">
                <ContentEditable
                  readonly={props.readonly}
                  border={props.advanced}
                  data-cy={`${props.dataCy}.label`}
                  value={props.block.label}
                  onChange={(value) => {
                    props.onLabelChange(value);
                  }}
                />
              </FateLabel>
            </Grid>
          </Grid>
        </Box>
      )}
      <Dialog open={open} onClose={handleOnClose}>
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
                    value={props.block.value}
                    onChange={(event) => {
                      setError(false);
                      props.onValueChange(event.target.value);
                    }}
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
                    {/* <Button color="primary" variant="outlined" component="label">
                {t("character-dialog.image-block.dialog.upload")}
                {renderHiddenUploadInput()}
              </Button> */}
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {renderImage(false)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose} color="primary">
            {t("character-dialog.image-block.dialog.close")}
          </Button>
        </DialogActions>
      </Dialog>

      {renderImage(true)}
      {renderNoImageOrError()}
    </>
  );

  // function renderHiddenUploadInput() {
  //   return (
  //     <input
  //       type="file"
  //       hidden
  //       onChange={(event) => {
  //         handleOnImport(event.target.files);
  //         event.target.value = "";
  //       }}
  //     />
  //   );
  // }

  function renderNoImageOrError() {
    if (props.block.value && !error) {
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
          onClick={() => {
            handleOnOpen();
          }}
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
    if (!props.block.value || error) {
      return null;
    }

    const src = props.block.value;

    return (
      <Box width="100%" mt=".5rem">
        <img
          className={css({
            maxWidth: "100%",
            margin: "0 auto",
            height: "auto",
            display: "flex",
            cursor: clickable ? "pointer" : "inherit",
          })}
          onError={() => {
            setError(true);
          }}
          onClick={clickable ? handleOnOpen : undefined}
          src={src}
          alt={props.block.label}
        />
      </Box>
    );
  }
}
BlockImage.displayName = "BlockImage";
