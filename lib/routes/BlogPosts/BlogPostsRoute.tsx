import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import dayjs from "dayjs";
import React from "react";
import { blogPosts } from "../../blog/index";
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
                <Link key={blogPost.title} href={`/blog/${blogPost.slug}`}>
                  {blogPost.title}
                </Link>
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
