import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import React, { useEffect, useState } from "react";
import showdown from "showdown";
import { blogPosts } from "../../blog/index";
import MarkdownElement from "../../components/MarkdownElement/MarkdownElement";
import { Page } from "../../components/Page/Page";

const converter = new showdown.Converter();
export const BlogPostRoute: React.FC<{ slug: string }> = (props) => {
  const [html, setHtml] = useState<string | undefined>();

  useEffect(() => {
    load();
    async function load() {
      if (props.slug) {
        const blogPost = blogPosts.find((bp) => bp.slug === props.slug);
        const markdown = await blogPost?.load();

        if (markdown) {
          setHtml(converter.makeHtml(markdown));
        }
      }
    }
  }, [props.slug]);

  return (
    <Page>
      <Container maxWidth="md">
        {html ? <MarkdownElement renderedMarkdown={html} /> : renderIsLoading()}
      </Container>
    </Page>
  );

  function renderIsLoading() {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }
};

export default BlogPostRoute;
