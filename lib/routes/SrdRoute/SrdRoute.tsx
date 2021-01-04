import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import showdown from "showdown";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import MarkdownElement from "../../components/MarkdownElement/MarkdownElement";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";

const drawerWidth = "300px";

const converter = new showdown.Converter();
type ILoadFunction = () => Promise<string>;

type IToc = Record<
  string,
  {
    info: ITocElement;
    level2: Array<ITocElement>;
  }
>;

type ITocElement = {
  label: string;
  level: number;
  id: string;
};
function useMarkdownFile(loadFunction: ILoadFunction) {
  const [html, setHtml] = useState<string | undefined>();
  const [toc, setToc] = useState<IToc>({});
  const [dom, setDom] = useState<HTMLDivElement>();
  const location = useLocation();

  useEffect(() => {
    load();
    async function load() {
      if (loadFunction) {
        const markdown = await loadFunction();

        if (markdown) {
          const html = converter.makeHtml(markdown);
          const dom = document.createElement("div");
          dom.innerHTML = html;

          type IToc = Record<
            string,
            {
              info: ITocElement;
              level2: Array<ITocElement>;
            }
          >;

          let newToc: IToc = {};

          let latestH1Id: string | undefined = undefined;
          dom.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((e) => {
            // prepare TOC
            const level = parseInt(e.tagName.replace("H", ""));
            if (level === 1) {
              latestH1Id = e.id;
              newToc = {
                ...newToc,
                [e.id]: {
                  info: {
                    id: e.id,
                    label: e.textContent ?? "",
                    level: level,
                  },
                  level2: [],
                },
              };
            }
            if (latestH1Id && level === 2) {
              newToc[latestH1Id].level2.push({
                id: e.id,
                label: e.textContent ?? "",
                level: level,
              });
            }

            // add anchor on header
            const anchor = document.createElement("a");
            anchor.className = "anchor";
            anchor.href = `#${e.id}`;
            e.append(anchor);
          });

          setHtml(dom.innerHTML);
          setToc(newToc);
          setDom(dom);
        }
      }
    }
  }, [loadFunction]);

  useEffect(() => {
    scrollToHeaderOnLoad();
    function scrollToHeaderOnLoad() {
      if (html && location.hash) {
        const element = document.querySelector(location.hash);
        const elementTop = element?.getBoundingClientRect().top ?? 0;
        const topPos = elementTop + window.pageYOffset;
        window.scrollTo({
          top: topPos,
          behavior: "smooth",
        });
      }
    }
  }, [html]);

  return { html, toc, dom };
}

function useMarkdownPage(
  page: string | undefined,
  dom: HTMLDivElement | undefined
) {
  return useMemo(() => {
    const allH1 =
      dom?.querySelectorAll(`h1`) ?? (([] as unknown) as NodeListOf<Element>);

    const currentH1 = dom?.querySelector(`#${page}`) ?? allH1[0];

    if (!currentH1) {
      return {
        html: "",
        currentH1: undefined,
        previousH1: undefined,
        nextH1: undefined,
      };
    }

    let previousH1: Element | undefined;
    let nextH1: Element | undefined;

    allH1.forEach((h1, index) => {
      if (h1.id === page) {
        previousH1 = allH1[index - 1];
        nextH1 = allH1[index + 1];
      }
    });

    const arrayElement = nextUntil(currentH1, `#${nextH1?.id}`);

    const newDom = document.createElement("div");
    newDom.append(currentH1?.cloneNode(true)!);
    arrayElement.forEach((e) => {
      newDom.append(e.cloneNode(true));
    });

    return { html: newDom?.innerHTML, currentH1, previousH1, nextH1 };
  }, [page, dom]);
}

export const SrdRoute: React.FC<{
  prefix: string;
  title: string;
  loadFunction: ILoadFunction;
}> = (props) => {
  const { page } = useParams<{ page?: string }>();
  const { toc, dom } = useMarkdownFile(props.loadFunction);
  const { html, nextH1, previousH1, currentH1 } = useMarkdownPage(page, dom);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();

  function goTo(path: string) {
    history.push(`${props.prefix}/${path}`);
  }

  return (
    <Page drawerWidth={!isSmall ? drawerWidth : undefined}>
      <PageMeta title={props.title} />
      <Box display="flex">
        {renderToc()}

        <Container className={css({ flexGrow: 1 })}>
          <Box pb="2rem">{renderButtons()}</Box>
          <FateLabel
            className={css({
              marginBottom: "-1rem",
            })}
          >
            {props.title}
          </FateLabel>
          {html ? (
            <>
              <MarkdownElement renderedMarkdown={html} />
              <Box mt="3rem" mb="1rem">
                <Divider />
              </Box>
              {renderButtons()}
            </>
          ) : (
            renderIsLoading()
          )}
        </Container>
      </Box>
    </Page>
  );

  function renderButtons() {
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

  function renderToc() {
    return (
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
            }),
          }}
        >
          <Box mt="5rem" />
          <Divider />
          <List>
            {Object.entries(toc).map(([, h1], index) => {
              return (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    dense
                    onClick={() => {
                      if (h1.info.level === 1) {
                        goTo(h1.info.id);
                      }
                    }}
                  >
                    {renderTocElement(h1.info)}
                  </ListItem>
                  <Collapse in={currentH1?.id === h1.info.id}>
                    {h1.level2.map((h2, h2Index) => {
                      return (
                        <ListItem
                          button
                          dense
                          key={h2Index}
                          onClick={() => {
                            if (h1.info.level === 1) {
                              window.location.hash = h2.id;
                            }
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
        </Drawer>
      </Hidden>
    );
  }

  function renderTocElement(tocElement: ITocElement) {
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

function nextUntil(
  elem: Element | undefined | null,
  selector: string,
  filter?: string
) {
  // Setup siblings array
  const siblings: Array<Element> = [];

  // Get the next sibling element
  let currentElement = elem?.nextElementSibling;

  // As long as a sibling exists
  while (currentElement) {
    // If we've reached our match, bail
    if (currentElement.matches(selector)) break;

    // If filtering by a selector, check if the sibling matches
    if (filter && !currentElement.matches(filter)) {
      currentElement = currentElement.nextElementSibling;
      continue;
    }

    // Otherwise, push it to the siblings array
    siblings.push(currentElement);

    // Get the next sibling element
    currentElement = currentElement.nextElementSibling;
  }

  return siblings;
}
