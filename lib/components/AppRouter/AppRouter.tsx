import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Images } from "../../constants/Images";
import { DocImport as DocImport } from "../../docs/DocImport";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { SrdsRoute } from "../../routes/SrdsRoute/SrdsRoute";
import { Doc } from "../Doc/Doc";
import { Page } from "../Page/Page";

const HomeRoute = React.lazy(() => import("../../routes/Home/HomeRoute"));

const AboutRoute = React.lazy(() => import("../../routes/About/AboutRoute"));
const BlogPostRoute = React.lazy(
  () => import("../../routes/BlogPost/BlogPostRoute")
);
const BlogPostsRoute = React.lazy(
  () => import("../../routes/BlogPosts/BlogPostsRoute")
);

const CharacterRoute = React.lazy(
  () => import("../../routes/Character/CharacterRoute")
);
const DiceRoute = React.lazy(() => import("../../routes/Dice/DiceRoute"));
const DrawRoute = React.lazy(() => import("../../routes/Draw/DrawRoute"));
const NotFoundRoute = React.lazy(
  () => import("../../routes/NotFound/NotFoundRoute")
);
const PlayOfflineRoute = React.lazy(
  () => import("../../routes/Play/PlayOfflineRoute")
);
const PlayRoute = React.lazy(() => import("../../routes/Play/PlayRoute"));
const SceneRoute = React.lazy(() => import("../../routes/Scene/SceneRoute"));
const OracleRoute = React.lazy(() => import("../../routes/Oracle/OracleRoute"));

export const LoadingRoute: React.FC = (props) => {
  const [fadeIn, setFadeIn] = useState(false);
  const timeout = useRef<any | undefined>(undefined);

  useEffect(() => {
    timeout.current = setTimeout(() => {
      setFadeIn(true);
    }, 400);

    return () => {
      clearTimeout(timeout.current);
    };
  });

  return (
    <Page displayDonation={false}>
      <Fade in={fadeIn}>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        </Container>
      </Fade>
    </Page>
  );
};

