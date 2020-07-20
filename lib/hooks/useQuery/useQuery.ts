import { useLocation } from "react-router";

export function useQuery<T extends string>() {
  const location = useLocation();
  const query = (new URLSearchParams(location.search) as unknown) as Record<
    T,
    string
  >;
  return query;
}
