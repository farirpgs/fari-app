import { css } from "@emotion/css";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import React from "react";
import { useHistory } from "react-router-dom";
import accelerated from "../../../images/fate/accelerated.jpg";
import condensed from "../../../images/fate/condensed.jpg";
import core from "../../../images/fate/core.jpg";
import { AppButtonLink } from "../../components/AppLink/AppLink";
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
          subtitle="Select a Fate Variant to Get Started"
        >
          {"Fate System Reference Documents (SRDs)"}
        </Heading>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Fate Condensed"
              description="The latest version of the Fate System. Compact, stand-alone and streamlined for clarity and ease of reference."
              imageSrc={condensed}
              link="/srds/condensed"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Fate Core"
              description="A Complete guide to Fate with rules, examples and tips. A most if your thirst for knowledge wasn't satisfied with Fate Condensed."
              imageSrc={core}
              link="/srds/core"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Fate Accelerated"
              description="If you want to get started quickly, this dialed-down version of Fate Core will get you going in no time."
              imageSrc={accelerated}
              link="/srds/accelerated"
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
SrdsRoute.displayName = "SrdsRoute";

export const SrdCard: React.FC<{
  title: string;
  description: string;
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
      <CardActionArea
        className={css({ height: "100%" })}
        onClick={() => {
          history.push(props.link);
        }}
      >
        <CardMedia
          image={props.imageSrc}
          title={props.title}
          className={css({
            height: "8rem",
          })}
        />
        <CardContent className={css({ height: "100%" })}>
          <Typography gutterBottom variant="h5" component="h2">
            <FateLabel>{props.title}</FateLabel>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={css({ flex: "1 0 auto" })}>
        <Grid container justify="flex-end" alignItems="flex-end">
          <Grid item>
            <AppButtonLink to={props.link} color="primary">
              {"Get Started"}
            </AppButtonLink>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
