import { Box, Button, Snackbar } from "@material-ui/core";
import { css } from "emotion";
import React, { useState } from "react";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const cookieConsentLocalStorageKey = "cookie-consent";

type ICookieConsent = "true" | undefined;
export const CookieConsent: React.FC<{}> = (props) => {
  const valueFromStorage = localStorage.getItem(
    cookieConsentLocalStorageKey
  ) as ICookieConsent;

  const [consent, setConsent] = useState<ICookieConsent>(valueFromStorage);
  const { t } = useTranslate();
  const open = consent !== "true";

  function handleClose() {
    setConsent("true");
    localStorage.setItem(cookieConsentLocalStorageKey, "true");
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={null}
      message={t("cookie-consent.description")}
      action={
        <Box className={css({ color: "#fff" })}>
          <Button color="inherit" onClick={handleClose}>
            {t("cookie-consent.button")}
          </Button>
        </Box>
      }
    ></Snackbar>
  );
};

CookieConsent.displayName = "CookieConsent";
