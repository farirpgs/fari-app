import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import useTheme from "@material-ui/core/styles/useTheme";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuIcon from "@material-ui/icons/Menu";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Autocomplete from "@material-ui/lab/Autocomplete";
import kebabCase from "lodash/kebabCase";
import truncate from "lodash/truncate";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useLightBackground } from "../../hooks/useLightBackground/useLightBackground";
import {
  ILoadFunction,
  IMarkdownHeader,
  useMarkdownFile,
} from "../../routes/SrdRoute/hooks/useMarkdownFile";
import { useMarkdownPage } from "../../routes/SrdRoute/hooks/useMarkdownPage";
import { drawerWidth } from "../../routes/SrdRoute/SrdRoute";
import { AppLink } from "../AppLink/AppLink";
import { FateLabel } from "../FateLabel/FateLabel";
import MarkdownElement from "../MarkdownElement/MarkdownElement";
import { Page } from "../Page/Page";
import { PageMeta } from "../PageMeta/PageMeta";

export const Doc: React.FC<{
  docTitle: string;
  currentPageId: string | undefined;
  prefix: string;
  parentTitle: string;
  parentUrl: string;
  imageUrl?: string;
  loadFunction: ILoadFunction;
}> = (props) => {
  const { toc, dom, allHeaders } = useMarkdownFile(props.loadFunction);
  const { html, nextH1, previousH1, currentH1, description } = useMarkdownPage(
    props.currentPageId,
    dom
  );

  const lightBackground = useLightBackground();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();
  const location = useLocation();
  const logger = useLogger();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userClosedH1, setUserClosedH1] = useState(false);

  const title = currentH1?.textContent ?? "";
  const isFirstPage = !previousH1;

  useEffect(() => {
    const docTitle = props.docTitle ? `:${kebabCase(props.docTitle)}` : "";
    const pageTitle = title ? `:${kebabCase(title)}` : "";
    const sectionTitle = location.hash
      ? `:${location.hash.replace("#", "")}`
      : "";
    const logMessage = `Route:Srd${docTitle}${pageTitle}${sectionTitle}`;

    logger.info(logMessage, {
      pathname: location.pathname,
      hash: location.hash,
    });
  }, [location.pathname, location.hash]);

  function goTo(path: string) {
    history.push(`${props.prefix}/${path}`);
  }

  return (
    <Page drawerWidth={!isSmall ? drawerWidth : undefined} pb="4rem">
      <PageMeta
        title={isFirstPage ? props.docTitle : `${title} | ${props.docTitle}`}
        description={description}
      />
      {html ? (
        <Fade in>
          <Box display="flex">
            {renderTableOfContent()}
            <Box className={css({ flexGrow: 1 })}>
              {props.imageUrl && (
                <Box
                  className={css({
                    marginTop: "-2rem",
                    marginBottom: "2rem",
                    width: "100%",
                    height: "8rem",
                    display: "block",
                    backgroundSize: "cover",
                    backgroundRepeat: "repeat",
                    backgroundPosition: "center",
                    filter: "blur(8px)",
                    maskImage:
                      "linear-gradient(to bottom, black 0%, transparent 100%)",
                    backgroundImage: `url("${props.imageUrl}")`,
                  })}
                />
              )}
              <Container maxWidth="md" className={css({ flexGrow: 1 })}>
                {props.children && (
                  <Box>
                    {props.children}
                    <Box mt=".25rem" mb="2rem">
                      <Divider />
                    </Box>
                  </Box>
                )}
                <Box pb="1rem" mt="-1.5rem">
                  {renderHeader()}
                </Box>
                <Box mx="-.5rem">{renderNavigationButtons()}</Box>
                <MarkdownElement renderedMarkdown={html} />
                <Box mt="3rem" mb="1rem">
                  <Divider />
                </Box>
                {renderNavigationButtons()}
                {renderMobileMenu()}
              </Container>
            </Box>
          </Box>
        </Fade>
      ) : (
        renderIsLoading()
      )}
    </Page>
  );

  function renderTitle() {
    return (
      <FateLabel>
        <AppLink to={props.parentUrl}>{props.parentTitle}</AppLink>
        {" / "}
        {props.docTitle}
      </FateLabel>
    );
  }

  function renderMobileMenu() {
    return (
      <Hidden mdUp>
        <Box
          p=".5rem"
          className={css({
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100%",
            boxShadow: theme.shadows[24],
            background: lightBackground,
          })}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <IconButton
                color="inherit"
                onClick={() => {
                  setMobileMenuOpen(true);
                }}
              >
                <MenuIcon color="inherit" />
              </IconButton>
            </Grid>
            <Grid item>{renderTitle()}</Grid>
          </Grid>
        </Box>
      </Hidden>
    );
  }

  function renderHeader() {
    return (
      <Grid container justify="space-between" alignItems="flex-end">
        <Grid item sm xs={12}>
          <Box pt="1rem">{renderTitle()}</Box>
        </Grid>
        <Grid item sm={4} xs={12}>
          {renderAutoComplete()}
        </Grid>
      </Grid>
    );
  }

  function renderNavigationButtons() {
    return (
      <Box
        display="flex"
        justifyContent={
          previousH1 && !nextH1
            ? "flex-start"
            : !previousH1 && nextH1
            ? "flex-end"
            : "space-between"
        }
      >
        {previousH1 && (
          <Button
            startIcon={<NavigateBeforeIcon />}
            color="primary"
            onClick={() => {
              goTo(previousH1?.id);
            }}
          >
            {truncate(previousH1?.textContent ?? "", { length: 50 })}
          </Button>
        )}

        {nextH1 && (
          <Button
            endIcon={<NavigateNextIcon />}
            color="primary"
            onClick={() => {
              goTo(nextH1?.id);
            }}
          >
            {truncate(nextH1?.textContent ?? "", { length: 50 })}
          </Button>
        )}
      </Box>
    );
  }

  function renderAutoComplete() {
    return (
      <Box>
        <Autocomplete
          freeSolo
          size="small"
          options={allHeaders.map((header) => header.label)}
          onChange={(event, newValue) => {
            const header = allHeaders.find((h) => newValue === h.label);

            if (header?.level === 1) {
              history.push(`${props.prefix}/${header?.id}`);
            } else {
              history.push(
                `${props.prefix}/${header?.parent?.id}#${header?.id}`
              );
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              className={css({ width: "100%", margin: "0" })}
              label="Search"
              margin="normal"
            />
          )}
        />
      </Box>
    );
  }

  function renderTableOfContent() {
    const list = (
      <List>
        {Object.entries(toc).map(([, h1], index) => {
          const isCurrentH1 = currentH1?.id === h1.page.id;
          const shouldRenderExpandIcon = h1.children.length > 0;
          const isSubSectionOPen = isCurrentH1 && !userClosedH1;
          return (
            <React.Fragment key={index}>
              <ListItem
                button
                dense
                component={Link}
                to={`${props.prefix}/${h1.page.id}`}
                onClick={() => {
                  if (isCurrentH1) {
                    setUserClosedH1((value) => !value);
                  } else {
                    setUserClosedH1(false);
                    setMobileMenuOpen(false);
                  }
                }}
              >
                {renderTableOfContentElement(h1.page)}
                {shouldRenderExpandIcon && (
                  <>
                    {isSubSectionOPen ? (
                      <ExpandLessIcon htmlColor={theme.palette.text.hint} />
                    ) : (
                      <ExpandMoreIcon htmlColor={theme.palette.text.hint} />
                    )}
                  </>
                )}
              </ListItem>
              <Collapse in={isSubSectionOPen}>
                {h1.children.map((h2, h2Index) => {
                  return (
                    <ListItem
                      button
                      dense
                      key={h2Index}
                      component={Link}
                      to={`#${h2.id}`}
                      onClick={() => {
                        window.location.hash = h2.id;
                        setMobileMenuOpen(false);
                      }}
                    >
                      {renderTableOfContentElement(h2)}
                    </ListItem>
                  );
                })}
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
    );

    return (
      <>
        <Hidden mdUp>
          <Drawer
            anchor="bottom"
            open={mobileMenuOpen}
            onClose={() => {
              setMobileMenuOpen(false);
            }}
            classes={{
              paper: css({
                background: lightBackground,
              }),
            }}
          >
            <Box p="2rem">{list}</Box>
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            variant="permanent"
            anchor="left"
            open={true}
            classes={{
              root: css({
                width: drawerWidth,
                flexShrink: 0,
              }),
              paper: css({
                width: drawerWidth,
                background: lightBackground,
              }),
            }}
          >
            <Box mt="4.9rem" />
            <Divider />
            {list}
          </Drawer>
        </Hidden>
      </>
    );
  }

  function renderTableOfContentElement(tocElement: IMarkdownHeader) {
    return (
      <ListItemText
        primary={
          <Box
            display="inline-block"
            title={tocElement.label}
            className={css({
              width: "100%",
              display: "inline-block",
              paddingLeft: `${(tocElement.level - 1) * 1}rem`,
            })}
          >
            {tocElement.level === 1 ? (
              <FateLabel
                noWrap
                className={css({
                  width: "100%",
                  display: "inline-block",
                })}
                dangerouslySetInnerHTML={{
                  __html: tocElement.label,
                }}
              />
            ) : (
              <Typography
                noWrap
                className={css({
                  width: "100%",
                  display: "inline-block",
                })}
                dangerouslySetInnerHTML={{
                  __html: tocElement.label,
                }}
              />
            )}
          </Box>
        }
      />
    );
  }

  function renderIsLoading() {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }
};
