{
  /* <PageMeta
title={pageTitle}
description={t("bugs-route.meta.description")}
/> */
}

import { BugsRoute } from "../../lib/routes/Bugs/BugsRoute";
import { t } from "../i18n";

export async function generateMetadata() {
  return {
    title: t("bugs-route.title"),
    description: t("bugs-route.description"),
  };
}

export default function BugsPage() {
  return <BugsRoute></BugsRoute>;
}
