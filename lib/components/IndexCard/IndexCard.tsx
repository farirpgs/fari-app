import {
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  TextField,
  useTheme,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { css } from "emotion";
import { default as React, useRef, useState } from "react";
import { ContentEditable } from "../ContentEditable/ContentEditable";

export const IndexCard: React.FC<{
  title: string;
  content: string;
  readonly: boolean;
  freeInvokes: Array<boolean>;
  physicalStress: Array<boolean>;
  mentalStress: Array<boolean>;
  consequences: Array<string>;

  onTitleChange(value: string): void;
  onContentChange(value: string): void;
  onFreeInvokeChange(index: number, value: boolean): void;
  onPhysicalStressChange(index: number, value: boolean): void;
  onMentalStressChange(index: number, value: boolean): void;
  onConsequenceChange(index: number, value: string): void;
  onAddAspectFreeInvoke(): void;
  onAddAspectPhysicalStress(): void;
  onAddAspectMentalStress(): void;
  onAddConsequence(): void;
  onRemove(): void;
  onReset(): void;
}> = (props) => {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const $menu = useRef(undefined);
  const shouldRenderCheckboxesOrConsequences =
    props.freeInvokes.length > 0 || props.consequences.length > 0;
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
                  readonly={props.readonly}
                  autoFocus
                  onChange={props.onTitleChange}
                ></ContentEditable>
              </Grid>
              {!props.readonly && (
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
                        props.onAddAspectFreeInvoke();
                      }}
                    >
                      Add 1 Free Invoke
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        props.onAddAspectPhysicalStress();
                      }}
                    >
                      Add 1 Physical Stress Box
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        props.onAddAspectMentalStress();
                      }}
                    >
                      Add 1 Mental Stress Box
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        props.onAddConsequence();
                      }}
                    >
                      Add 1 consequence
                    </MenuItem>
                    <Divider
                      light
                      className={css({
                        margin: ".5rem 0",
                      })}
                    ></Divider>
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
              )}{" "}
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
              readonly={props.readonly}
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
                {props.freeInvokes.length > 0 && (
                  <InputLabel shrink>Free Invokes</InputLabel>
                )}
                <Grid container justify="flex-start">
                  {props.freeInvokes.map((value, index) => {
                    return (
                      <Grid item key={index} xs={2}>
                        <Checkbox
                          checked={value}
                          onChange={(event) => {
                            if (props.readonly) {
                              return;
                            }
                            props.onFreeInvokeChange(
                              index,
                              event.target.checked
                            );
                          }}
                          color="default"
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
              <Box>
                {props.physicalStress.length > 0 && (
                  <InputLabel shrink>Physical Stress</InputLabel>
                )}
                <Grid container justify="flex-start">
                  {props.physicalStress.map((value, index) => {
                    return (
                      <Grid item key={index} xs={2}>
                        <Checkbox
                          checked={value}
                          onChange={(event) => {
                            if (props.readonly) {
                              return;
                            }
                            props.onPhysicalStressChange(
                              index,
                              event.target.checked
                            );
                          }}
                          className={css({
                            color: theme.palette.primary.main,
                          })}
                          color="primary"
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
              <Box>
                {props.mentalStress.length > 0 && (
                  <InputLabel shrink>Mental Stress</InputLabel>
                )}
                <Grid container justify="flex-start">
                  {props.mentalStress.map((value, index) => {
                    return (
                      <Grid item key={index} xs={2}>
                        <Checkbox
                          checked={value}
                          onChange={(event) => {
                            if (props.readonly) {
                              return;
                            }
                            props.onMentalStressChange(
                              index,
                              event.target.checked
                            );
                          }}
                          className={css({
                            color: theme.palette.secondary.main,
                          })}
                          color="secondary"
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
                            Consequence ({(index + 1) * 2})
                          </InputLabel>
                          <TextField
                            fullWidth
                            value={value}
                            onChange={(event) => {
                              if (props.readonly) {
                                return;
                              }
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
