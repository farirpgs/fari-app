import React from "react";
import { Page } from "../../components/Page/Page";

export const About: React.FC<{}> = props => {
  return (
    <Page h1="About">
      <p>
        Fari is a <b>free Role Playing Game Companion</b> app developed by me
        (René-Pier Deshaies-Gélinas)
      </p>

      <p>
        Made with ❤️ and passion from Saint-Jean-sur-Richelieu, Québec, Canada
      </p>

      <p>
        If you want, you can{" "}
        <a href="https://ko-fi.com/rpdeshaies" target="_blank">
          buy me a coffee
        </a>{" "}
        to support this application. I work on this in my free time because I
        love it but I also love coffee ☕️.
      </p>

      <p>
        Fari would not exist without the help of some awesome libraries and
        framework.
      </p>
      <p>You can donate to help them too:</p>
      <ul>
        <li>
          <a href="https://opencollective.com/peer" target="_blank">
            PeerJS
          </a>{" "}
          - What helps you play scenes with your friend
        </li>
      </ul>
    </Page>
  );
};
