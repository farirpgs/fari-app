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
import MenuIcon from "@material-ui/icons/Menu";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Autocomplete from "@material-ui/lab/Autocomplete";
import kebabCase from "lodash/kebabCase";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import { AppLink } from "../../components/AppLink/AppLink";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import MarkdownElement from "../../components/MarkdownElement/MarkdownElement";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useLightBackground } from "../../hooks/useLightBackground/useLightBackground";
import {
  ILoadFunction,
  IMarkdownHeader,
  useMarkdownFile,
} from "./hooks/useMarkdownFile";
import { useMarkdownPage } from "./hooks/useMarkdownPage";

const drawerWidth = "300px";

export const SrdRoute: React.FC<{
  prefix: string;
  title: string;
  loadFunction: ILoadFunction;
}> = (props) => {
  const { page } = useParams<{ page?: string }>();
  const { toc, dom, allHeaders } = useMarkdownFile(props.loadFunction);
  const { html, nextH1, previousH1, currentH1, description } = useMarkdownPage(
    page,
    dom
  );
  const lightBackground = useLightBackground();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();
  const location = useLocation();
  const title = currentH1?.textContent ?? "";
  const logger = useLogger();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const srdTitle = props.title ? `:${kebabCase(props.title)}` : "";
    const pageTitle = title ? `:${kebabCase(title)}` : "";
    const sectionTitle = location.hash
      ? `:${location.hash.replace("#", "")}`
      : "";
    const logMessage = `Route:Srd${srdTitle}${pageTitle}${sectionTitle}`;

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
      <PageMeta title={`${title} | ${props.title}`} description={description} />
      {html ? (
        <Fade in>
          <Box display="flex">
            {renderToc()}
            <Container maxWidth="md" className={css({ flexGrow: 1 })}>
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
        </Fade>
      ) : (
        renderIsLoading()
      )}
    </Page>
  );

  function renderTitle() {
    return (
      <FateLabel>
        <AppLink to="/srds">{"SRDs"}</AppLink>
        {" / "}
        {props.title}
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
                  setMenuOpen(true);
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
            {previousH1?.textContent}
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
            {nextH1?.textContent}
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

  function renderToc() {
    const list = (
      <List>
        {Object.entries(toc).map(([, h1], index) => {
          return (
            <React.Fragment key={index}>
              <ListItem
                button
                dense
                component={Link}
                to={`${props.prefix}/${h1.page.id}`}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                {renderTocElement(h1.page)}
              </ListItem>
              <Collapse in={currentH1?.id === h1.page.id}>
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
                        setMenuOpen(false);
                      }}
                    >
                      {renderTocElement(h2)}
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
            open={menuOpen}
            onClose={() => {
              setMenuOpen(false);
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

  function renderTocElement(tocElement: IMarkdownHeader) {
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
SrdRoute.displayName = "SrdRoute";

export default SrdRoute;
