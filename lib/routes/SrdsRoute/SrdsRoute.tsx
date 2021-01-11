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
        title={"Fate System Reference Documents (SRDs)"}
        subtitle="Getting Started"
      />
      <SrdItems />
      <Box pt="1rem" />

      <Heading
        icon={HelpIcon}
        title={"Other Resources"}
        subtitle={"Compendium, Stunt examples and more..."}
      />
      <OtherResourcesItems />
    </div>
  );
};

export const SrdItems: React.FC = (props) => {
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <SrdCard
            title="Fate Condensed"
            description={
              <>
                The latest version of the Fate System.
                <br />
                <strong>Compact, stand-alone and streamlined</strong> for
                clarity and ease of reference.
              </>
            }
            bgColor="#007fda"
            imageSrc={Images.condensed}
            link="/srds/condensed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SrdCard
            title="Fate Core"
            description={
              <>
                A <strong>Complete guide to Fate</strong> with rules, examples
                and tips. A most if your thirst for knowledge was not satisfied
                with Fate Condensed.
              </>
            }
            bgColor="#00409d"
            imageSrc={Images.core}
            link="/srds/core"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SrdCard
            title="Fate Accelerated"
            description={
              <>
                If you want to <strong>get started quickly</strong>, this
                dialed-down version of Fate Core will get you going in no time.
              </>
            }
            bgColor="#005aba"
            imageSrc={Images.accelerated}
            link="/srds/accelerated"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export const OtherResourcesItems: React.FC = (props) => {
  return (
    <Box>
      <Grid container spacing={4} justify="center">
        <Grid item xs={12} sm={6} md={4}>
          <SrdCard
            title="Book of Monsters"
            description={
              <>
                Brought to you by <strong>Seelie Squire</strong>, this is
                ultimate resource if you are looking for the closest thing to a
                Fate Compendium.
              </>
            }
            bgColor="#3c5c39"
            imageSrc={Images.seelieSquire}
            link="/seelie-squire"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SrdCard
            title="Fate Stunts"
            description={
              <>
                A big list of stunt examples to get you started with character
                creation.
              </>
            }
            bgColor="#223031"
            imageSrc={Images.book}
            link="/fate-stunts"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export const SrdCard: React.FC<{
  title: string | JSX.Element;
  description: string | JSX.Element;
  bgColor?: string;
  imageSrc?: string;
  link: string;
}> = (props) => {
  const theme = useTheme();
  const backgroundColor = props.bgColor ?? theme.palette.background.paper;
  const color = theme.palette.getContrastText(backgroundColor);

  return (
    <ButtonBase
      className={css({
        height: "100%",
        display: "inline-block",
        textAlign: "left",
        width: "100%",
      })}
    >
      <AppLink to={props.link}>
        <Card
          raised
          className={css({
            // "cursor": "pointer",
            "height": "100%",
            "display": "flex",
            "flexDirection": "column",
            "background": backgroundColor,
            "boxShadow": theme.shadows[8],
            "transition": theme.transitions.create(["transform", "box-shadow"]),
            "&:hover": {
              boxShadow: theme.shadows[16],
              transform: "scale(1.05)",
            },
          })}
        >
          <Box height="100%">
            <CardMedia
              image={props.imageSrc ?? ""}
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
                  >
                    {props.title}
                  </FateLabel>
                </Typography>
                <Typography
                  variant="body2"
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
