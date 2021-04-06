import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import HelpIcon from "@material-ui/icons/Help";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import React from "react";
import { AppLink } from "../../components/AppLink/AppLink";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { Images } from "../../constants/Images";

export const SrdsRoute: React.FC = (props) => {
  return (
    <Page>
      <PageMeta
        title="Fate System Reference Documents (SRDs)"
        description="Read and search through the Fate System Reference Documents (SRDs) with ease using Fari, The Fate Companion App"
      />
      <Container maxWidth="md">
        <Srds />
      </Container>
    </Page>
  );
};
SrdsRoute.displayName = "SrdsRoute";

export const Srds: React.FC = (props) => {
  return (
    <div>
      <Heading
        icon={MenuBookIcon}
        title={"Fate System Reference Documents"}
        subtitle="Getting Started"
      />
      <SrdItems />
      <Box pt="1rem" />
      <ToolkitItems />
      <Box pt="2rem" />
      <Heading icon={HelpIcon} title={"Wikis & Resources"} />
      <WikiItems />
    </div>
  );
};

export const SrdItems: React.FC = (props) => {
  return (
    <Box>
      <Grid container spacing={4} justify="center">
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Fate Condensed"
            description={
              <>
                The latest version of the Fate System.
                <strong>Compact, stand-alone and streamlined</strong> for
                clarity and ease of reference.
              </>
            }
            bgColor="#007fda"
            imageUrl={Images.condensed}
            link="/srds/condensed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Fate Core"
            description={
              <>
                A <strong>Complete guide to Fate</strong> with rules, examples
                and tips. A most if your thirst for knowledge was not satisfied
                with Fate Condensed.
              </>
            }
            bgColor="#00409d"
            imageUrl={Images.core}
            link="/srds/core"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Fate Accelerated"
            description={
              <>
                If you want to <strong>get started quickly</strong>, this
                dialed-down version of Fate Core will get you going in no time.
              </>
            }
            bgColor="#005aba"
            imageUrl={Images.accelerated}
            link="/srds/accelerated"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export const ToolkitItems: React.FC = (props) => {
  return (
    <Box>
      <Grid container spacing={4} justify="center">
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Fate System Toolkit"
            description={
              <>
                This expansion for the Fate Core System contains tons of
                flexible, hackable and adaptable rules that fits any world you
                are trying to play in.
              </>
            }
            bgColor="#442d74"
            imageUrl={Images.systemToolkit}
            link="/srds/system-toolkit"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Fate Adversary Toolkit"
            description={
              <>
                What ever the genre, this book gives you the tools you need to
                create great obstacles for you stories.
              </>
            }
            bgColor="#1e171c"
            imageUrl={Images.adversaryToolkit}
            link="/srds/adversary-toolkit"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Dials"
            description={
              <>
                Useful rules you can pick and choose to hack your Fate campaign.
              </>
            }
            bgColor="#0a0f1c"
            imageUrl={Images.dials}
            link="/dials"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export const WikiItems: React.FC = (props) => {
  return (
    <Box>
      <Grid container spacing={4} justify="center">
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Fari Wiki"
            description={<>Tips and detailed explanation on everything Fari.</>}
            bgColor="#0c2b69"
            imageUrl={Images.logo}
            link="/fari-wiki"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Success With Style"
            description={
              <>
                A searchable supply of ideas; these Fate pointers help you
                succeed with style!
              </>
            }
            bgColor="#080303"
            imageUrl={Images.successWithStyle}
            link="/success-with-style"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Book of Monsters"
            description={
              <>
                Brought to you by <strong>Seelie Squire</strong>, this is
                ultimate resource if you are looking for the closest thing to a
                Fate Compendium.
              </>
            }
            bgColor="#3c5c39"
            imageUrl={Images.seelieSquire}
            link="/seeliesquire"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Fate Stunts"
            description={
              <>
                A big list of stunt examples to get you started with character
                creation.
              </>
            }
            bgColor="#223031"
            imageUrl={Images.book}
            link="/fate-stunts"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DocCard
            title="Cheat Sheet"
            description={
              <>
                Your handy tool for a quick access to the most important rules
                during a session.
              </>
            }
            bgColor="#030200"
            imageUrl={Images.cheatSheet}
            link="/cheat-sheet"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export const DocCard: React.FC<{
  title: string | JSX.Element;
  description: string | JSX.Element;
  bgColor?: string;
  imageUrl?: string;
  link: string;
}> = (props) => {
  const theme = useTheme();
  const backgroundColor = props.bgColor ?? theme.palette.background.paper;
  const color = theme.palette.getContrastText(backgroundColor);
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ButtonBase
      className={css({
        "height": "100%",
        "display": "inline-block",
        "textAlign": "left",
        "width": "100%",
        "transition": theme.transitions.create(["transform"]),
        "&:hover": {
          transform: isSmall ? undefined : "scale(1.05)",
        },
      })}
    >
      <AppLink to={props.link}>
        <Card
          raised
          className={css({
            "height": "100%",
            "display": "flex",
            "flexDirection": "column",
            "background": backgroundColor,
            "boxShadow": theme.shadows[8],
            "transition": theme.transitions.create(["box-shadow"]),
            "&:hover": {
              boxShadow: isSmall ? undefined : theme.shadows[16],
            },
          })}
        >
          <Box height="100%">
            <CardMedia
              image={props.imageUrl ?? ""}
              title={props.title as string}
              className={css({
                height: "8rem",
                maskImage:
                  "linear-gradient(to bottom, black 50%, transparent 100%)",
              })}
            />
            <CardContent className={css({ height: "100%" })}>
              <Box pb="1rem">
                <Typography gutterBottom variant="h5" component="h2">
                  <FateLabel
                    textColor={color}
                    fontSize={theme.typography.h5.fontSize}
                    uppercase={false}
                  >
                    {props.title}
                  </FateLabel>
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  className={css({
                    color: color,
                  })}
                >
                  {props.description}
                </Typography>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </AppLink>
    </ButtonBase>
  );
};

DocCard.displayName = "DocCard";
