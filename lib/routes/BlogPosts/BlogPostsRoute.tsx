import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import dayjs from "dayjs";
import React from "react";
import { blogPosts } from "../../blog/index";
import { AppLink } from "../../components/AppLink/AppLink";
import { Page } from "../../components/Page/Page";

export const BlogPostsRoute: React.FC = (props) => {
  return (
    <Page>
      <Box pb="2rem">
        <Typography variant="h4">Blog</Typography>
      </Box>
      {blogPosts.map((blogPost) => {
        const date = dayjs(blogPost.date);
        const formattedDate = date.format("YYYY-MM-DD");

        return (
          <Box key={blogPost.slug}>
            <Box>
              <Typography variant="h5">
                <AppLink key={blogPost.title} to={`/blog/${blogPost.slug}`}>
                  {blogPost.title}
                </AppLink>
              </Typography>
            </Box>
            <Box pb=".5rem">
              <Typography variant="h6" color="textSecondary">
                {formattedDate}
              </Typography>
            </Box>
            <Divider />
          </Box>
        );
      })}
    </Page>
  );
};
BlogPostsRoute.displayName = "BlogPostsRoute";
export default BlogPostsRoute;
