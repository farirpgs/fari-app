import Box from "@material-ui/core/Box";
import Button, { ButtonProps } from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ExposureIcon from "@material-ui/icons/Exposure";
import Filter1Icon from "@material-ui/icons/Filter1";
import Grid4x4Icon from "@material-ui/icons/GridOff";
import ImageIcon from "@material-ui/icons/Image";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import LinkIcon from "@material-ui/icons/Link";
import RemoveIcon from "@material-ui/icons/Remove";
import TextFieldsIcon from "@material-ui/icons/TextFields";
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
          color={"primary"}
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
          color="primary"
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
        getContentAnchorEl={null}
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
            props.onAddBlock(BlockType.SkillGrid);
            setAnchorEl(undefined);
          }}
        >
          <ListItemIcon>
            <Grid4x4Icon fontSize="small" />
          </ListItemIcon>

          <ListItemText primary={t("character-dialog.block-type.skill-grid")} />
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
