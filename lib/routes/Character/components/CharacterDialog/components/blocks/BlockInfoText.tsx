import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import React, { useContext } from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { IInfoTextBlock } from "../../../../../../domains/character/types";
import { MiniThemeContext } from "../../MiniThemeContext";
import { IBlockComponentProps } from "../../types/IBlockComponentProps";

export function BlockInfoText(
  props: IBlockComponentProps<IInfoTextBlock> & {}
) {
  const miniTheme = useContext(MiniThemeContext);
  return (
    <>
      <Box>
        <Box>
          <FormHelperText
            className={css({
              fontFamily: miniTheme.infoTextFontFamily,
              fontSize: `${miniTheme.infoTextFontSize}rem`,
              fontWeight: miniTheme.infoTextFontWeight,
            })}
          >
            <ContentEditable
              readonly={props.readonly || !props.advanced}
              border={props.advanced}
              dataCy={`${props.dataCy}.value`}
              value={props.block.value}
              onChange={(value) => {
                props.onValueChange(value);
              }}
            />
          </FormHelperText>
        </Box>
      </Box>
    </>
  );
}
BlockInfoText.displayName = "BlockInfoText";
