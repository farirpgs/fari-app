import Box from "@material-ui/core/Box";
import Button, { ButtonProps } from "@material-ui/core/Button";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import useTheme from "@material-ui/core/styles/useTheme";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ExposureIcon from "@material-ui/icons/Exposure";
import Filter1Icon from "@material-ui/icons/Filter1";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import React from "react";
import { BlockType } from "../../../../../domains/character/types";
import { Icons } from "../../../../../domains/Icons/Icons";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";

export const AddBlock: React.FC<
  {
    onAddBlock(section: BlockType): void;
  } & Pick<ButtonProps, "color">
> = (props) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const [anchorEl, setAnchorEl] = React.useState<any>();

  return (
    <Box p="1rem" justifyContent="center" display="flex">
      <Button
        color={"primary"}
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

          <ListItemText primary={t("character-dialog.block-type.text")} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onAddBlock(BlockType.Numeric);
            setAnchorEl(undefined);
          }}
        >
          <ListItemIcon>
            <Filter1Icon fontSize="small" />
          </ListItemIcon>

          <ListItemText primary={t("character-dialog.block-type.numeric")} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onAddBlock(BlockType.Skill);
            setAnchorEl(undefined);
          }}
        >
          <ListItemIcon>
            <LibraryAddIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText primary={t("character-dialog.block-type.skill")} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onAddBlock(BlockType.DicePool);
            setAnchorEl(undefined);
          }}
        >
          <ListItemIcon>
            <Icons.ThrowDice fontSize="small" />
          </ListItemIcon>

          <ListItemText primary={t("character-dialog.block-type.dice-pool")} />
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

          <ListItemText
            primary={t("character-dialog.block-type.point-counter")}
          />
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

          <ListItemText
            primary={t("character-dialog.block-type.slot-tracker")}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};
AddBlock.displayName = "AddBlock";
