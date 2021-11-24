import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import React, { useState } from "react";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const cookieConsentLocalStorageKey = "cookie-consent";

type ICookieConsent = "true" | undefined;
export const CookieConsent: React.FC = () => {
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
      message={
        <>
          {t("cookie-consent.description")}{" "}
          <a
            className={css({
              color: "inherit",
              textDecoration: "underline",
            })}
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

CookieConsent.displayName = "CookieConsent";
