import { FeatureRequestsRoute } from "../../lib/routes/FeatureRequests/FeatureRequestsRoute";
import { t } from "../i18n";

export async function generateMetadata() {
  return {
    title: t("feature-requests.meta.title"),
    description: t("feature-requests.meta.description"),
  };
}

export default function FeatureRequestsPage() {
  return <FeatureRequestsRoute></FeatureRequestsRoute>;
}
