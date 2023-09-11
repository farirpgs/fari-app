"useClient";

import { Box, Button, Snackbar } from "@mui/material";

import React, { useState } from "react";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const cookieConsentLocalStorageKey = "cookie-consent";
const storage = typeof window !== "undefined" ? window.localStorage : undefined;
type ICookieConsent = "true" | undefined;
export const CookieConsent: React.FC = () => {
  const valueFromStorage = storage?.getItem(
    cookieConsentLocalStorageKey,
  ) as ICookieConsent;

  const [consent, setConsent] = useState<ICookieConsent>(valueFromStorage);
  const { t } = useTranslate();
  const open = consent !== "true";

  function handleClose() {
    setConsent("true");
    storage?.setItem(cookieConsentLocalStorageKey, "true");
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={null}
      message={
        <>
          {t("cookie-consent.description")}{" "}
          <a
            style={{
              color: "inherit",
              textDecoration: "underline",
            }}
            href="https://www.iubenda.com/privacy-policy/97549620"
            target="_blank"
            rel="noreferrer"
            data-cy="cookie-consent.privacy-policy"
          >
            {t("page.privacy-policy")}
          </a>
        </>
      }
      action={
        <Box>
          <Button
            color="inherit"
            onClick={handleClose}
            data-cy="cookie-consent"
          >
            {t("cookie-consent.button")}
          </Button>
        </Box>
      }
    />
  );
};
