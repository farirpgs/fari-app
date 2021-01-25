import { css } from "@emotion/css";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Container, { ContainerTypeMap } from "@material-ui/core/Container";
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
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuIcon from "@material-ui/icons/Menu";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import kebabCase from "lodash/kebabCase";
import truncate from "lodash/truncate";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useLightBackground } from "../../hooks/useLightBackground/useLightBackground";
import { AppLink } from "../AppLink/AppLink";
import { FateLabel } from "../FateLabel/FateLabel";
import MarkdownElement from "../MarkdownElement/MarkdownElement";
import { Page } from "../Page/Page";
import { PageMeta } from "../PageMeta/PageMeta";
import {
  ILoadFunction,
  IMarkdownHeader,
  useMarkdownFile,
} from "./hooks/useMarkdownFile";
import { useMarkdownPage } from "./hooks/useMarkdownPage";
import { useScrollOnHtmlLoad } from "./hooks/useScrollOnHtmlLoad";

export const drawerWidth = "300px";

export const Doc: React.FC<{
  title: string;
  currentPage: string | undefined;
  url: string;
  parent: {
    title: string;
    url: string;
  };
  author?: {
    title: string;
    avatarUrl?: string;
    items: Array<{ label: string; url: string }>;
  };
  imageUrl?: string;
  loadFunction: ILoadFunction;
  maxWidth?: ContainerTypeMap["props"]["maxWidth"];
}> = (props) => {
  const { tableOfContent: toc, dom, allHeaders } = useMarkdownFile(
    props.loadFunction
  );
  const hash = useLocation().hash;
  const {
    html,
    nextH1,
    previousH1,
    currentH1,
    title,
    description,
  } = useMarkdownPage({
    page: props.currentPage,
    hash: hash,
    dom: dom,
  });
  useScrollOnHtmlLoad(html);

  const lightBackground = useLightBackground();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();
  const location = useLocation();
  const logger = useLogger();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openH1, setOpenH1] = useState<string | undefined>();

  useEffect(() => {
    setOpenH1(currentH1?.id);
  }, [currentH1]);

  useEffect(() => {
    const docTitle = props.title ? `:${kebabCase(props.title)}` : "";
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
    history.push(`${props.url}/${path}`);
  }

  const shouldRenderImage = props.imageUrl && !isSmall;
  return (
    <Page
      drawerWidth={!isSmall ? drawerWidth : undefined}
      pb="4rem"
      debug={{ metaTitle: title, metaDescription: description }}
    >
      <PageMeta title={title} description={description} />
      {html ? (
        <Fade in>
          <Box display="flex">
            {renderTableOfContent()}
            <Box
              className={css({
                flexGrow: 1,
              })}
            >
              {shouldRenderImage && (
                <Box
                  className={css({
                    marginTop: "-2rem",
                    marginBottom: "1rem",
                    width: "100%",
                    height: isSmall ? "8rem" : "16rem",
                    display: "block",
                    backgroundSize: "cover",
                    backgroundRepeat: "repeat",
                    backgroundPosition: "center",
                    filter: "blur(8px)",
                    overflow: "hidden",
                    maskImage:
                      "linear-gradient(to bottom, #000 0%, transparent 100%)",
                    backgroundImage: `url("${props.imageUrl}")`,
                  })}
                />
              )}
              <Container maxWidth={props.maxWidth ?? "md"}>
                {renderAuthor()}
                {props.children && <Box>{props.children}</Box>}
                <Box>
                  <Box pb="1rem" mt="-1.5rem">
                    {renderHeader()}
                  </Box>
                  <Box mx="-.5rem">{renderNavigationButtons()}</Box>
                </Box>
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

  function renderAuthor() {
    if (!props.author) {
      return null;
    }
    return (
      <Box>
        <Grid container spacing={1} justify="space-between">
          <Grid container item sm={12} md spacing={1} alignItems="center">
            <Grid item className={css({ display: "flex" })}>
              {props.author.avatarUrl ? (
                <Avatar alt={props.author.title} src={props.author.avatarUrl} />
              ) : (
                <AccountBoxIcon />
              )}
            </Grid>
            <Grid item zeroMinWidth>
              <FateLabel variant="body2" color="primary" noWrap>
                <b>{props.author.title}</b>
              </FateLabel>
            </Grid>
          </Grid>
          <Grid
            container
            item
            sm={12}
            md
            spacing={1}
            justify={isSmall ? "flex-start" : "flex-end"}
            alignItems="center"
          >
            {props.author.items.map((item, index) => {
              const length = props.author?.items.length ?? 0;
              const isLast = index === length - 1;

              return (
                <React.Fragment key={item.url}>
                  <Grid item>
                    <AppLink to={item.url} target="_blank" underline="always">
                      <b> {item.label}</b>
                    </AppLink>
                  </Grid>
                  {!isLast && (
                    <Grid item>
                      <FateLabel color="secondary">{"•"}</FateLabel>
                    </Grid>
                  )}
                </React.Fragment>
              );
            })}
          </Grid>
        </Grid>
        <Box pt=".5rem" pb="3rem">
          <Divider />
        </Box>
      </Box>
    );
  }

  function renderTitle() {
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <FateLabel noWrap>
          <AppLink to={props.parent.url} noWrap underline="always">
            {props.parent.title}
          </AppLink>
        </FateLabel>
        <FateLabel noWrap> {props.title}</FateLabel>
      </Breadcrumbs>
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
          <Grid container spacing={1} alignItems="center" wrap="nowrap">
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
            <Grid item zeroMinWidth>
              <Box>
                <FateLabel noWrap> {props.title}</FateLabel>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Hidden>
    );
  }

  function renderHeader() {
    return (
      <Grid container justify="space-between" alignItems="flex-end" spacing={2}>
        <Grid item md={7} xs={12} zeroMinWidth>
          {renderTitle()}
        </Grid>
        <Grid item md={5} xs={12}>
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
            data-cy="doc.previous"
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
            data-cy="doc.next"
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
      <Box width="100%">
        <Autocomplete
          freeSolo
          size="small"
          autoHighlight
          filterOptions={createFilterOptions({ limit: 10 })}
          options={allHeaders.map((header) => header)}
          groupBy={(header) => header.grouping ?? ""}
          getOptionLabel={(header) => header.label}
          renderOption={(header) => (
            <React.Fragment>
              <Box width="100%">
                <Grid container alignItems="center">
                  <Grid item>{header.label}</Grid>
                </Grid>
                <Box>
                  <Typography variant="body2" noWrap color="textSecondary">
                    {header.preview}
                  </Typography>
                </Box>
              </Box>
            </React.Fragment>
          )}
          onChange={(event, newValue) => {
            const label = (newValue as IMarkdownHeader)?.label;

            if (label) {
              const header = allHeaders.find((h) => label === h.label);

              if (header?.level === 1) {
                history.push(`${props.url}/${header?.id}`);
              } else {
                history.push(`${props.url}/${header?.page?.id}#${header?.id}`);
              }
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
          const shouldRenderExpandIcon = h1.children.length > 0;
          const isSubSectionOpen = openH1 === h1.page.id;

          return (
            <React.Fragment key={index}>
              <ListItem
                button
                dense
                component={Link}
                to={`${props.url}/${h1.page.id}`}
                data-cy={`doc.table-of-content.h1`}
                data-cy-page-id={h1.page.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
              >
                {renderTableOfContentElement(h1.page)}
                {shouldRenderExpandIcon && (
                  <>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenH1((draft) => {
                          if (draft === h1.page.id) {
                            return undefined;
                          }
                          return h1.page.id;
                        });
                      }}
                    >
                      {isSubSectionOpen ? (
                        <ExpandLessIcon htmlColor={theme.palette.text.hint} />
                      ) : (
                        <ExpandMoreIcon htmlColor={theme.palette.text.hint} />
                      )}
                    </IconButton>
                  </>
                )}
              </ListItem>
              <Collapse
                in={isSubSectionOpen}
                data-cy={`doc.table-of-content.${h1.page.id}.h2s`}
              >
                {h1.children.map((h2, h2Index) => {
                  return (
                    <ListItem
                      button
                      dense
                      key={h2Index}
                      component={Link}
                      to={`#${h2.id}`}
                      data-cy={`doc.table-of-content.h2`}
                      data-cy-page-id={h2.id}
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
              <Typography
                noWrap
                className={css({
                  fontWeight: "bold",
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
