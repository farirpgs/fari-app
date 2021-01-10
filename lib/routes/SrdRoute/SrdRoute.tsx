import React from "react";
import { useParams } from "react-router";
import { Doc } from "../../components/Doc/Doc";
import { ILoadFunction } from "./hooks/useMarkdownFile";

export const drawerWidth = "300px";

export const SrdRoute: React.FC<{
  url: string;
  title: string;
  imageUrl: string;
  loadFunction: ILoadFunction;
}> = (props) => {
  const { page } = useParams<{ page?: string }>();

  return (
    <Doc
      currentPage={page}
      url={props.url}
      title={props.title}
      parent={{ title: "SRDs", url: "/srds" }}
      imageUrl={props.imageUrl}
      loadFunction={props.loadFunction}
    />
  );
};
SrdRoute.displayName = "SrdRoute";

export default SrdRoute;
