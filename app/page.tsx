import { HomeRoute } from "../lib/routes/Home/HomeRoute";
import { t } from "./i18n";

export async function generateMetadata() {
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
