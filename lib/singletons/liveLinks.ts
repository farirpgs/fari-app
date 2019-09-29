import _ from "lodash";

export interface ILiveLink {
  label: string;
  description: string;
  url: string;
}

export let liveLinks: Array<ILiveLink> = [];

export function addLiveLink(label: string, description: string, url: string) {
  const list = [
    ...liveLinks,
    {
      label,
      description,
      url
    }
  ].filter(l => !!l.label);

  liveLinks = _.uniqBy(list, (l: ILiveLink) => {
    return l.url;
  });
}
