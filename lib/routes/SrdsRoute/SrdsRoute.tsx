import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import HelpIcon from "@material-ui/icons/Help";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import React from "react";
import { useHistory } from "react-router-dom";
import accelerated from "../../../images/fate/accelerated.jpg";
import condensed from "../../../images/fate/condensed.jpg";
import core from "../../../images/fate/core.jpg";
import { AppButtonLink, AppLink } from "../../components/AppLink/AppLink";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";

export const SrdsRoute: React.FC = (props) => {
  return (
    <Page>
      <PageMeta
        title="Fate System Reference Documents (SRDs)"
        description="Read and search through the Fate System Reference Documents (SRDs) with ease using Fari, The Fate Companion App"
      />
      <Container maxWidth="md">
        <Heading
          icon={MenuBookIcon}
          title={"Fate System Reference Documents (SRDs)"}
          subtitle="Select a Fate variation to get started"
        />
        <Grid container spacing={2}>
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
              imageSrc={condensed}
              link="/srds/condensed"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Fate Core"
              description={
                <>
                  A <strong>Complete guide to Fate</strong> with rules, examples
                  and tips. A most if your thirst for knowledge was not
                  satisfied with Fate Condensed.
                </>
              }
              imageSrc={core}
              link="/srds/core"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Fate Accelerated"
              description={
                <>
                  If you want to <strong>get started quickly</strong>, this
                  dialed-down version of Fate Core will get you going in no
                  time.
                </>
              }
              imageSrc={accelerated}
              link="/srds/accelerated"
            />
          </Grid>
        </Grid>
        <Box pt="1rem" />
        <Heading icon={HelpIcon} title={"Other Resources"} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Book of Monsters"
              description={
                <>
                  Brought to you by <strong>Seelie Squire</strong>, this is
                  ultimate resource if you are looking for the closest thing to
                  a Fate Compendium.
                </>
              }
              imageSrc={
                "https://c10.patreonusercontent.com/3/eyJ3IjoxOTIwfQ%3D%3D/patreon-media/p/campaign/2382411/fca500c1d23c43c58c463b50b3d29ff0/3.png?token-time=1612396800&token-hash=EwHVhjbJhua1WXfwdp8f53r_Dx5kjHv4wvrgx4ZCgWU%3D"
              }
              link="/seelie-squire"
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
SrdsRoute.displayName = "SrdsRoute";

export const SrdCard: React.FC<{
  title: string | JSX.Element;
  description: string | JSX.Element;
  imageSrc: string;
  link: string;
}> = (props) => {
  const history = useHistory();
  return (
    <Card
      className={css({
        height: "100%",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <Box height="100%">
        <AppLink to={props.link}>
          <CardMedia
            image={props.imageSrc}
            title={props.title as string}
            className={css({
              height: "8rem",
            })}
          />
        </AppLink>
        <CardContent className={css({ height: "100%" })}>
          <Typography gutterBottom variant="h5" component="h2">
            <AppLink to={props.link}>
              <FateLabel>{props.title}</FateLabel>
            </AppLink>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.description}
          </Typography>
        </CardContent>
      </Box>
      <CardActions className={css({ flex: "1 0 auto" })}>
        <Grid container justify="flex-end" alignItems="flex-end">
          <Grid item>
            <AppButtonLink to={props.link} color="primary">
              {"Read"}
            </AppButtonLink>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
