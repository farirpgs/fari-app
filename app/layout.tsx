/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import Script from "next/script";
import { Metadata } from "next/types";
import React from "react";
import { AppProviders } from "../lib/App";
import { NoSSR } from "../lib/components/NoSSR/NoSSR";

export const metadata: Metadata = {
  title: "Fari App VTT | The Free and Open-Source Virtual Tabletop",
  description: "",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Fari App VTT | The Free and Open-Source Virtual Tabletop</title>
        <meta
          name="google-site-verification"
          content="_SkIJRylG7gB1j0jbxxXboxdViB678DOHglRv43DNtE"
        />

        {/* <!-- Font --> */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* <!-- OLD Global site tag (gtag.js) - Google Analytics --> */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-150306816-1"
        />
        <Script id="universal-analytics">
          {` window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
    
          gtag("config", "UA-150306816-1"); // old`}
        </Script>
        {/* <!-- NEW lobal site tag (gtag.js) - Google Analytics --> */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BRZ1HL2EJG"
        />
        <Script id="google-tag-manager">
          {`window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
    
          gtag("config", "G-BRZ1HL2EJG");`}
        </Script>

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
      </head>

      <body>
        <div id="root">
          <NoSSR>
            <AppProviders>{props.children}</AppProviders>
          </NoSSR>
        </div>
        <Script
          type="text/javaScript"
          src="https://ko-fi.com/widgets/widget_2.js"
        ></Script>
        <Script id="canny">
          {`!(function (w, d, i, s) {
            function l() {
              if (!d.getElementById(i)) {
                var f = d.getElementsByTagName(s)[0],
                  e = d.createElement(s);
                (e.type = "text/javaScript"),
                  (e.async = !0),
                  (e.src = "https://canny.io/sdk.js"),
                  f.parentNode.insertBefore(e, f);
              }
            }
            if ("function" != typeof w.Canny) {
              var c = function () {
                c.q.push(arguments);
              };
              (c.q = []),
                (w.Canny = c),
                "complete" === d.readyState
                  ? l()
                  : w.attachEvent
                  ? w.attachEvent("onload", l)
                  : w.addEventListener("load", l, !1);
            }
          })(window, document, "canny-jssdk", "Script");`}
        </Script>
      </body>
    </html>
  );
}
