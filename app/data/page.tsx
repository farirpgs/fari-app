import { DataRoute } from "../../lib/routes/Data/DataRoute";
import { t } from "../i18n";

export async function generateMetadata() {
  return {
    title: t("data-route-route.title"),
    description: t("data-route-route.description"),
  };
}

export default function () {
  return <DataRoute></DataRoute>;
}
