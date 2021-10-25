import { css } from "@emotion/css";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Container, { ContainerTypeMap } from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import truncate from "lodash/truncate";
import uniq from "lodash/uniq";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { useLightBackground } from "../../hooks/useLightBackground/useLightBackground";
import { AppLink } from "../AppLink/AppLink";
import { FateLabel } from "../FateLabel/FateLabel";
import MarkdownElement from "../MarkdownElement/MarkdownElement";
import { Page } from "../Page/Page";
import { PageMeta } from "../PageMeta/PageMeta";
import { IDocumentIndex, IDocumentIndexes } from "./domains/DocumentProcessor";
import { useDocNavigation } from "./hooks/useDocNavigation";
import { ILoadFunction, useMarkdownFile } from "./hooks/useMarkdownFile";
import { useMarkdownPage } from "./hooks/useMarkdownPage";
import { useScrollOnHtmlLoad } from "./hooks/useScrollOnHtmlLoad";

export const drawerWidth = "300px";

export type ISideBarItems = Array<
  | string
  | IDocSidebar
  | { label: string; collapsed: boolean; items: ISideBarItems }
>;

export type IDoceSideBarOptions = {
  miscSectionTitle?: string;
};

export type IDocSidebar = {
  [category: string]: ISideBarItems;
};

type IProps = {
  title: string;
  /**
   * Prefix used by the document
   *
   * e.g. `/srds/condensed`
   */
  url: string;
  /**
   * Section right after the `props.url` which matches the current `<h1>` in the document
   *n
   * e.g. `/srds/condensed/{{h1}}`
   */
  page: string | undefined;

  /**
   * Where the user should go when clicking on the breadcrumb parent element
   */
  parent: {
    title: string;
    url: string;
  };
  /**
   * Author of the document as well as links
   */
  author?: {
    title: string;
    avatarUrl?: string;
    items: Array<{
      label: string;
      url: string;
    }>;
  };
  /**
   * Image visible on large views at the top of the document
   */
  imageUrl?: string;
  /**
   * Customize the max width of the document
   */
  maxWidth?: ContainerTypeMap["props"]["maxWidth"];
  /**
   * Disables Search Enginge tracking
   */
  noIndex?: boolean;
  /**
   * Function that returns the markdown document to parce
   */
  loadFunction: ILoadFunction;
  /**
   * Link to original file
   */
  gitHubLink?: string;
  sideBar?: IDocSidebar;
  sideBarOptions?: IDoceSideBarOptions;
  defaultSideBarCategory?: string;
};

export type IDocProps = IProps;

