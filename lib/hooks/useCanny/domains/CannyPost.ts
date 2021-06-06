import startCase from "lodash/startCase";

export const CannyPost = {
  getTitle(props: { pathName: string; basePath: string }) {
    if (!props.pathName) {
      return "";
    }

    const [, /*basePath*/ postSlug] = props.pathName.split(
      `${props.basePath}/p/`
    );
    if (!postSlug) {
      return "";
    }

    return startCase(postSlug);
  },
};
