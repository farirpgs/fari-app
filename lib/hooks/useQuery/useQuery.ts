import { useSearchParams } from "next/navigation";

export function useQuery<TKeys extends string>() {
  const searchParams = useSearchParams();

  return searchParams;
}
