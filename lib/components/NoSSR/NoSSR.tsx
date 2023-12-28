import dynamic from "next/dynamic";
import React from "react";

const NoSSRComponent = (props: { children: React.ReactNode }) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export const NoSSR = dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
});