export const AppRouter = () => {
  const { t } = useTranslate();
  return (
    <Suspense fallback={<LoadingRoute />}>
      <Switch>
        <Route
          exact
          path={"/"}
          render={(props) => {
            return <HomeRoute />;
          }}
        />
        <Route
          exact
          path={"/characters/:id"}
          render={(props) => {
            return <CharacterRoute {...props} />;
          }}
        />
        <Route
          exact
          path={"/dice"}
          render={(props) => {
            return <DiceRoute />;
          }}
        />
        <Route
          exact
          path={"/oracle"}
          render={(props) => {
            return <OracleRoute />;
          }}
        />
        <Route
          exact
          path={"/draw"}
          render={(props) => {
            return <DrawRoute />;
          }}
        />
        <Route
          exact
          path={"/play"}
          render={(props) => {
            return <PlayRoute {...props} />;
          }}
        />
        <Route
          exact
          path={"/play/:id"}
          render={(props) => {
            return <PlayRoute {...props} />;
          }}
        />
        <Route
          exact
          path={"/play-offline"}
          render={(props) => <PlayOfflineRoute {...props} />}
        />
        <Route
          exact
          path={"/scenes/:id"}
          render={(props) => <SceneRoute {...props} />}
        />
        <Route exact path={"/srds"} render={(props) => <SrdsRoute />} />
        <Route
          exact
          path={"/srds/condensed/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/srds/condensed"
              parent={{ title: "SRDs", url: "/srds" }}
              title="Fate Condensed"
              imageUrl={Images.condensed}
              loadFunction={DocImport.FateCondensed}
              author={{
                title: "Evil Hat Productions",
                items: [
                  {
                    label: "Website",
                    url: "https://www.evilhat.com/home/fate-condensed",
                  },
                  {
                    label: "Itch.io",
                    url: "https://evilhat.itch.io/fate-condensed",
                  },
                  {
                    label: "Drive Thru",
                    url:
                      "https://www.drivethrurpg.com/product/302571/Fate-Condensed",
                  },
                ],
              }}
            />
          )}
        />
        <Route
          exact
          path={"/srds/core/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/srds/core"
              parent={{ title: "SRDs", url: "/srds" }}
              title="Fate Core"
              imageUrl={Images.core}
              loadFunction={DocImport.FateCore}
              author={{
                title: "Evil Hat Productions",
                items: [
                  {
                    label: "Website",
                    url: "https://www.evilhat.com/home/fate-core/",
                  },
                  {
                    label: "Itch.io",
                    url: "https://evilhat.itch.io/fate-core",
                  },
                  {
                    label: "Drive Thru",
                    url:
                      "https://www.drivethrurpg.com/product/114903/Fate-Core-System",
                  },
                ],
              }}
            />
          )}
        />
        <Route
          exact
          path={"/srds/accelerated/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/srds/accelerated"
              parent={{ title: "SRDs", url: "/srds" }}
              title="Fate Accelerated"
              imageUrl={Images.accelerated}
              loadFunction={DocImport.FateAccelerated}
              author={{
                title: "Evil Hat Productions",
                items: [
                  {
                    label: "Website",
                    url: "https://www.evilhat.com/home/fae/",
                  },
                  {
                    label: "Itch.io",
                    url: "https://evilhat.itch.io/fate-accelerated",
                  },
                  {
                    label: "Drive Thru",
                    url:
                      "https://www.drivethrurpg.com/product/114902/Fate-Accelerated-Edition-o-A-Fate-Core-Build",
                  },
                ],
              }}
            />
          )}
        />
        <Route
          exact
          path={"/srds/system-toolkit/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/srds/system-toolkit"
              parent={{ title: "SRDs", url: "/srds" }}
              title="Fate System Toolkit"
              imageUrl={Images.systemToolkit}
              loadFunction={DocImport.FateSystemToolkit}
              author={{
                title: "Evil Hat Productions",
                items: [
                  {
                    label: "Website",
                    url: "https://www.evilhat.com/home/fate-system-toolkit/",
                  },
                  {
                    label: "Itch.io",
                    url: "https://evilhat.itch.io/fate-system-toolkit",
                  },
                  {
                    label: "Drive Thru",
                    url:
                      "https://www.drivethrurpg.com/product/119385/Fate-System-Toolkit",
                  },
                ],
              }}
            />
          )}
        />
        <Route
          exact
          path={"/srds/adversary-toolkit/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/srds/adversary-toolkit"
              parent={{ title: "SRDs", url: "/srds" }}
              title="Fate Adversary Toolkit"
              imageUrl={Images.adversaryToolkit}
              loadFunction={DocImport.FateAdversaryToolkit}
              author={{
                title: "Evil Hat Productions",
                items: [
                  {
                    label: "Website",
                    url: "https://www.evilhat.com/home/fate-adversary-toolkit/",
                  },
                  {
                    label: "Itch.io",
                    url: "https://evilhat.itch.io/fate-adversary-toolkit",
                  },
                  {
                    label: "Drive Thru",
                    url:
                      "https://www.drivethrurpg.com/product/219203/Fate-Adversary-Toolkit",
                  },
                ],
              }}
            />
          )}
        />
        <Route
          exact
          path={"/changelog/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/changelog"
              parent={{ title: "Fari", url: "/" }}
              title="Changelog"
              loadFunction={DocImport.Changelog}
            />
          )}
        />
        <Route
          exact
          path={"/fate-stunts/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/fate-stunts"
              parent={{ title: "SRDs", url: "/srds" }}
              title="Fate Stunts"
              imageUrl={Images.book}
              loadFunction={DocImport.FateStunts}
              author={{
                title: "Evil Hat Productions",
                items: [
                  {
                    label: "Website",
                    url: "https://www.evilhat.com/",
                  },
                  {
                    label: "Wiki",
                    url: "http://evilhat.wikidot.com/fate-core-stunts",
                  },
                ],
              }}
            />
          )}
        />
        <Route
          exact
          path={"/seelie-squire/:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/seelie-squire"
              parent={{ title: "SRDs", url: "/srds" }}
              title="Seelie Squire's Book Of Creatures"
              imageUrl={Images.seelieSquire}
              loadFunction={DocImport.SeelieSquire}
              author={{
                title: "Seelie Squire",
                avatarUrl: Images.seelieSquireAvatar,
                items: [
                  {
                    label: "Patreon",
                    url: "https://www.patreon.com/seeliesquire",
                  },
                  {
                    label: "Discord",
                    url: "https://discord.com/invite/8u3VVZd",
                  },
                  {
                    label: "Reddit",
                    url: "https://www.reddit.com/r/seeliesquire/",
                  },
                ],
              }}
            />
          )}
        />
        a{" "}
        <Route
          exact
          path={"/srds/test:page?"}
          render={(props) => (
            <Doc
              currentPage={props.match.params.page}
              url="/srds/test"
              parent={{
                title: "Parent Title Parent Title Parent Title Parent Title",
                url: "/srds",
              }}
              title="Doc Title Doc Title Doc Title Doc Title"
              imageUrl={Images.book}
              loadFunction={DocImport.Test}
              author={{
                title: "Author Author Author Autho",
                avatarUrl: Images.seelieSquireAvatar,
                items: [
                  {
                    label: "Link1 Link1 Link1 Link1 Link1",
                    url: "",
                  },
                  {
                    label: "Link2 Link2 Link2 Link2 Link2",
                    url: "",
                  },
                ],
              }}
            />
          )}
        />
        <Route
          exact
          path={"/about"}
          render={(props) => {
            return <AboutRoute />;
          }}
        />
        <Route
          exact
          path={"/blog"}
          render={(props) => {
            return <BlogPostsRoute />;
          }}
        />
        <Route
          exact
          path={"/blog/:slug"}
          render={(props) => {
            return <BlogPostRoute slug={props.match.params.slug} />;
          }}
        />
        <Route
          path="*"
          render={(props) => {
            return <NotFoundRoute />;
          }}
        />
      </Switch>
    </Suspense>
  );
};
