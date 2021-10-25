import { css } from "@emotion/css";
import { Theme, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import marked from "marked";
import React from "react";
import { Doc } from "../../components/Doc/Doc";
import { Images } from "../../constants/Images";
import { creatures } from "./domains/creatures";
import {
  ICreature,
  ISeelieSquireCharacter as ICreatureCharacter,
} from "./domains/ICreature";

export const SeelieSquireRoute: React.FC<{
  page: string | undefined;
}> = (props) => {
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Doc
      page={props.page}
      url="/seeliesquire"
      parent={{ title: "SRDs", url: "/srds" }}
      title="Seelie Squire's Book Of Creatures"
      imageUrl={Images.seelieSquire}
      sideBar={{ "+Book of Creatures": ["seelie-squires-book-of-creatures"] }}
      sideBarOptions={{ miscSectionTitle: "Creatures" }}
      loadFunction={async () => {
        return marked(
          makeSeelieSquireMarkdown({
            theme,
            isExtraSmall: isExtraSmall,
          })
        );
      }}
      gitHubLink="https://github.com/fariapp/fari/blob/master/lib/routes/SeelieSquire/domains/creatures.ts"
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
<page-meta author="Seelie Squire" description="Brought to you by Seelie Squire, this is
ultimate resource if you are looking for the closest thing to a
Fate Compendium."></page-meta>

${creatures
  .map((c) => {
    return `
# ${c.title}
<page-meta author="Seelie Squire" ${
      c.image ? `image="${c.image}"` : ""
    }></page-meta>

${c.description}

${renderImage(c)}

${c.character.map((character) => renderCharacter(character)).join("")}

${c.notes ? renderLabel("Notes") : ""}

${c.notes ? c.notes : ""}

`;
  })
  .join("")}`;

  return markdown;

  function renderCharacter(c: ICreatureCharacter) {
    return `
> ## ${c.name} 
>
> ${renderLabel("Aspects")}
> 
> ${renderAspects(c)}
> 
> ${renderLabel("Skills")}
> 
> ${renderSkills(c)}
> 
> ${renderLabel("Health")}
> 
> ${renderHealth(c)}
> ${renderSlots(c)}
> 
> ${renderLabel("Stunts")}
> 
> ${renderStunts(c)}

`;
  }

  function renderLabel(label: string) {
    return `<div class=${bigFateLabelClass}>${label}</div>`;
  }

  function renderImage(c: ICreature) {
    const maxWidth = props.isExtraSmall ? "90%" : "50%";
    return c.image
      ? `<img alt="${c.title}" src="${c.image}" style="max-width: ${maxWidth}" />`
      : "";
  }

  function renderStunts(c: ICreatureCharacter) {
    return c.stunts
      .map(
        (s) => `
> <div class="${smallFateLabelClass}">${s.name}</div>
> ${s.description}`
      )
      .join("<br/><br/>");
  }

  function renderSlots(c: ICreatureCharacter) {
    const slots = c.slots
      .map(
        (s) => `
> <div class="${smallFateLabelClass}">${s.name} [${s.value}]</div>`
      )
      .join("<br/>");

    if (c.slots.length === 0) {
      return "";
    }
    return `
> <br>
> <br>
> ${slots}
> `;
  }

  function renderHealth(c: ICreatureCharacter) {
    return c.tracks
      .map(
        (s) => `
> <div class="${smallFateLabelClass}">${s.name}</div>
> ${s.values.map((sv) => `[${sv}]`).join(" • ")}
> `
      )
      .join("<br/><br/>");
  }

  function renderSkills(c: ICreatureCharacter) {
    return c.skills.map((s) => `- ${s}`).join("\n>");
  }

  function renderAspects(c: ICreatureCharacter) {
    return c.aspects.map((a) => `<code>${a}</code>`).join(` • `);
  }
}
