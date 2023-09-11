import { Box, FormHelperText } from "@mui/material";
import React, { useContext } from "react";
import { ContentEditable } from "../../../../../../components/ContentEditable/ContentEditable";
import { IInfoTextBlock } from "../../../../../../domains/character/types";
import { useEvent } from "../../../../../../hooks/useEvent/useEvent";
import { MiniThemeContext } from "../../MiniThemeContext";
import { IBlockHandlers } from "../../types/IBlockComponentProps";

export const BlockInfoText = React.memo(
  (
    props: {
      value: string | undefined;
      advanced: boolean;
      readonly: boolean | undefined;
      dataCy?: string;
    } & IBlockHandlers<IInfoTextBlock>,
  ) => {
    const miniTheme = useContext(MiniThemeContext);

    const handleValueChange = useEvent((value) => {
      props.onValueChange(value);
    });

    return (
      <>
        <Box>
          <Box>
            <FormHelperText
              sx={{
                fontFamily: miniTheme.infoTextFontFamily,
                fontSize: `${miniTheme.infoTextFontSize}rem`,
                fontWeight: miniTheme.infoTextFontWeight,
              }}
            >
              <ContentEditable
                readonly={props.readonly || !props.advanced}
                border={props.advanced}
                dataCy={`${props.dataCy}.value`}
                value={props.value || ""}
                onChange={handleValueChange}
              />
            </FormHelperText>
          </Box>
        </Box>
      </>
    );
  },
);
