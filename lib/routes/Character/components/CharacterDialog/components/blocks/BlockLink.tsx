import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import useTheme from "@material-ui/core/styles/useTheme";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { AppLink } from "../../../../../../components/AppLink/AppLink";
import { ILinkBlock } from "../../../../../../domains/character/types";
import { useLazyState } from "../../../../../../hooks/useLazyState/useLazyState";
import { useTranslate } from "../../../../../../hooks/useTranslate/useTranslate";
import {
  IBlockActionComponentProps,
  IBlockComponentProps,
} from "../../types/IBlockComponentProps";

export function BlockLink(props: IBlockComponentProps<ILinkBlock>) {
  const { advanced } = props;
  const { t } = useTranslate();
  const [linkState, setLinkState] = useLazyState({
    value: props.block.value,
    onChange: props.onValueChange,
    delay: 750,
  });

  const isEditNameVisible = Boolean(props.block.meta?.editName);

  return (
    <Box>
      <Grid container spacing={1} justify="space-between" wrap="nowrap">
        <Grid item xs>
          {advanced ? (
            <Box>
              <TextField
                InputProps={{
                  readOnly: props.readonly,
                }}
                data-cy={`${props.dataCy}.value`}
                value={linkState}
                onChange={(e) => {
                  let linkValue = "";
                  if (e.target.value) {
                    linkValue = e.target.value;
                  }
                  setLinkState(linkValue);
                }}
                label={t("character-dialog.label.link")}
                fullWidth
              />
              {isEditNameVisible && (
                <TextField
                  InputProps={{
                    readOnly: props.readonly,
                  }}
                  value={props.block.meta.displayName || ""}
                  onChange={(e) => {
                    let name = "";
                    if (e.target.value) {
                      name = e.target.value;
                    }
                    props.onMetaChange({
                      ...props.block.meta,
                      displayName: name,
                    });
                  }}
                  label={t("character-dialog.label.display-name")}
                  fullWidth
                />
              )}
            </Box>
          ) : (
            <AppLink to={props.block.value} target="_blank">
              {isEditNameVisible && props.block.meta?.displayName
                ? props.block.meta?.displayName
                : props.block.value}
            </AppLink>
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
              editName: !Boolean(props.block.meta.editName),
              displayName: "",
            });
          }}
        >
          {props.block.meta.editName
            ? t("character-dialog.control.hide-edit-name")
            : t("character-dialog.control.show-edit-name")}
        </Link>
      </Grid>
    </>
  );
}

BlockLinkActions.displayName = "BlockLinkActions";
