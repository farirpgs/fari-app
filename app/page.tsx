import { HomeRoute } from "../lib/routes/Home/HomeRoute";
import { t } from "./i18n";

export function generatePageMeta() {
  return {
    title: "",
    description: t("home-route.meta.description"),
  };
}

export default function HomePage() {
  return (
    <div>
      <HomeRoute />
    </div>
  );
}
