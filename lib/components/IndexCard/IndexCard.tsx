import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  TextField,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { css } from "emotion";
import { default as React, useRef, useState } from "react";
import { ContentEditable } from "../ContentEditable/ContentEditable";

export const IndexCard: React.FC<{
  title: string;
  content: string;
  checkboxes: Array<boolean>;
  consequences: Array<string>;

  onTitleChange(value: string): void;
  onContentChange(value: string): void;
  onCheckboxChange(index: number, value: boolean): void;
  onConsequenceChange(index: number, value: string): void;
  onAddCheckbox(amount: number): void;
  onAddConsequence(amount: number): void;
  onRemove(): void;
  onReset(): void;

  disabled?: boolean;
}> = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const $menu = useRef(undefined);
  const shouldRenderCheckboxesOrConsequences =
    props.checkboxes.length > 0 || props.consequences.length > 0;
  return (
    <Paper elevation={undefined}>
      <Box bgcolor="#fff">
        <Box
          className={css({
            fontSize: "1.5rem",
            width: "100%",
            padding: "0.5rem 0",
            borderBottom: "1px solid #f0a4a4",
          })}
        >
          <Box p="1rem">
            <Grid container spacing={2} justify="space-between">
              <Grid item xs>
                <ContentEditable
                  value={props.title}
                  disabled={props.disabled}
                  autoFocus
                  onChange={props.onTitleChange}
                ></ContentEditable>
              </Grid>
              <Grid item>
                <IconButton
                  ref={$menu}
                  size="small"
                  onClick={() => {
                    setMenuOpen(true);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={$menu.current}
                  keepMounted
                  open={menuOpen}
                  onClose={() => {
                    setMenuOpen(false);
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      props.onAddCheckbox(1);
                    }}
                  >
                    Add 1 checkboxe
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      props.onAddConsequence(1);
                    }}
                  >
                    Add 1 consequence
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setMenuOpen(false);
                      props.onRemove();
                    }}
                  >
                    Remove
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setMenuOpen(false);
                      props.onReset();
                    }}
                  >
                    Reset
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          className={css({
            fontSize: "1.1rem",
            lineHeight: "1.7rem",
            padding: "0.5rem 0",
            width: "100%",
            borderBottom: "1px solid #ddd",
          })}
        >
          <Box p="1rem">
            <ContentEditable
              value={props.content}
              disabled={props.disabled}
              onChange={props.onContentChange}
            ></ContentEditable>
          </Box>
        </Box>
        {shouldRenderCheckboxesOrConsequences && (
          <Box
            className={css({
              padding: "0.5rem 0",
              width: "100%",
              borderBottom: "1px solid #ddd",
            })}
          >
            <Box p="1rem">
              <Box>
                <Grid container justify="flex-start">
                  {props.checkboxes.map((value, index) => {
                    return (
                      <Grid item key={index} xs={2}>
                        <Checkbox
                          checked={value}
                          onChange={(event) => {
                            props.onCheckboxChange(index, event.target.checked);
                          }}
                          color="default"
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
              <Box>
                <Grid container justify="center">
                  {props.consequences.map((value, index) => {
                    return (
                      <Grid key={index} item xs={12}>
                        <Box py=".5rem">
                          <InputLabel shrink>
                            Consequence #{index + 1}
                          </InputLabel>
                          <TextField
                            fullWidth
                            value={value}
                            onChange={(event) => {
                              props.onConsequenceChange(
                                index,
                                event.target.value
                              );
                            }}
                          />
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
IndexCard.displayName = "IndexCard";
