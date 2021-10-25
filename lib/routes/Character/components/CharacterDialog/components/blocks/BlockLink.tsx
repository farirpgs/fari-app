import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import React from "react";
import { AppLink } from "../../../../../../components/AppLink/AppLink";
import { Delays } from "../../../../../../constants/Delays";
import { ILinkBlock } from "../../../../../../domains/character/types";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";

function isValidLink(link: string): boolean {
  return /^http(s)?:\/\/.*/.test(link) || link === "";
}

export function BlockLink(props: IBlockComponentProps<ILinkBlock>) {
  const { advanced } = props;
  const { t } = useTranslate();
  const [linkState, setLinkState] = useLazyState({
    value: props.block.value,
    onChange: props.onValueChange,
    delay: Delays.field,
  });

  const [linkLabel, setLinkLabel] = useLazyState({
    value: props.block.label,
    onChange: props.onLabelChange,
    delay: Delays.field,
  });

  const linkText =
    props.block.meta?.hasDisplayName && props.block.label !== ""
      ? props.block.label
      : props.block.value;

  const isValid = isValidLink(props.block.value);

  return (
    <Box>
      <Grid container spacing={1} justifyContent="space-between" wrap="nowrap">
        <Grid item xs>
          {advanced ? (
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
                  value={linkState}
                  label={t("character-dialog.label.link")}
                  fullWidth
                  onChange={(e) => {
                    let linkValue = "";
                    if (e.target.value) {
                      linkValue = e.target.value;
                    }
                    setLinkState(linkValue);
                  }}
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
                {props.block.meta?.hasDisplayName && (
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
                    onChange={(e) => {
                      let label = "";
                      if (e.target.value) {
                        label = e.target.value;
                      }
                      setLinkLabel(label);
                    }}
                    variant="standard"
                  />
                )}
              </Box>
            </Box>
          ) : (
            <>
              {isValid && props.block.value !== "" ? (
                <AppLink to={props.block.value} target="_blank">
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
}

BlockLink.displayName = "BlockLink";

export function BlockLinkActions(
  props: IBlockActionComponentProps<ILinkBlock>
) {
  const theme = useTheme();
  const { t } = useTranslate();

  return (
    <>
      <Grid item>
        <Link
          component="button"
          variant="caption"
          className={css({
            color: theme.palette.primary.main,
          })}
          onClick={() => {
            props.onMetaChange({
              ...props.block.meta,
              hasDisplayName: !props.block.meta?.hasDisplayName,
            });
          }}
          underline="hover"
        >
          {props.block.meta.hasDisplayName
            ? t("character-dialog.control.hide-display-name")
            : t("character-dialog.control.show-display-name")}
        </Link>
      </Grid>
    </>
  );
}

BlockLinkActions.displayName = "BlockLinkActions";
