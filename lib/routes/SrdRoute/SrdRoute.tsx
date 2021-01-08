import React from "react";
import { useParams } from "react-router";
import { Doc } from "../../components/Doc/Doc";
import { ILoadFunction } from "./hooks/useMarkdownFile";

export const drawerWidth = "300px";

export const SrdRoute: React.FC<{
  prefix: string;
  title: string;
  loadFunction: ILoadFunction;
}> = (props) => {
  const { page } = useParams<{ page?: string }>();

  return (
    <Doc
      currentPageId={page}
      prefix={props.prefix}
      parentTitle="SRDs"
      parentUrl="/srds"
      docTitle={props.title}
      loadFunction={props.loadFunction}
    />
  );
};
SrdRoute.displayName = "SrdRoute";

export default SrdRoute;
