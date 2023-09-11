import { DataRoute } from "../../lib/routes/Data/DataRoute";
import { t } from "../i18n";

export async function generateMetadata() {
  return {
    title: t("data-route.title"),
    description: t("data-route.description"),
  };
}

export default function DataPage() {
  return <DataRoute></DataRoute>;
}