export const Doc: React.FC<IProps> = (props) => {
  const lightBackground = useLightBackground();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const section = params.get("goTo");
  const markdownRef = useRef<HTMLDivElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { dom, markdownIndexes } = useMarkdownFile({
    loadFunction: props.loadFunction,
    prefix: props.url,
  });

  const { pageDom, pageId, title, description, image } = useMarkdownPage({
    url: props.url,
    page: props.page,
    section: section,
    dom: dom,
  });

  const { navigation } = useDocNavigation({
    currentPageId: pageId,
    markdownIndexes: markdownIndexes,
    docSideBar: props.sideBar,
    doceSideBarOptions: props.sideBarOptions,
  });
  const html = pageDom?.innerHTML;
  const imageUrl = image || props.imageUrl;
  const shouldRenderImage = imageUrl && !isSmall;
  const shouldRenderSectionTitle = title !== props.title;
  const fullPath = location.pathname + location.search;

  useScrollOnHtmlLoad(html, section);

  useEffect(
    function scrollOnPageChange() {
      if (!fullPath.includes("?")) {
        window.scrollTo(0, 0);
      }
      setMobileMenuOpen(false);
    },
    [fullPath]
  );

  useEffect(function onUnmount() {
    return () => {
      window.scrollTo(0, 0);
    };
  }, []);

  useEffect(
    function transformHashToGoodUrl() {
      if (location.hash) {
        const newSection = location.hash.replace("#", "");

        history.replace({
          pathname: location.pathname,
          search: `?goTo=${newSection}`,
        });
      }
    },
    [location.hash]
  );

  function handleMarkdownAnchorClick(e: Event) {
    e.preventDefault();
    const anchor = e.currentTarget as Element | undefined;
    const href = anchor?.getAttribute("href");

    if (!href) {
      return;
    }

    if (href?.startsWith("/") || href?.startsWith("#")) {
      history.push(href);
    } else {
      window.open(href);
    }
  }

  function handleGoToIndex(page: IDocumentIndex) {
    if (page.url) {
      history.push(page.url);
    }
  }

  useEffect(
    function connectTocAnchors() {
      markdownRef.current?.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", handleMarkdownAnchorClick);
      });

      markdownRef.current?.querySelectorAll("img").forEach((img) => {
        const html = img.outerHTML;
        img.outerHTML = `<figure class="fari-image">${html}<figcaption>${img.alt}</figcaption></figure>`;
      });

      return () => {
        markdownRef.current?.querySelectorAll("a").forEach((a) => {
          a.removeEventListener("click", handleMarkdownAnchorClick);
        });
      };
    },
    [html]
  );

  return (
    <Page
      drawerWidth={!isSmall ? drawerWidth : undefined}
      pb="4rem"
      debug={{
        metaTitle: title,
        metaDescription: description,
        metaImage: imageUrl ?? "",
      }}
      disableAutomaticScrollTop
    >
      <PageMeta
        title={shouldRenderSectionTitle ? `${title} | ${props.title}` : title}
        description={description}
        image={imageUrl}
        noIndex={props.noIndex}
      />
      {html ? (
        <Fade in>
          <Box display="flex">
            {renderSideBar()}
            <Box
              className={css({
                flexGrow: 1,
              })}
            >
              {shouldRenderImage && (
                <Box
                  className={css({
                    marginTop: "-3rem",
                    marginBottom: "1rem",
                    width: "100%",
                    height: "12rem",
                    display: "block",
                    backgroundSize: "cover",
                    backgroundRepeat: "repeat",
                    backgroundPosition: "center",
                    filter: "blur(8px)",
                    overflow: "hidden",
                    maskImage:
                      "linear-gradient(to bottom, #000 0%, transparent 100%)",
                    backgroundImage: `url("${imageUrl}")`,
                  })}
                />
              )}
              <Container maxWidth={("lg" || props.maxWidth) ?? "md"}>
                {renderAuthor()}
                {props.children && <Box>{props.children}</Box>}
                <Box>
                  <Box pb="1rem" mt="-1.5rem">
                    {renderHeader()}
                  </Box>
                </Box>
                <Grid container>
                  <Grid item xs>
                    <Box pr={isSmall ? 0 : 2}>
                      <div ref={markdownRef}>
                        <MarkdownElement renderedMarkdown={html} />
                      </div>
                    </Box>
                  </Grid>
                  <Hidden lgDown>
                    <Grid item lg={3}>
                      <Box
                        pl={2}
                        className={css({
                          position: "sticky",
                          top: "0",
                        })}
                      >
                        {renderTableOfContents()}
                      </Box>
                    </Grid>
                  </Hidden>
                </Grid>

                {renderEditButton()}

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

  function renderTableOfContents() {
    const tableOfContentsPaddingTop = "4.5rem";
    return (
      <>
        <Box
          className={css({
            paddingTop: tableOfContentsPaddingTop,
          })}
        >
          <Box
            className={css({
              borderLeft: "1px solid #dadde1",
              paddingTop: "1rem",
              height: "100%",
              maxHeight: `calc(100vh - ${tableOfContentsPaddingTop})`,
              position: "sticky",
              top: "0",
              overflowY: "auto",
            })}
          >
            <DocTableOfContents
              markdownIndexes={markdownIndexes}
              currentPage={pageId}
            />
          </Box>
        </Box>
      </>
    );
  }

  function renderEditButton() {
    if (!props.gitHubLink) {
      return null;
    }
    const githubHash = pageId ? `#${pageId}` : "";
    return (
      <Box my=".5rem" pb="2rem">
        <Grid container justifyContent="flex-start">
          <Grid item>
            <Button
              component="a"
              startIcon={<EditIcon />}
              target="_blank"
              rel="noreferrer"
              href={`${props.gitHubLink}${githubHash}`}
            >
              Edit this Page
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function renderAuthor() {
    if (!props.author) {
      return null;
    }
    return (
      <Box>
        <Grid container spacing={1} justifyContent="space-between">
          <Grid container item sm={12} md spacing={1} alignItems="center">
            <Grid item className={css({ display: "flex" })}>
              {props.author.avatarUrl ? (
                <Avatar alt={props.author.title} src={props.author.avatarUrl} />
              ) : (
                <AccountBoxIcon />
              )}
            </Grid>
            <Grid item zeroMinWidth>
              <FateLabel variant="body2" color="primary">
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
            justifyContent={isSmall ? "flex-start" : "flex-end"}
            alignItems="center"
          >
            {props.author.items.map((item, index) => {
              const length = props.author?.items.length ?? 0;
              const isLast = index === length - 1;

              return (
                <React.Fragment key={item.url}>
                  <Grid item>
                    <AppLink to={item.url} target="_blank" underline="always">
                      <b>{item.label}</b>
                    </AppLink>
                  </Grid>
                  {!isLast && (
                    <Grid item>
                      <FateLabel color="primary">{"•"}</FateLabel>
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
                size="large"
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
      <Grid
        container
        justifyContent="space-between"
        alignItems="flex-end"
        spacing={2}
      >
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
    const previousIndex = markdownIndexes.flat.find(
      (i) => i.id === navigation.previousPageId
    );
    const nextIndex = markdownIndexes.flat.find(
      (i) => i.id === navigation.nextPageId
    );

    return (
      <Box>
        <Grid
          container
          spacing={2}
          justifyContent={
            previousIndex && !nextIndex
              ? "flex-start"
              : !previousIndex && nextIndex
              ? "flex-end"
              : "space-between"
          }
        >
          {previousIndex && (
            <Grid container item xs={12} sm={6} justifyContent="flex-start">
              <Button
                fullWidth={isSmall}
                className={css({
                  height: "4rem",
                  textAlign: "left",
                })}
                variant="outlined"
                color="primary"
                data-cy="doc.previous"
                onClick={() => {
                  handleGoToIndex(previousIndex);
                }}
              >
                <Box
                  className={css({
                    display: "flex",
                    flexDirection: "column",
                  })}
                >
                  <Box
                    className={css({
                      color: theme.palette.text.secondary,
                      textTransform: "none",
                      fontWeight: theme.typography.fontWeightRegular,
                    })}
                  >
                    {"Previous"}
                  </Box>
                  <Box>
                    {"« "}
                    {truncate(previousIndex?.label ?? "", { length: 50 })}
                  </Box>
                </Box>
              </Button>
            </Grid>
          )}
          {nextIndex && (
            <Grid container item xs={12} sm={6} justifyContent="flex-end">
              <Button
                fullWidth={isSmall}
                className={css({
                  height: "4rem",
                  textAlign: "right",
                })}
                variant="outlined"
                color="primary"
                data-cy="doc.next"
                onClick={() => {
                  handleGoToIndex(nextIndex);
                }}
              >
                <Box
                  className={css({
                    display: "flex",
                    flexDirection: "column",
                  })}
                >
                  <Box
                    className={css({
                      color: theme.palette.text.secondary,
                      textTransform: "none",
                      fontWeight: theme.typography.fontWeightRegular,
                    })}
                  >
                    {"Next"}
                  </Box>
                  <Box>
                    {truncate(nextIndex?.label ?? "", { length: 50 })}
                    {" »"}
                  </Box>
                </Box>
              </Button>
            </Grid>
          )}
        </Grid>
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
          options={markdownIndexes.flat.map((i) => i)}
          groupBy={(index) => index.pageLabel ?? ""}
          getOptionLabel={(index) => index.label}
          inputValue={search}
          onInputChange={(e, value, reason) => {
            if (reason === "input") {
              setSearch(value);
            } else {
              setSearch("");
            }
          }}
          onChange={(event, newValue) => {
            const label = (newValue as IDocumentIndex)?.id;
            if (label) {
              const index = markdownIndexes.flat.find(
                (index) => label === index.id
              );

              if (index?.url) {
                history.push(index.url);
              }
            }
          }}
          renderOption={(props, options) => (
            <React.Fragment>
              <Box width="100%">
                <Grid container alignItems="center">
                  <Grid item>{options.label}</Grid>
                </Grid>
                <Box>
                  <Typography variant="body2" noWrap color="textSecondary">
                    {options.preview}
                  </Typography>
                </Box>
              </Box>
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              className={css({ width: "100%", margin: "0" })}
              label="Search"
              margin="normal"
              variant="standard"
            />
          )}
        />
      </Box>
    );
  }

  function renderSideBar() {
    const sideBar = (
      <DocSideBar
        currentPage={pageId}
        markdownIndexes={markdownIndexes}
        sideBar={props.sideBar}
        sideBarOptions={props.sideBarOptions}
        defaultSideBarCategory={props.defaultSideBarCategory}
      />
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
          >
            <Box p="2rem">{sideBar}</Box>
          </Drawer>
        </Hidden>
        <Hidden mdDown>
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
                paddingTop: "5.5rem",
                width: drawerWidth,
              }),
            }}
          >
            <Box
              className={css({
                maxHeight: "calc(100vh - 5.5rem)",
                overflow: "auto",
                paddingBottom: "2rem",
                borderTop: `1px solid ${theme.palette.divider}`,
              })}
            >
              {sideBar}
            </Box>
          </Drawer>
        </Hidden>
      </>
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

export const DocSideBar: React.FC<{
  currentPage: string | undefined;
  markdownIndexes: IDocumentIndexes;
  sideBar: IDocSidebar | undefined;
  sideBarOptions: IDoceSideBarOptions | undefined;
  defaultSideBarCategory?: string;
}> = (props) => {
  const theme = useTheme();

  const { navigation, sideBar } = useDocNavigation({
    currentPageId: props.currentPage,
    markdownIndexes: props.markdownIndexes,
    docSideBar: props.sideBar,
    doceSideBarOptions: props.sideBarOptions,
    defaultSideBarCategory: props.defaultSideBarCategory,
  });

  const [openList, setOpenList] = useState<Array<string>>([
    ...navigation.defaultOpenedCategories,
  ]);

  useEffect(
    function syncHighlightedItems() {
      setOpenList((d) => [...d, ...navigation.highlightedItems]);
    },
    [navigation.highlightedItems]
  );

  useEffect(
    function syncDefaultOpenedCategories() {
      setOpenList((d) => {
        return uniq([...d, ...navigation.defaultOpenedCategories]);
      });
    },
    [navigation.defaultOpenedCategories]
  );

  return <List>{renderSideBarContent(sideBar)}</List>;

  function renderSideBarContent(categories: IDocSidebar) {
    const categoryNames = Object.keys(categories);
    return (
      <>
        {categoryNames.map((category) => {
          const items = categories[category];

          const isCategorySelected =
            navigation.highlightedItems.includes(category);
          const isCategoryOpened = openList.includes(category);

          const categoryName = category.replace("+", "");
          return (
            <React.Fragment key={category}>
              <ListItem
                button
                dense
                className={css({ borderRadius: theme.shape.borderRadius })}
                data-cy={"doc.side-bar.category"}
                data-cy-open={isCategoryOpened}
                onClick={() => {
                  if (isCategoryOpened) {
                    setOpenList((draft) => draft.filter((i) => i !== category));
                  } else {
                    setOpenList((draft) => [...draft, category]);
                  }
                }}
              >
                <Box width="100%">
                  <Typography
                    noWrap
                    title={categoryName}
                    className={css({
                      color: isCategorySelected
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                      fontWeight: isCategorySelected
                        ? theme.typography.fontWeightBold
                        : theme.typography.fontWeightRegular,
                    })}
                  >
                    {categoryName}
                  </Typography>
                </Box>

                <ArrowForwardIosIcon
                  htmlColor={theme.palette.text.secondary}
                  className={css({
                    width: "1rem",
                    height: "1rem",
                    transform: isCategoryOpened
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: theme.transitions.create("transform"),
                  })}
                />
              </ListItem>
              <Collapse in={isCategoryOpened}>
                <List
                  className={css({
                    paddingLeft: "1rem",
                    paddingTop: "0",
                    paddingBottom: "0",
                  })}
                >
                  {items.map((item, j) => {
                    const shouldRenderItem = typeof item === "string";
                    const index = shouldRenderItem
                      ? props.markdownIndexes.flat.find((i) => i.id === item)
                      : undefined;
                    const isItemSelected = navigation.highlightedItems.includes(
                      index?.id ?? ""
                    );
                    return (
                      <React.Fragment key={j}>
                        {shouldRenderItem && index && (
                          <ListItem
                            button
                            component={RouterLink}
                            to={index.url ?? ""}
                            data-cy="doc.side-bar.category-item"
                            data-cy-item-id={index.id}
                            dense
                            className={css({
                              borderRadius: theme.shape.borderRadius,
                            })}
                          >
                            <Box width="100%">
                              <Typography
                                noWrap
                                title={index.label}
                                className={css({
                                  color: isItemSelected
                                    ? theme.palette.primary.main
                                    : theme.palette.text.primary,
                                  fontWeight: isItemSelected
                                    ? theme.typography.fontWeightBold
                                    : theme.typography.fontWeightRegular,
                                })}
                              >
                                {index.label}
                              </Typography>
                            </Box>
                          </ListItem>
                        )}
                        {!shouldRenderItem &&
                          renderSideBarContent(item as IDocSidebar)}
                      </React.Fragment>
                    );
                  })}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </>
    );
  }
};

export const DocTableOfContents: React.FC<{
  currentPage: string | undefined;
  markdownIndexes: IDocumentIndexes;
}> = (props) => {
  const theme = useTheme();
  const params = new URLSearchParams(location.search);
  const section = params.get("goTo");

  const currentIndex = props.markdownIndexes.flat.find(
    (i) => i.id === props.currentPage
  );

  return <Box>{renderTableOfContentItem(currentIndex)}</Box>;

  function renderTableOfContentItem(index: IDocumentIndex | undefined) {
    if (!index) {
      return null;
    }
    return (
      <ul
        className={css({
          listStyleType: "none",
          marginTop: "0",
          marginBottom: "0",
          paddingLeft: ".5rem",
        })}
      >
        {index.children.map((child) => {
          return (
            <li
              key={child.id}
              className={css({
                margin: ".5rem",
              })}
            >
              <AppLink
                to={child.url ?? ""}
                className={css({
                  color:
                    section === child.id
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  fontWeight:
                    section === child.id
                      ? theme.typography.fontWeightBold
                      : "inherit",
                })}
              >
                {child.label}
              </AppLink>
              {child.children.length > 1 && renderTableOfContentItem(child)}
            </li>
          );
        })}
      </ul>
    );
  }
};
