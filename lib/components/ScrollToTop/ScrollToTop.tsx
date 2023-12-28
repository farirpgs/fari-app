import { usePathname } from "next/navigation";
import { useEffect } from "react";
declare const window: Window & { ga: Function; gtag: Function };

export const ScrollToTop: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);

    const page = window.location.pathname + window.location.search;

    if (window.gtag) {
      window.gtag("config", "UA-150306816-1", { page_path: page });
    }
  }, [pathname]);
  return null;
};
