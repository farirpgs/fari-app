import { IDocProps } from "../../components/Doc/Doc";
import { Images } from "../../constants/Images";
import { DocImport } from "./DocImport";

export const DocRoutes: Array<Omit<IDocProps, "page" | "section">> = [
  {
    url: "/srds/condensed",
    parent: { title: "SRDs", url: "/srds" },
    title: "Fate Condensed",
    imageUrl: Images.condensed,
    loadFunction: DocImport.FateCondensed,

    gitHubLink:
      "https://github.com/fariapp/fari/tree/master/docs/fate-condensed.md",
    author: {
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
          url: "https://www.drivethrurpg.com/product/302571/Fate-Condensed",
        },
      ],
    },
  },
  {
    url: "/srds/core",
    parent: { title: "SRDs", url: "/srds" },
    title: "Fate Core",
    imageUrl: Images.core,
    loadFunction: DocImport.FateCore,
    gitHubLink: "https://github.com/fariapp/fari/tree/master/docs/fate-core.md",
    author: {
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
          url: "https://www.drivethrurpg.com/product/114903/Fate-Core-System",
        },
      ],
    },
  },
  {
    url: "/srds/accelerated",
    parent: { title: "SRDs", url: "/srds" },
    title: "Fate Accelerated",
    imageUrl: Images.accelerated,
    loadFunction: DocImport.FateAccelerated,
    gitHubLink:
      "https://github.com/fariapp/fari/tree/master/docs/fate-accelerated.md",
    author: {
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
          url: "https://www.drivethrurpg.com/product/114902/Fate-Accelerated-Edition-o-A-Fate-Core-Build",
        },
      ],
    },
  },
  {
    url: "/srds/system-toolkit",
    parent: { title: "SRDs", url: "/srds" },
    title: "Fate System Toolkit",
    imageUrl: Images.systemToolkit,
    loadFunction: DocImport.FateSystemToolkit,
    gitHubLink:
      "https://github.com/fariapp/fari/tree/master/docs/fate-adversary-toolkit.md",
    author: {
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
          url: "https://www.drivethrurpg.com/product/119385/Fate-System-Toolkit",
        },
      ],
    },
  },
  {
    url: "/srds/adversary-toolkit",
    parent: { title: "SRDs", url: "/srds" },
    title: "Fate Adversary Toolkit",
    imageUrl: Images.adversaryToolkit,
    loadFunction: DocImport.FateAdversaryToolkit,
    gitHubLink:
      "https://github.com/fariapp/fari/tree/master/docs/fate-system-toolkit.md",
    author: {
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
          url: "https://www.drivethrurpg.com/product/219203/Fate-Adversary-Toolkit",
        },
      ],
    },
  },
  {
    url: "/fate-stunts",
    parent: { title: "SRDs", url: "/srds" },
    title: "Fate Stunts",
    imageUrl: Images.book,
    loadFunction: DocImport.FateStunts,
    gitHubLink:
      "https://github.com/fariapp/fari/tree/master/docs/fate-stunts.md",
    author: {
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
    },
    sideBar: {
      "+Fate Stunts": [
        "fate-stunts",
        {
          "+Skills": [
            "athletics-stunts",
            "burglary-stunts",
            "contacts-stunts",
            "crafts-stunts",
            "deceive-stunts",
            "drive-stunts",
            "empathy-stunts",
            "fight-stunts",
            "investigate-stunts",
            "lore-stunts",
            "notice-stunts",
            "physique-stunts",
            "provoke-stunts",
            "rapport-stunts",
            "resources-stunts",
            "shoot-stunts",
            "stealth-stunts",
            "will-stunts",
          ],
        },
      ],
      "Stunt Rubrics": [
        "add-a-new-action-to-a-skill",
        "add-a-bonus-to-an-action",
        "create-a-rules-exception",
        { "+Miscellaneous": ["other-rubrics"] },
      ],
    },
  },
  {
    url: "/scene-checklist",
    parent: { title: "SRDs", url: "/srds" },
    title: "Scene Checklist",
    loadFunction: DocImport.SceneCheckist,
    gitHubLink:
      "https://github.com/fariapp/fari/tree/master/docs/scene-checklist.md",
    imageUrl: Images.scene,
    author: {
      title: "LAURENCE MACNAUGHTON",
      items: [
        {
          label: "Website",
          url: "https://laurencemacnaughton.com/",
        },
      ],
    },
  },
  {
    url: "/cheat-sheet",
    parent: { title: "SRDs", url: "/srds" },
    title: "Cheat Sheet",
    loadFunction: DocImport.CheatSheet,
    gitHubLink:
      "https://github.com/fariapp/fari/tree/master/docs/cheat-sheet.md",
    imageUrl: Images.cheatSheet,
    maxWidth: "lg",
    author: {
      title: "famousbirds",
      items: [
        {
          label: "Twitter",
          url: "https://twitter.com/famousbirds",
        },
        {
          label: "Reddit",
          url: "https://www.reddit.com/user/famousbirds",
        },
      ],
    },
  },
  {
    url: "/dials",
    parent: { title: "SRDs", url: "/srds" },
    title: "Dials",
    loadFunction: DocImport.Dials,
    gitHubLink: "https://github.com/fariapp/fari/tree/master/docs/dials.md",
    imageUrl: Images.dials,
    sideBar: {
      "+Fari": [
        "dials",
        {
          "+Rules": [
            "props-from-return-to-the-stars",
            "quick-conflicts-from-spirit-of-the-century",
            "magic-aspect-based-narration",
            "using-ammo-in-fate",
            "chase",
          ],
        },
      ],
    },
  },
  {
    url: "/srds/test",
    parent: {
      title: "Parent Title Parent Title Parent Title Parent Title",
      url: "/srds",
    },
    title: "Doc Title Doc Title Doc Title Doc Title",
    imageUrl: Images.book,
    loadFunction: DocImport.Test,
    gitHubLink: "https://github.com/fariapp/fari/tree/master/docs/test.md",
    author: {
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
    },
  },
  {
    url: "/srds/test-empty",
    parent: {
      title: "Fari",
      url: "/",
    },
    title: "Test Empty",
    loadFunction: DocImport.TestEmpty,
    gitHubLink:
      "https://github.com/fariapp/fari/tree/master/docs/test-empty.md",
  },
  {
    url: "/success-with-style",
    parent: { title: "Fari", url: "/" },
    title: "Success With Style",
    loadFunction: DocImport.SuccessWithStyle,
    gitHubLink:
      "https://github.com/fariapp/fari/tree/master/docs/success-with-style.md",
    imageUrl: Images.successWithStyle,
    sideBar: {
      "+Success With Style": ["introduction"],
    },
    sideBarOptions: {
      miscSectionTitle: "Fate Pointers",
    },
  },
  {
    url: "/fari-wiki",
    parent: { title: "Fari", url: "/" },
    title: "Fari Wiki",
    loadFunction: DocImport.FariWiki,
    gitHubLink: "https://github.com/fariapp/fari/tree/master/docs/fari-wiki.md",
    imageUrl: Images.logo,
    sideBar: {
      "+Fari Wiki": ["introduction"],
      "+Getting Started": [
        "playing",
        "managing-characters",
        "managing-scenes",
        "tips-and-tricks",
        "data",
      ],
    },
  },
  {
    url: "/blog",
    parent: { title: "Fari", url: "/" },
    title: "Blog",
    loadFunction: DocImport.Blog,
    gitHubLink: "https://github.com/fariapp/fari/tree/master/docs/blog.md",
    defaultSideBarCategory: "Blog",
    sideBar: {
      "+Blog": [
        "welcome",
        {
          "+2021": [
            "fari-v500",
            "fari-v400",
            "fari-v370",
            "fari-v360",
            "moments-in-fate",
          ],
        },
      ],
    },
  },
  {
    url: "/changelog",
    parent: { title: "Fari", url: "/" },
    title: "Changelog",
    loadFunction: DocImport.Changelog,
  },
  {
    url: "/pt-br/srds/condensed",
    parent: { title: "SRDs", url: "/srds" },
    title: "Fate Condensado",
    imageUrl: Images.condensed,
    loadFunction: DocImport.FateCondensedPtBr,
    gitHubLink:
      "https://github.com/fariapp/fari/tree/master/docs/fate-condensed-pt-br.md",
    author: {
      title: "Bruno José F. de S. Peixoto / Evil Hat Productions",
      items: [
        {
          label: "Bruno's Twitter",
          url: "https://twitter.com/BrubruGeek",
        },
        {
          label: "EHP Website",
          url: "https://www.evilhat.com/home/fate-condensed",
        },
        {
          label: "EHP Itch.io",
          url: "https://evilhat.itch.io/fate-condensed",
        },
        {
          label: "EHP Drive Thru",
          url: "https://www.drivethrurpg.com/product/302571/Fate-Condensed",
        },
      ],
    },
  },
];
