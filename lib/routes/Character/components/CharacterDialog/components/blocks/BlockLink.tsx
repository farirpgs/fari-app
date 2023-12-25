import { Box, Grid, Link, TextField, useTheme } from "@mui/material";
import React from "react";
import { AppLink } from "../../../../../../components/AppLink/AppLink";
import { Delays } from "../../../../../../constants/Delays";
import { ILinkBlock } from "../../../../../../domains/character/types";
import { useEvent } from "../../../../../../hooks/useEvent/useEvent";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import { IBlockHandlers } from "../../types/IBlockComponentProps";

function isValidLink(link: string = ""): boolean {
  return /^http(s)?:\/\/.*/.test(link) || link === "";
}

export const BlockLink = React.memo(
  (
    props: {
      label: string | undefined;
      value: string | undefined;
      hasDisplayName: boolean | undefined;
      advanced: boolean;
      readonly: boolean | undefined;
      dataCy?: string;
    } & IBlockHandlers<ILinkBlock>,
  ) => {
    const { t } = useTranslate();
    const [link, setLink] = useLazyState({
      value: props.value,
      onChange: props.onValueChange,
      delay: Delays.field,
    });

    const [linkLabel, setLinkLabel] = useLazyState({
      value: props.label,
      onChange: props.onLabelChange,
      delay: Delays.field,
    });

    const linkText =
      props.hasDisplayName && props.label !== "" ? props.label : props.value;

    const isValid = isValidLink(props.value);

    const handleLinkChange = useEvent(
      (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setLink(e.target.value || "");
      },
    );

    const handleLinkLabelChange = useEvent(
      (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setLinkLabel(e.target.value || "");
      },
    );

    return (
      <Box>
        <Grid
          container
          spacing={1}
          justifyContent="space-between"
          wrap="nowrap"
        >
          <Grid item xs>
            {props.advanced ? (
              <Box>
                <Box mb=".5rem">
                  <TextField
                    InputProps={{
                      readOnly: props.readonly,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="https://..."
                    data-cy={`${props.dataCy}.value`}
                    value={link}
                    label={t("character-dialog.label.link")}
                    fullWidth
                    onChange={handleLinkChange}
                    error={!isValid}
                    helperText={
                      isValid
                        ? undefined
                        : t("character-dialog.helper-text.invalid-link")
                    }
                    variant="standard"
                  />
                </Box>
                <Box>
                  {props.hasDisplayName && (
                    <TextField
                      InputProps={{
                        readOnly: props.readonly,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={linkLabel}
                      label={t("character-dialog.block-type.link.display-name")}
                      fullWidth
                      onChange={handleLinkLabelChange}
                      variant="standard"
                    />
                  )}
                </Box>
              </Box>
            ) : (
              <>
                {isValid && props.value !== "" ? (
                  <AppLink
                    to={props.value}
                    target="_blank"
                    sx={{
                      lineHeight: "normal",
                    }}
                  >
                    {linkText}
                  </AppLink>
                ) : (
                  linkText
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  },
);

BlockLink.displayName = "BlockLink";

export const BlockLinkActions = React.memo(
  (
    props: {
      hasDisplayName: boolean | undefined;
    } & IBlockHandlers<ILinkBlock>,
  ) => {
    const theme = useTheme();
    const { t } = useTranslate();

    const handleShowHideDisplayName = useEvent(() => {
      props.onMetaChange((prev) => ({
        ...prev,
        hasDisplayName: !prev?.hasDisplayName,
      }));
    });

    return (
      <>
        <Grid item>
          <Link
            component="button"
            variant="caption"
            sx={{
              color: theme.palette.primary.main,
            }}
            onClick={handleShowHideDisplayName}
            underline="hover"
          >
            {props.hasDisplayName
              ? t("character-dialog.control.hide-display-name")
              : t("character-dialog.control.show-display-name")}
          </Link>
        </Grid>
      </>
    );
  },
);

BlockLinkActions.displayName = "BlockLinkActions";
