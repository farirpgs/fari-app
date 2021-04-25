import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { AppLink } from "../../../../../../components/AppLink/AppLink";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { ILinkBlock } from "../../../../../../domains/character/types";
import { IBlockComponentProps } from "../../types/IBlockComponentProps";

export function BlockLink(props: IBlockComponentProps<ILinkBlock>) {
  const { advanced } = props;
  return (
    <Box>
      <Grid container spacing={1} justify="space-between" wrap="nowrap">
        <Grid item xs>
          {advanced ? (
            <Box>
              <Typography>
                <ContentEditable
                  border={!props.readonly}
                  data-cy={`${props.dataCy}.value`}
                  readonly={props.readonly}
                  value={props.block.value}
                  onChange={(value) => {
                    props.onValueChange(value);
                  }}
                />
              </Typography>
            </Box>
          ) : (
            <AppLink to={props.block.value} target="_blank">
              {props.block.value}
            </AppLink>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
