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
import React from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import MarkdownElement from "../../components/MarkdownElement/MarkdownElement";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import {
  ILoadFunction,
  ITocElement,
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
      {html ? (
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
            <MarkdownElement renderedMarkdown={html} />
            <Box mt="3rem" mb="1rem">
              <Divider />
            </Box>
            {renderButtons()}
          </Container>
        </Box>
      ) : (
        renderIsLoading()
      )}
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
                    component={Link}
                    to={`${props.prefix}/${h1.info.id}`}
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
                          component={Link}
                          to={`#${h2.id}`}
                          onClick={() => {
                            window.location.hash = h2.id;
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

export function nextUntil(
  elem: Element | undefined | null,
  selector: string,
  filter?: string
) {
  const siblings: Array<Element> = [];

  let currentElement = elem?.nextElementSibling;

  while (currentElement) {
    if (currentElement.matches(selector)) break;

    if (filter && !currentElement.matches(filter)) {
      currentElement = currentElement.nextElementSibling;
      continue;
    }

    siblings.push(currentElement);

    currentElement = currentElement.nextElementSibling;
  }

  return siblings;
}
