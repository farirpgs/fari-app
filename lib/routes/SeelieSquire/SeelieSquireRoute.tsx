import { css } from "@emotion/css";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import { Doc } from "../../components/Doc/Doc";
import { Images } from "../../constants/Images";
import { creatures, ICreature } from "./domains/Creatures";

export const SeelieSquireRoute: React.FC<{
  page: string;
}> = (props) => {
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  return (
    <Doc
      page={props.page}
      url="/seelie-squire"
      parent={{ title: "SRDs", url: "/srds" }}
      title="Seelie Squire's Book Of Creatures"
      imageUrl={Images.seelieSquire}
      sideBar={{ "+Book of Creatures": ["seelie-squires-book-of-creatures"] }}
      sideBarOptions={{ miscSectionTitle: "Creatures" }}
      loadFunction={async () => {
        return makeSeelieSquireMarkdown({ theme, isExtraSmall: isExtraSmall });
      }}
      gitHubLink="https://github.com/fariapp/fari/tree/master/lib/docs/seelie-squire.md"
      noIndex
      author={{
        title: "Seelie Squire",
        avatarUrl: Images.seelieSquireAvatar,
        items: [
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
  );
};

export default SeelieSquireRoute;

function makeSeelieSquireMarkdown(props: {
  theme: Theme;
  isExtraSmall: boolean;
}): string {
  const bigFateLabelClass = css({
    color: props.theme.palette.primary.main,
    textTransform: "uppercase",
    fontSize: "1.15rem",
    fontWeight: 800,
    fontFamily: "Inter,HelveticaNeue,Helvetica,Arial,sans-serif !important",
    marginTop: "1rem",
    marginBottom: "1rem",
  });

  const smallFateLabelClass = css({
    textTransform: "uppercase",
    fontSize: "1rem",
    fontWeight: 800,
    fontFamily: "Inter,HelveticaNeue,Helvetica,Arial,sans-serif !important",
    textDecoration: "none",
  });

  const markdown = `
# Seelie Squire's Book of Creatures

... 

${creatures.map((c) => {
  return `
# ${c.title}

${c.description}

> ${renderImage(c)}
> 
> ## ${c.character.name} 
>
> <div class=${bigFateLabelClass}>Aspects</div>
> 
> ${renderAspects(c)}
> 
> <div class=${bigFateLabelClass}>Skills</div>
> 
> ${renderSkills(c)}
> 
> <div class=${bigFateLabelClass}>Health</div>
> 
> ${renderHealth(c)}
> 
> <div class=${bigFateLabelClass}>Stunts</div>
> 
> ${renderStunts(c)}
>
> <div class=${bigFateLabelClass}>Notes</div>
> 
> ${c.character.notes ?? ""}
`;
})}`;

  return markdown;

  function renderImage(c: ICreature) {
    const maxWidth = props.isExtraSmall ? "90%" : "50%";
    return c.character.image
      ? `<img alt="${c.character.name}" src="${c.character.image}" style="max-width: ${maxWidth}" />`
      : "";
  }

  function renderStunts(c: ICreature) {
    return c.character.stunts
      .map(
        (s) => `
> <div class=${smallFateLabelClass}>${s.name}</div>
> ${s.description}`
      )
      .join("<br/><br/>");
  }

  function renderHealth(c: ICreature) {
    return c.character.tracks
      .map(
        (s) => `
> <div class=${smallFateLabelClass}>${s.name}</div>
> ${s.values.map((sv) => `[${sv}]`).join(" • ")}
> `
      )
      .join("<br/><br/>");
  }

  function renderSkills(c: ICreature) {
    return c.character.skills.map((s) => `- ${s}`).join("\n>");
  }

  function renderAspects(c: ICreature) {
    return c.character.aspects.map((a) => `<code>${a}</code>`).join(` • `);
  }
}
