import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { css } from "emotion";
import { default as React, useRef, useState } from "react";
import { ContentEditable } from "./ContentEditable";

export const IndexCard: React.FC<{
  title: string;
  content: string;
  disabled?: boolean;
  onTitleChange(value: string): void;
  onContentChange(value: string): void;
}> = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const $menu = useRef(undefined);
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
          <Box p=".5rem">
            <Grid container spacing={2} justify="space-between">
              <Grid item>
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
                  <MenuItem onClick={() => {}}>Add checkboxes</MenuItem>
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
          <Box p=".5rem">
            <ContentEditable
              value={props.content}
              disabled={props.disabled}
              onChange={props.onContentChange}
            ></ContentEditable>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
IndexCard.displayName = "IndexCard";
