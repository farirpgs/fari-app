import { useLocation } from "react-router";

export function useQuery<TKeys extends string>() {
  const routeLocation = useLocation();
  const urlSearchParams = new URLSearchParams(routeLocation.search);

  return {
    get(key: TKeys) {
      return urlSearchParams.get(key);
    },
  };
}
