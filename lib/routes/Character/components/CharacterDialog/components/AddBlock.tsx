import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { ThemeProvider } from "@material-ui/core/styles";
import useTheme from "@material-ui/core/styles/useTheme";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ExposureIcon from "@material-ui/icons/Exposure";
import Filter1Icon from "@material-ui/icons/Filter1";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import React from "react";
import { BlockType } from "../../../../../domains/character/types";
import { useThemeFromColor } from "../../../../../hooks/useThemeFromColor/useThemeFromColor";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";

export const AddBlock: React.FC<{
  onAddBlock(section: BlockType): void;
}> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const blackButtonTheme = useThemeFromColor(theme.palette.text.primary);
  const [anchorEl, setAnchorEl] = React.useState<any>();

  return (
    <Box p="1rem" justifyContent="center" display="flex">
      <ThemeProvider theme={blackButtonTheme}>
        <Button
          color="primary"
          variant="outlined"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          {t("character-dialog.control.add-block")}
        </Button>
        <Menu
          elevation={0}
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => {
            setAnchorEl(undefined);
          }}
        >
          <MenuItem
            onClick={() => {
              props.onAddBlock(BlockType.Text);
              setAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <TextFieldsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Text Section" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onAddBlock(BlockType.RichText);
              setAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <FormatBoldIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Rich Text" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onAddBlock(BlockType.Skill);
              setAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <Filter1Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Skill" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onAddBlock(BlockType.PointCounter);
              setAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <ExposureIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Point Counter" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.onAddBlock(BlockType.SlotTracker);
              setAnchorEl(undefined);
            }}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Slot Tracker" />
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </Box>
  );
};
AddBlock.displayName = "AddBlock";
