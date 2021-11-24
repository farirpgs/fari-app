import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExposureIcon from "@mui/icons-material/Exposure";
import Filter1Icon from "@mui/icons-material/Filter1";
import ImageIcon from "@mui/icons-material/Image";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import LinkIcon from "@mui/icons-material/Link";
import RemoveIcon from "@mui/icons-material/Remove";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { BlockType } from "../../../../../domains/character/types";
import { Icons } from "../../../../../domains/Icons/Icons";
import { useTranslate } from "../../../../../hooks/useTranslate/useTranslate";

export const AddBlock: React.FC<
  {
    onAddBlock(section: BlockType): void;
    variant: "icon" | "button";
  } & Pick<ButtonProps, "color">
> = (props) => {
  const variant = props.variant ?? "button";
  const { t } = useTranslate();
  const [anchorEl, setAnchorEl] = React.useState<any>();

  return (
    <Box
      p={variant === "button" ? "1rem" : "0"}
      justifyContent="center"
      display="flex"
    >
      {variant === "button" ? (
        <Button
          color="inherit"
          variant="outlined"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          {t("character-dialog.control.add-block")}
        </Button>
      ) : (
        <IconButton
          size="small"
          color="inherit"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          <AddIcon />
        </IconButton>
      )}
      <Menu
        elevation={2}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
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
            props.onAddBlock(BlockType.Image);
            setAnchorEl(undefined);
          }}
        >
          <ListItemIcon>
            <ImageIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText primary={t("character-dialog.block-type.image")} />
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
        <MenuItem
          onClick={() => {
            props.onAddBlock(BlockType.Link);
            setAnchorEl(undefined);
          }}
        >
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText primary={t("character-dialog.block-type.link")} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onAddBlock(BlockType.Separator);
            setAnchorEl(undefined);
          }}
        >
          <ListItemIcon>
            <RemoveIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText primary={t("character-dialog.block-type.separator")} />
        </MenuItem>
      </Menu>
    </Box>
  );
};
AddBlock.displayName = "AddBlock";
