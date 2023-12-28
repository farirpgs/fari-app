import { CardCollectionRoute } from "../../../lib/routes/CardCollection/CardCollectionRoute";
import { t } from "../../i18n";

export async function generateMetadata() {
  return {
    title: t("card-collection-route.meta.title"),
    description: t("card-collection-route.meta.description"),
  };
}

export default function CardCollectionPage() {
  return <CardCollectionRoute></CardCollectionRoute>;
}
