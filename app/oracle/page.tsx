import { OracleRoute } from "../../lib/routes/Oracle/OracleRoute";
import { t } from "../i18n";

export async function generateMetadata() {
  return {
    title: t("oracle-route.play-offline.title"),
    description: t("oracle-route.play-offline.description"),
  };
}

export default function OraclePage() {
  return <OracleRoute></OracleRoute>;
}
