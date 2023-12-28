import { BugsRoute } from "../../../lib/routes/Bugs/BugsRoute";
import { t } from "../../i18n";

export async function generateMetadata() {
  return {
    title: t("bugs-route.meta.title"),
    description: t("bugs-route.meta.description"),
  };
}

export default function BugsPage() {
  return <BugsRoute></BugsRoute>;
}
