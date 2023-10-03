import { FeatureRequestsRoute } from "../../../lib/routes/FeatureRequests/FeatureRequestsRoute";
import { t } from "../../i18n";

export const dynamicParams = true;

export async function generateMetadata() {
  return {
    title: t("feature-requests-route.meta.title"),
    description: t("feature-requests-route.meta.description"),
  };
}

export default function FeatureRequestsPage() {
  return <FeatureRequestsRoute></FeatureRequestsRoute>;
}
