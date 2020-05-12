import { useTranslation } from "react-i18next";
import { IPossibleTranslationKeys } from "../../services/internationalization/IPossibleTranslationKeys";

export function useTranslate() {
  const { t, i18n } = useTranslation();
  return {
    t: t as (key: IPossibleTranslationKeys) => string,
    i18n,
  };
}
