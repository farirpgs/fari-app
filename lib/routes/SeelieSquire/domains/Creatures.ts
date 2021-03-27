import { ICreature } from "./ICreature";

export const creatures: Array<ICreature> = [
  {
    title: "Draguin",
    description:
      "Draguins appear to be some ungodly mix of fearsome wyverns and your favorite polar-weather flightless birds. They are carnivorous ambush predators, hunting alone or in groups of two to four.\n\n***Massive and Mobile.*** Draguins have an immense wingspan densely packed with small black and white feathers. In addition to swimming and flying, these beasts can use their slick hides to glide seamlessly across ice and snow. Even when immobilized, a draguin can be quite difficult to take down due to their thick, polar hides. This combination of size and speed can be devastating for anyone unlucky enough to engage a draguin unprepared.\n\n***Ice Breaker.*** The beak is the most durable part of a draguin. While primarily used for pecking prey and cracking ice while swimming, it is not uncommon for a draguin to use its beak offensively, creating uneven ground or shattering frozen shelves to ambush their surprised bounty from below. ",
    character: [
      {
        name: "Draguin",
        aspects: [
          "Ferocious",
          "Can swim AND fly",
          "Excitable",
          "Cold weather conditioning",
        ],
        tracks: [
          { name: "Physical Stress", values: ["1", "2", "3", "4"] },
          { name: "Mental Stress", values: ["1", "2"] },
        ],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate physical consequence", value: "4" },
        ],
        skills: [
          "+4 Razor claws (Fight)",
          "+4 Thick skin (Physique)",
          "+4 Vigor (Athletics)",
          "+3 Keen eyes (Notice)",
          "+3 Terrify (Provoke)",
          "+3 Feisty (Will)",
        ],
        stunts: [
          {
            name: "Ravage",
            description:
              "When the draguin Fights with its razor claws, it may make a razor claw attack against all other enemies it shares a zone with, rather than a single target.",
          },
          {
            name: "Shatter-beak",
            description:
              "The draguin may use its action to make a Fantastic (+6) fight check against nearby ice. If successful, the ice will crack or shatter. The draguin may spend a fate point to automatically succeed on this check.",
          },
          {
            name: "Slide, swim, fly",
            description:
              "The draguin can move an additional zone each turn in combat if on ice, snow, in water, or flying.",
          },
        ],
      },
    ],
    notes:
      "A note for the GM: Draguins are quite powerful. A party of four characters with the default stats and abilities will likely have a hard time taking one of these down without proper preparation and an escape plan. I would advise against pitting new players against this monster.",
    image:
      "https://c10.patreonusercontent.com/3/eyJyb3RhdGUiOjAsInciOjgyMH0%3D/patreon-media/p/post/27112219/8cd050dce30f4d20a65cf711a7ea21be/1.png?token-time=1617925976&token-hash=82O0SuXxO2gM33bMWz_ETqL4O8lPNYluxpagO5PVwhE%3D",
  },
  {
    title: "Night Spine",
    description:
      "The night spine is a large nocturnal herbivore that roams the night foraging for food. It resembles a hefty porcupine with a charcoal black hide.\n\n***Sedative Spines.*** These brutes are covered from the back of their necks to the base of their tales in sharp, outward facing spines. The tip of each of these spines secretes a strong sedative meant to subdue any would-be attackers the night spine encounters. With a quick muscle contraction the night spine can launch a spine from its back into a foe, rendering them bloody, and in most cases, unconscious.\n\n***Territorial.*** Night spine live in solitude. They are quite territorial, and their excellent hearing often forces the surrounding animals into silence out of fear for disturbing them. It is common for the night spine to feign that they do not know the presence of other creatures, only to attack suddenly and without relent. \n\n***Lucrative.*** While most people avoid a run in with a night spine when they can, some go out of their way to hunt them. Their hide can fetch a modest price, and their spines often sell as a novelty. The real prize, however, is the secretion from their spines, which can be processed into a salve to treat insomnia and other symptoms to common ailments.",
    character: [
      {
        name: "Night Spine",
        aspects: ["Large spiny herbivore", "Immobile / immovable"],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+5 Excellent hearing (Notice)",
          "+4 Tough hide (Physique)",
          "+4 Spit spine (Shoot)",
          "+3 Stubborn spirit (Will)",
        ],
        stunts: [
          {
            name: "Sleep spine",
            description:
              "After a target is hit by the night spine’s Shoot attack, they must make a Physique check with a Fair (+2) difficulty. If they fail, they fall unconscious. If they succeed, they gain the *Sleepy* aspect.",
          },
          {
            name: "Twitchy",
            description:
              "Immediately after the night spine is attacked for the first time in a scene, it may Fight or Shoot the attacker.",
          },
          {
            name: "Will to live",
            description:
              "If the night spine has at least two stress boxes checked it may spit spine (Shoot) an additional spine on any turn it would Fight or Shoot.",
          },
        ],
      },
    ],
    image:
      "https://c10.patreonusercontent.com/3/eyJyb3RhdGUiOjAsInciOjgyMH0%3D/patreon-media/p/post/27113093/bd6ca9d7407d4d95b0e7e8e66e4092aa/1.png?token-time=1617926239&token-hash=9lkmAhyNhL5ZzV76O1NdMD_5RuQtK5v81AV73Ef-POU%3D",
  },
  {
    title: "Armored Arbor",
    description:
      "Deep in an overgrown forest, vines and stems twist together into humanoid silhouettes. Armored arbors are plantoid soldiers that wield bark shields and thorny blades, obeying the command of whoever raised them from the ground.\n\n***From Seed to Soldier.*** Armored arbors begin their life cycle as small seeds which are planted in the ground and watered. Once the arbor sprouts from the ground and grows its humanoid tendrils, it pulls its roots from the earth and begins its mobile life. The sprout will continue to grow larger and stronger until it weaves itself into a mess of vines and other plant matter.\n\n***Primitive and Steadfast.*** These creatures are capable of primitive thought, and in the wild will form societies that live and protect one another. They have a strong sense of kinship, clinging to whoever raised them as their family. For those lucky enough to get their hands on armored arbor seeds, this means one could grow a small army for themselves.\n\n***Unknown Origin.*** No one knows for sure where the first seeds for these soldiers came from. It has been speculated that these creatures started as the legacy of some powerful druid. Others believe the arbors were created by the gods themselves.",
    character: [
      {
        name: "Armored Arbor Seedling",
        aspects: ["Flammable", "Primitive thought"],
        tracks: [{ name: "Stress", values: ["1"] }],
        slots: [],
        skills: [
          "+1 Thorns (Fight)",
          "+1 Overgrowth (Crafts)",
          "-1 Overlook (Investigation and Notice)",
        ],
        stunts: [],
      },
      {
        name: "Armored Arbor",
        aspects: ["Flammable", "Primitive thought"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Moderate physical consequence", value: "4" }],
        skills: [
          "+3 Ivy blade (Fight)",
          "+1 Overgrowth (Crafts)",
          "-1 Overlook (Investigation and Notice)",
        ],
        stunts: [
          {
            name: "Regrowth",
            description:
              "An armored arbor may use its action to make an Overgrowth (Crafts) check. The armored arbor may heal a stress box of equal or lower value to the result of the check. If the armored arbor is standing or swimming in a pool of water, add +2 to the Overgrowth (Crafts) check for Regrowth.",
          },
        ],
      },
      {
        name: "Elder Armored Arbor",
        aspects: ["Flammable", "Primitive thought"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [
          { name: "Mild physical consequence", value: "2" },
          { name: "Moderate physical consequence", value: "4" },
        ],
        skills: [
          "+3 Ivy blade (Fight)",
          "+2 Overgrowth (Crafts)",
          "-1 Overlook (Investigation and Notice)",
        ],
        stunts: [
          {
            name: "Regrowth",
            description:
              "An elder armored arbor may use its action to make an Overgrowth (Crafts) check. The elder armored arbor may heal a stress box of equal or lower value to the result of the check. If the elder armored arbor is standing or swimming in a pool of water, add +2 to the Overgrowth (Crafts) check for Regrowth.",
          },
          {
            name: "Tangle",
            description:
              "When the elder armored arbor takes damage from a melee attack, they may make an Overgrowth (Crafts) check with difficulty equal to the damage dealt. If they succeed, they may create a *Tangled* aspect on the character that attacked them with one free invoke.",
          },
        ],
      },
    ],
    image:
      "https://c10.patreonusercontent.com/3/eyJyb3RhdGUiOjAsInciOjgyMH0%3D/patreon-media/p/post/27685430/82de3a2b6d064a14a2b47ccee748aaff/1.png?token-time=1617764644&token-hash=JjtrfqOKUcQWQk7jTm6Fj-DdWAAaWtuhvR28biotiRs%3D",
  },
  {
    title: "Gnarlock",
    description:
      "Gnarlocks are a twisted bunch of humanoids that live in the desert. They worship the searing pain of the sun, decorating themselves in blisters and terrifying nearby settlements.\n\n***Blistered and bandaged.*** You can tell a gnarlock by their almost-pink husk. Years of masochistic rituals have left their bodies covered in scars and blisters. They wrap themselves in light bandages to keep out the elements, but welcome in the pain of the sandstorms when they come. They are decrepit reflections of suffering.\n\n***Desert Schemers.*** Civilized society can never quite get a handle on a gnarlock’s motivation, but everyone familiar with them knows that their pursuits are no-good. Settlers of nearby towns rest uneasily, kept awake at night by the foreboding sense that another villager will be stolen away for the gnarlock’s sickening magics. \n\n***Unsavory Pets.*** Gnarlocks keep with them large, menacing pets called scar hounds. These beasts stand in size somewhere between large canines and bears, and carry themselves similarly. Though their undersides have thick, black hair, their backs are barren and pink, with wounds like their masters. A thick steam rises threateningly from their hides, obscuring the air above them. It is rumored that gnarlocks steal peoples family pets and turn them into these beast through agonizing rituals.",
    character: [
      {
        name: "Gnarlock",
        aspects: ["Bandaged and blistered", "Glutton for pain"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Searing dart (Magic)",
          "+2 Pain tolerance (Will)",
          "-1 Decrepit (Athletics)",
        ],
        stunts: [
          {
            name: "Arcane arts",
            description:
              "The gnarlock may use Magic in place of Shoot checks and Lore checks related to the arcane.",
          },
          {
            name: "Pain conduit",
            description:
              "If the gnarlock does not have a mild consequence, it may use its action to make a Magic attack roll against a target in its zone. If the attack hits, instead of dealing damage, the gnarlock AND the target gain the same mild consequence of the gnarlocks choice. If the target already has a mild consequence, the new consequence takes up the targets lowest consequence slot. If all of the targets consequences are already filled, the target is taken out.",
          },
        ],
      },
      {
        name: "Scar Hound",
        aspects: ["Steaming hide", "Hot to the touch"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [
          { name: "Mild physical consequence", value: "2" },
          { name: "Mild physical consequence", value: "2" },
        ],
        skills: [
          "+3 Gnaw (Fight)",
          "+3 Adrenaline (Athletics)",
          "+2 Guard (Notice)",
          "-1 Barrel (Stealth)",
        ],
        stunts: [
          {
            name: "Lock jaw",
            description:
              "After hitting an enemy with a Fight attack, the scar hound may choose to forgo dealing damage to add an *Iron grip* aspect to their target. As long as this aspect remains in play, the target may not move out of the scar hound’s zone.",
          },
        ],
      },
    ],
    notes:
      'A note for the GM: The Magic skill may not be used in your setting. In that case, replace the gnarlock\'s Magic with Lore, and change its Arcane arts stunt to read, "The gnarlock may use Lore in place of Shoot checks."',
    image:
      "https://c10.patreonusercontent.com/3/eyJyb3RhdGUiOjAsInciOjgyMH0%3D/patreon-media/p/post/27864972/07c6c31620114151b4c9646166a40767/1.png?token-time=1617765466&token-hash=4nfNvh-4lEwjICIl2TecvVVptWg6OUusBbfiH1bBhbE%3D",
  },
  {
    title: "Squibimp",
    description:
      "Squibimps are small, humanoid-shaped creatures that crawl and bound from place to place. They have insect-like mandibles and scaly skin. They love to take what isn’t theirs, and have a penchant for bad luck.\n\n***Luck Leech.*** The squibimp’s primary source of sustenance is the misfortune of others. Because of this, these creatures live and thrive wherever bad luck can be found. It is common for squibimps to lurk in the darkness of crowded alleys at night, or just beyond the edges of forests, waiting for a chance to sow chaos. If a squibimp cannot find a healthy source of misfortune, they will go out of their way to cause it themselves.\n\n***Impulsive Collectors.*** The only thing a squibimp likes as much as misfortune is a nice shiny object. These rambunctious critters will seize every opportunity to steal something that they find pretty and leap away, with little regard for others. Squibimps don’t understand the concept of cleaning, and will discard their loot as soon as it collects too much grime. \n\n***Elusive and Resourceful.*** When confronted by someone trying to stop them, squibimps have proven to be quite resourceful, using the environment around them to stave off their pursuers. They will knock things over, spill things, and move through tight spaces just to avoid capture. They are also surprisingly competent when it comes to goading their chasers into taking a wrong turn.",
    character: [
      {
        name: "Squibimp",
        aspects: [
          "Bringer of bad luck",
          "Hard to pin down",
          "Shiny-thing connoisseur",
        ],
        tracks: [{ name: "Stress", values: ["1"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+4 Badger (Provoke)",
          "+4 Exactly what I needed (Resources)",
          "+3 Kleptomania (Burglary)",
          "+3 Tricky (Deceive)",
          "+3 Energetic (Athletics)",
          "+3 Deft (Stealth)",
        ],
        stunts: [
          {
            name: "Goad",
            description:
              "When the squibimp hits with a Provoke attack it can chose to goad the target instead of inflicting mental stress. The target of the goad will attempt to move one zone in a direction of the squibimp’s choosing. A target cannot be goaded into moving directly into harm's way; for example, jumping off of a cliff or running into a fire.",
          },
          {
            name: "Friend of fate",
            description:
              "All fate points spent in a scene with a squibimp go directly to the squibimp. If there are multiple squibimps in a scene, it goes to one randomly.",
          },
          {
            name: "Way of the cricket",
            description:
              "The squibimp can climb and stick to flat surfaces with ease; even upside-down. The squibimp can also leap its entire movement distance.",
          },
        ],
      },
    ],
    image:
      "https://c10.patreonusercontent.com/3/eyJyb3RhdGUiOjAsInciOjgyMH0%3D/patreon-media/p/post/28034275/9fac2dc6638b40f2849e47feadda5a9d/1.png?token-time=1617765634&token-hash=eIt6-oJoY28V2k0wGccXxyeJBA0XauEy3Fmo-ZUQZBw%3D",
  },
  {
    title: "Boulderillo",
    description:
      "These towering creatures dine on carrion left behind by faster, more aggressive animals of their environment. When confronted they prefer to flee instead of fight, but if left with no choice they pack a punch.\n\n***Thick Carapace.*** Perhaps the most notable feature of the boulderillo is its massive carapace that covers it from nape to tail. This shell is made of banded plates that can easily slide over one another, allowing the boulderillo to curl up into a ball for protection on all sides. When threatened, the boulderillo will curl up and roll toward their predators. Due to their size, this tactic is often quite effective, forcing the predator to maneuver out of the way or be crushed.\n\n***Rocky Camouflage.*** The carapace of the boulderillo is colored to blend in with the environment where it lives. There are several species of boulderillo living in locations ranging from rocky deserts to mountains. Slight irregularities in the shell make it almost indistinguishable from stone.\n\n***Delicious Delicacy.*** Animals in the wild are not the only predators of boulderillos. Many of the humanoid races find the taste of boulderillo to be quite a treat. Boulderillo meat is chewy and tough but carries with it a sweet after-taste that lingers on the tongue. Many hunters make a living off of these elusive creatures, but not without the challenge that comes with it.",
    character: [
      {
        name: "Boulderillo",
        aspects: ["Armored carapace", "Alert", "Ungainly"],
        tracks: [
          { name: "Physical Stress", values: ["1", "2", "3"] },
          { name: "Mental Stress", values: ["1", "2"] },
        ],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Mild physical consequence", value: "2" },
        ],
        skills: [
          "+4 Armored carapace (Physique)",
          "+3 Watchful (Notice)",
          "+2 Claws (Fight)",
        ],
        stunts: [
          {
            name: "Boulder roll",
            description:
              "The boulderillo can use Physique in place of Fight if it moved into the target’s zone on the same turn via rolling.",
          },
          {
            name: "Armored carapace",
            description:
              "The boulderillo may defend against attacks using Physique, as long as it doesn’t have any aspects related to being flipped over or otherwise vulnerable. Additionally, if the boulderillo spends its action to stay curled up for the round, whenever it defends against an attack using Physique the outcome of the defense will be at least 4.",
          },
          {
            name: "Rocky camouflage",
            description:
              "A rolled up boulderillo looks almost identical to a boulder. It takes a Great (+4) difficulty Notice check to realize a curled boulderillo is not an ordinary boulder.",
          },
        ],
      },
    ],
    image:
      "https://c10.patreonusercontent.com/3/eyJyb3RhdGUiOjAsInciOjgyMH0%3D/patreon-media/p/post/28207095/71814d04821447b1bb3d879c448e48da/1.png?token-time=1617765770&token-hash=EYIjhjYIZDOkmbplZUqNXBKkXhvEeW4V6uXR1aUt1Cc%3D",
  },
  {
    title: "Government Agents",
    description:
      "In the city of flashing lights, big brother is always a stone’s throw away. It is not just a conspiracy theorist’s speculation, but a fact of life. In every bustling alley or dimly lit bar, there is a chance that an agent is watching, waiting for an unsuspected target to break the law.\n\n***Routine Surveillance.*** The primary job of agents in the city is to keep an eye on the citizens. Who knows what they could be plotting? They must be monitored. In order to stay inconspicuous government whistle-blowers nicknamed ‘partycrashers’ blend into crowds and hang around public places, waiting for their queue to intervene.\n\n***Enforcement in Force.*** Aside from monitoring, the other job of government agents is to enforce the laws. This means subduing criminals, eliminating threats, and maintaining the peace. An array of enforcers around the city have implants in their skull meant to transmit and receive information. In a pinch, this can alert potentially dozens of agents that an issue needs to be taken care of.",
    character: [
      {
        name: "Government Partycrashers",
        aspects: ["Obscurity drives"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: [
          "+3 Disguise (Stealth)",
          "+3 Synthetic fitness (Athletics)",
          "+2 Reinforcements (Contacts)",
          "+2 Necessary force (Fight and Shoot)",
        ],
        stunts: [
          {
            name: "Obscurity drives",
            description:
              "The government partycrasher has an implant that interferes with camera equipment. Photos and video feeds of the partycrasher are subtly blurred over any identifying features.",
          },
          {
            name: "The jig is up",
            description:
              "Reinforcements are always nearby. A government partycrasher can use their action to make a Good (+3) difficulty Contacts check. For every shift of success, a government goon (see below) enters the scene.",
          },
        ],
      },
      {
        name: "Government Goons",
        aspects: ["Networking implants"],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: [
          "+1 Necessary force (Fight and Shoot)",
          "+1 Synthetic fitness (Athletics)",
        ],
        stunts: [
          {
            name: "Networking implants",
            description:
              " These implants allow the goon to act in step with other goons. If one goon in the scene knows or notices something, all other goons in the scene also know or notice it.",
          },
        ],
      },
    ],
    image:
      "https://c10.patreonusercontent.com/3/eyJyb3RhdGUiOjAsInciOjgyMH0%3D/patreon-media/p/post/28391099/1fecc15e6dd640728a85de5f34703595/1.png?token-time=1617765896&token-hash=BugCxCFKHfxKgQ2Qx2rn03GPeg51DUXkhOmc0MlqUIE%3D",
  },
  {
    title: "Jungle Fauna",
    description:
      "The deep jungle is filled with a plethora of strange species, each with unique abilities and behaviors. Some people dedicate their lives to finding and chronicling these creatures, and yet, the list of creatures to find is never exhausted.\n\n***Shrubbit.*** This small, rabbit-sized, burrowing herbivore makes its home in the thick underbrush of the forest. Over the course of its life, a shrubbit's dark green fur mats into long, tangled tendrils resembling tufts of weeds and other plants. Leaf-like camouflage grows out of their back to add to this effect. They use this as a defense mechanism to blend into the jungle floor. A shrubbit standing completely still is nearly impossible to see in the underbrush.\n\n***Growlbird.*** This small, brown bird looks unextraordinary when sitting still, however, when the growlbird takes flight you see its true beauty. The hidden underside of a growlbird's wings are an iridescent array of oranges, reds, yellows, and blues that flash in the sunlight as it flaps. Growlbirds live in solitude and are quite territorial. In order to scare off competitors and potential predators, the growlbird can mimic an impressive variety of animal growls. While a growlbird won't dare attack a larger animal, they can often be found hunting shrubbits and other small mammals.\n\n***Bleedlebug.*** This insect resembles an ashy beetle with an amber-colored abdomen. Four thick antennae stick from its head to sense subtle vibrations in the environment around it. If crushed, a bleedlebug will ooze a yellowish substance, often cited as a delicacy for its sweet taste. A common parable told in settlements near the jungle describes a child that catches a bleedlebug by sitting so still it lands on his skin. The moral of this story, of course, is that patience is rewarded.\n\n***Nyoc.*** The nyoc is a breed of scavenging jumping-spider that feeds on the carcasses of dying animals. They are about six inches in diameter, and can leap up to ten feet in a single jump. The nyoc has a venomous bite that triggers a panicked fight response in its target. The nyoc leverages this bite to spur packs of animals in to fighting one another, often leaving behind a meal for it.",
    character: [
      {
        name: "Shrubbit",
        aspects: ["Quick and tiny herbivore", "Jungle camouflage"],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: ["+6 Scurry (Athletics)", "+4 Blend in (Stealth)"],
        stunts: [
          {
            name: "Jungle camouflage",
            description:
              "The shrubbit has plant-like extrusions meant to help them blend in. If a shrubbit is standing completely still in a jungle environment, when they make a stealth check to hide, the minimum result is 4. ",
          },
        ],
      },
      {
        name: "Growlbird",
        aspects: [
          "Iridescent underwings",
          "Impressive mimicking",
          "Territorial in solitude",
        ],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: [
          "+4 Mimic predator (Deceive and Provoke)",
          "+4 Soar (Athletics)",
        ],
        stunts: [
          {
            name: "Call for backup",
            description:
              "If the growlbird feels threatened, and its pursuer is not scared away by a simple growl, the growlbird can lure predators into the area. The growlbird may use its action to make a Provoke check, with a difficulty depending on what type of predator it is trying to lure and if one is nearby. If successful, a predator of that type will enter the scene at the end of this round.",
          },
        ],
      },
      {
        name: "Bleedlebug",
        aspects: ["Hard to catch", "Sought after"],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: ["+6 Fly (Athletics)", "+2 Insect eyes (Notice)"],
        stunts: [
          {
            name: "Deliciously sweet",
            description:
              "If the bleedlebug’s abdomen is crushed, an amber-colored paste will come out. This bleedlebug goo is a delicacy that is hard to find. If ingested, clear the lowest damaged mental stress box that the one ingesting it has checked, if any.",
          },
        ],
      },
      {
        name: "Nyoc",
        aspects: [
          "Terrifying jumping arachnid",
          "Fear venom",
          "Carrion eater",
          "The stuff of nightmares",
        ],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: ["+4 Leap (Athletics)"],
        stunts: [
          {
            name: "Aggressive jump",
            description: "A nyoc may use Athletics instead of Fight to attack.",
          },
          {
            name: "Panic inducing venom",
            description:
              "Nyoc venom induces a panicked fight response in its victim. A nyoc attack with Fight (or Athletics) can only deal a maximum of one stress. When a nyoc deals damage to someone in this way, they gain the Fight response aspect. While they have this aspect, all other characters appear to them as enemies.",
          },
        ],
      },
    ],
    image:
      "https://c10.patreonusercontent.com/3/eyJyb3RhdGUiOjAsInciOjgyMH0%3D/patreon-media/p/post/28560372/bc5ca8fdda17401d88e93ed9095e24ea/1.png?token-time=1617766151&token-hash=CGG_3-tEELq2smnFvA-lnp3CCAtUIYC224BYbjbjnT4%3D",
  },
  {
    title: "Rhino-lizard",
    description:
      "“Does it like to wrestle? Hah! Thrashing is its favorite activity! I tell you what, ol’ Hammersteed here was no easy wrangle. He threw me into a wall, and almost pierced me through my chest. But compared to the rest, riding this thing was easy; it’s the mother and father you have to worry about!” *- Arvus Bonegut, Dragonknight*\n\n***Massive Reptiles.*** Rhino-lizards are a breed of omnivorous reptiles that grow to be quite large. When born they are two to three feet long, and during adulthood they peak at around fifteen to twenty feet long. These lizards get their name from the large horns they have on the front of their skull. They use this horn to fight off competitors as well as dig through tough dirt underground.\n\n***Volcanic Cave Dwellers.*** Rhino-lizards live in deep cave systems that provide them warm rock to lounge around on. Because of this, the majority of rhino-lizards live in volcanic locations, taking advantage of the heat that nearby magma provides. Rhino-lizards live in small families from two to four members, and are very rarely seen alone or in groups larger than that. ",
    character: [
      {
        name: "Rhino-lizard",
        aspects: [
          "Muscular reptile",
          "Sharp-horned skull",
          "Heat-resistant hide",
          "Heavy handed",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+5 Muscles (Physique)",
          "+3 Reflexes (Athletics)",
          "+3 Tooth and tail (Fight)",
        ],
        stunts: [
          {
            name: "Horned parry",
            description:
              "If the result is tied when the rhino-lizard is defending against a Fight check, the attacker takes one point of physical stress.",
          },
          {
            name: "Ram",
            description:
              "When the rhino-lizard succeeds with style on a Fight check, it may knock the target into an adjacent zone.",
          },
          {
            name: "Thick hide",
            description:
              "When defending against attacks from blunt weapons, the rhino-lizard may defend using Physique.",
          },
          {
            name: "Thrash",
            description:
              " The rhino-lizard may use its action to thrash. It makes a Fight check targeting all other characters in the zone. All characters that fail to defend against this check get pushed into an adjacent zone of the rhino-lizard’s choice.",
          },
        ],
      },
    ],
  },
  {
    title: "Augmented Zombies",
    description:
      "“I saw a bastard with a meat-cleaver for a hand. Musta’ been a butcher while he was still livin’. I never understood people like that. You got a perfectly good hand, and you wanna cut it off and replace it with something mundane? Never made sense to me. But those super hearing-aids, grappling hook arms, or bio-reinforced skeletons. Those at least seem useful. I could get behind that.” - Austin Bilgrin, Survivor\n\n***Virus susceptibility.*** Before the fall, tons of people got implants to improve their everyday lives. People got implants to help at their job, others got implants to increase their performance in sports. Some got cosmetic implants. But this opened the floodgates for something entirely unexpected. The world’s first virus that is both biological and technological. Some people say it was a hacker who made the nanobots. Others say it was a government experiment gone wrong.\n\n***Zombies with cybernetic implants.*** Shambling bodies limp their way around this once-bright, once-neon-filled cityscape. Zombies of former peacekeepers still have their weapons. The construction workers still have their jack-hammer arms. In an abandoned back-alley, you may catch a smile from a zombie with glowing teeth.",
    character: [
      {
        name: "Unaugmented Walker",
        aspects: ["Persistent", "Shambling", "Bumbling", "Babbling"],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: ["+1 Tooth and nail (Fight)"],
        stunts: [],
      },
      {
        name: "Augmented Walker",
        aspects: ["Persistent", "Motivated"],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: ["+3 Augment (Random)", "+1 Tooth and nail (Fight)"],
        stunts: [
          {
            name: "Augmented",
            description:
              "This zombie has an augmentation. Select or roll to determine a random skill. That skill is the one at +3 above. Shoot, for example, might mean the zombie has a gun for an arm.",
          },
        ],
      },
      {
        name: "Government Agent Walker",
        aspects: ["Persistent", "Malfunctioning networking implants"],
        tracks: [{ name: "Stress", values: ["1"] }],
        slots: [],
        skills: [
          "+2 Eye for action (Notice)",
          "+1 Unnecessary force (Fight and Shoot)",
        ],
        stunts: [
          {
            name: "Malfunctioning networking implants",
            description:
              "If one government agent walker notices something, all other government agent walkers in the scene will know *something* happened and begin looking for it. ",
          },
        ],
      },
      {
        name: "Riot Walker",
        aspects: ["Well-equipped", "Stuffy suit"],
        tracks: [{ name: "Stress", values: ["2", "2"] }],
        slots: [],
        skills: [
          "+2 Built (Physique)",
          "-1 Encumbering riot gear (Athletics and Notice)",
        ],
        stunts: [
          {
            name: "Riot gas",
            description:
              "Once per scene, the riot walker can fire a gas canister into their zone, or an adjacent zone. That zone gains the aspect *Riot gas*. All characters that breathe the gas must make a Fair (+2) difficulty Physique check. The riot walker gets a free invoke of Riot gas against each character that fails the check.",
          },
        ],
      },
    ],
    image:
      "https://c10.patreonusercontent.com/3/eyJyb3RhdGUiOjAsInciOjgyMH0%3D/patreon-media/p/post/28931646/483b37921ff84f86918f9da01707a598/1.png?token-time=1617766440&token-hash=tzA0VC95FWxGrNY6v8yhQXD2BhaZqvMbDAk5CPzy2Eo%3D",
  },
  {
    title: "Heptapode",
    description:
      "“While I was not expecting some wanna-be demon to drop from the branches above me, that was not the most surprising part of my encounter. I was not afraid of the little beast until after he got ahold of me. You learn very quickly about the teeth.” - Vartul Jodack, First Sword of the Second Army of Wrend\n\n***Cousin to the Octopus.*** These forest-dwelling predators bear a striking resemblance to their sea-dwelling counterparts. While this is the case, there are several key differences. First of all, heptapodes live on land in dense forests. They slither through the treetops, not unlike a tree snake. Heptapodes are ambush predators, hiding stealthily on branches before falling on their targets and constricting them. They have seven tentacles covered in green and brown splotches which make it easier for them to hide in the foliage. Their undersided mouth has several rows of sharp teeth to help them subdue and consume struggling prey faster.\n\n***Mate for life.*** Heptapodes for the most part live in solitude. However, this changes when they find a mate. Heptapodes mate for life, which means once they find one partner, they will stay with them until death. Interestingly enough, both male and female heptapodes appear to be able to carry the children. Due to this monogamous behavior, it is most common to encounter heptapodes alone or in pairs.",
    character: [
      {
        name: "Heptapode",
        aspects: [
          "Efficient tree climber",
          "Seven tentacles",
          "Ambush carnivore",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+5 Chomp (Fight)",
          "+4 Camouflage (Stealth)",
          "+3 Constrict (Physique)",
          "+2 Slither (Athletics)",
        ],
        stunts: [
          {
            name: "Constricting tentacles",
            description:
              "The heptapode cannot use Chomp (Fight) against a target until it is constricting them. Before this point, the heptapode uses Constrict (Physique) in place of Fight checks. When the heptapode hits with a Constrict (Physique) attack, add the *Constricted* aspect to the target with one free invoke. A Constricted target cannot move between zones until they overcome the aspect. A heptapode can be constricting multiple targets as long as they are in the same zone.",
          },
          {
            name: "Branch drop",
            description:
              "If the heptapode is in a tree above more than one target, as an action it may drop from the tree and make a Constrict (Physique) attack against all targets in the zone. This attack uses the same rules as above.",
          },
        ],
      },
    ],
  },
  {
    title: "Sythan",
    description:
      "These hunched creatures have a greyish, leathery skin and one large eye in the center of their face. Although intelligent, they live a primitive life, typically subsiding off of small animals and fish.\n\n***Barbaric Intellectuals.*** Sythan can be found skulking around any place with both a complex ecosystem and a place to hide. They are drawn to these complex ecosystems due to their inherent interest in learning what makes living beings tick. The more diverse the location, the more there is for the sythan to break down and analyze. While the sythan loves to learn about life, it prefers to do it from the shadows. This is why it is atypical (although not unheard of) to find a sythan in a city or village. If discovered and approached by intelligent life, the sythan will cautiously interact. A little known fact about the sythan is that they can become fluent in most languages simply by interacting briefly with someone who speaks it.\n\n***Mysterious Origin.*** An absolute history around how and why the sythan came about does not exist, however there are stories and rumors surrounding their appearance. The most common tale is that a powerful wizard created the sythan as a means of spying on their subjects and enemies. Some rumors state that there are sythan that can shapeshift to blend in, but this has never been confirmed. Other rumors say that sythan used to be human until transformed violently by the mage as punishment.",
    character: [
      {
        name: "Sythan",
        aspects: ["Mind reader", "One large eye", "Creepy crawly"],
        tracks: [
          { name: "Physical stress", values: ["1", "2"] },
          { name: "Mental stress", values: ["1", "2", "3"] },
        ],
        skills: [
          "+4 Mental fortitude (Will)",
          "+4 Empath (Empathy)",
          "+3 Quick learner (Lore)",
          "+2 Invade mind (Shoot)",
          "+2 Skulk (Stealth)",
        ],
        slots: [],
        stunts: [
          {
            name: "Empath",
            description:
              "The sythan can use Empath (Empathy) in place of Notice checks to notice conscious living beings. Once alerted to someone’s presence, the sythan can automatically discern their surface level mood.",
          },
          {
            name: "Read minds",
            description:
              "The sythan can attempt to delve into and read someone’s thoughts. To do this, the sythan rolls an Empath (Empathy) attack opposed by the target’s Will. If the attack would hit, no shifts of damage are dealt, but the sythan begins reading the target’s thoughts. A good way to facilitate this is for it to learn pieces of information tossed around in a player’s OOC planning. This effect lasts until the scene ends or the target succeeds in a +4 (Great) difficulty Will check to overcome it.",
          },
          {
            name: "Invade mind",
            description:
              "The sythan’s Invade mind (Shoot) attack involves mentally probing the target’s mind, causing a searing pain. When the sythan hits with an Invade mind (Shoot) attack, it inflicts mental stress instead of physical. The sythan still uses this Shoot skill in places it would use a regular Shoot check, which manifests as a mild telekinetic effect. ",
          },
        ],
      },
    ],
  },
  {
    title: "Defunct Golem",
    description:
      "Ten feet of night iron, flanked on either side by massive fists of the same material, stood like a sentinel in the forest. Nature’s wild tendrils reclaimed the beast, its form overgrown by vines and foliage. It stands no more than a statue now. But the forest around it has come alive.\n\n***Bygone Directive.*** Long ago, when the forgotten golem was created, it was given a distinct purpose. *Guard the creator’s most prized possession. Kill all who approach.* The monstrous metal being was constructed with this purpose in mind. Thick plates of night iron connected by rods and pistons made up the entirety of the golem. Swords and arrows did little to pierce the metal hide. The enchanter, however, made a fatal mistake. “Protect my most prized possession. Kill all who approach.” Golems deal only in literals, and the enchanter was slain on the spot. The golem went on to continue its duty.\n\n***Magical Instability.*** Years passed and the occasional forest-goer stumbled into the deadly metal hulk. It carried out its task, slaying those who approached. But without an enchanter to upkeep the golem, it’s magic grew unstable. The golem became unsuitable to carry the enchantment magics that filled it. Slowly the magic leaked into the surrounding forests. Enchantment magic is unpredictable and potent, and the magic maintained its function even though it escaped its vessel. The branches and vines continued their fatal directive: *Protect the creator’s most prized possession. Kill all who approach.*",
    character: [
      {
        name: "Defunct Golem",
        aspects: ["Thick metal plating", "Cold to the touch", "Unmoving"],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: ["+3 Armored (Physique)"],
        stunts: [
          {
            name: "Made of metal",
            description:
              " The defunct golem defends against physical attacks with Armored (Physique).",
          },
          {
            name: "Leaking magical energy",
            description:
              "The magic meant to power the golem has leaked into the surrounding foliage. The defunct golem does not take actions on it’s own. Instead, the golem may use its action to create a new enchanted foliage (see below) anywhere in the scene that there is foliage. When the defunct golem is taken out, the magical energy is released and all of the enchanted foliage in the scene dies.",
          },
          {
            name: "Come alive",
            description:
              "When the defunct golem is first interacted with in a scene, it will create five enchanted foliage (see below) anywhere within the scene that there is foliage.",
          },
        ],
      },
      {
        name: "Enchanted Foliage",
        aspects: ["Ordinary appearance", "Kill directive"],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: [
          "+3 Twist and turn (Physique and Athletics)",
          "+1 Rip (Fight)",
        ],
        stunts: [
          {
            name: "Pull",
            description:
              "The enchanted foliage may make a Physique attack to pull a target. If it hits, no damage is dealt, but for the rest of the turn the target will move with the enchanted foliage.",
          },
          {
            name: "Entangle",
            description:
              "The enchanted foliage may make a Physique attack to entangle a target. If it hits, no damage is dealt, but the *Entangled* aspect is added to the character. As long as the aspect remains on the character, they may not move zones.",
          },
          {
            name: "Magical tether",
            description:
              "If the enchanted foliage leaves a one kilometer radius of the defunct golem, it is taken out.",
          },
        ],
      },
    ],
  },
  {
    title: "Skeletal Dragon",
    description:
      "“There is not a night that goes by that I don’t remember it's haunting screech. It always goes the same way. I am up late, unable to sleep. Eventually, the exhaustion takes me. Quickly I am plummeted into a cascade of horrendous nightmares, each one worse than the last. Until finally, I see it. It wails at me. I wake, sweating where I lie. I have no regret greater than creating that beast. And for what?” - Sylrid Wormwood, Ex-necromancer\n\n***Of Legendary Sources.*** Skeletal dragons are truly weapons of destruction. It is no easy task, assembling one. Gathering the required materials is not a chore for the squeamish. The first requisite is dragon bones. As rare as dragons are, happening upon a dragon corpse is no accident. Thankfully for the would-be necromancer, an entire dragon skeleton is not required. Instead, missing pieces can be substituted with bones of other species, particularly sentient ones. Humans, elves, dwarves, and more may become victim to an ambitious necromancer. Bodies with particularly gruesome deaths will take to the magic more easily. By the time the skeletal dragon is constructed, its many parts tell a story just as horrific as its appearance.\n\n***For Dastardly Purposes.*** A necromancer does not go through the trouble of creating one of these monstrosities without having a reason. The ritual is performed to accomplish some terrifying goal. Subjugating cities, tormenting like-long enemies, carrying out revenge, or granting unquestionable authority are potential motivations.",
    character: [
      {
        name: "Skeletal Dragon",
        aspects: [
          "Terrifying bone piecemeal",
          "Necromantic magic",
          "Dominate or be dominated",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [
          { name: "Mild physical consequence", value: "2" },
          { name: "Moderate physical consequence", value: "4" },
        ],
        skills: [
          "+5 Scratch and claw (Fight)",
          "+4 (Athletics)",
          "+3 Wail (Provoke)",
          "+2 Indomitable (Will and Physique)",
        ],
        stunts: [
          {
            name: "Deathly Wail",
            description:
              "The skeletal dragon may use Wail (Provoke) to make ranged and melee attacks. If a Deathly Wail attack hits, it deals mental stress. Additionally, when a Deathly Wail attack hits target in the same zone as the skeletal dragon, the dragon may uncheck a stress box that is equal to or lower than the shift value of the attack.",
          },
          {
            name: "Swallow",
            description:
              "When the skeletal dragon succeeds with style on a Claw (Fight) attack, it may choose to swallow the target. The target gains the *Swallowed* aspect. While the target has this aspect, they cannot move away from the stomach of the skeletal dragon, and the dragon will not target them. The target may still interact with things outside of the skeletal dragon, but only as if doing so at range from behind the cage-like bones of the dragon’s stomach.",
          },
          {
            name: "Bone constructs",
            description:
              "The necromantic magic keeping the skeletal dragon alive can spontaneously jump to nearby piles of bones. When the skeletal dragon checks a stress box, a bone construct (see below) forms out the pieces of the dragon which flew off from the attack. Alternatively, the skeletal dragon can use its turn to raise three bone constructs in the same zone or zones adjacent to it.",
          },
        ],
      },
      {
        name: "Bone Construct",
        aspects: ["Bone piecemeal", "Necromantic magic"],
        tracks: [{ name: "Stress", values: ["Special"] }],
        slots: [],
        skills: ["+3 Scratch and claw (Fight)"],
        stunts: [
          {
            name: "More bones, more fun",
            description:
              "The number of stress boxes a bone construct gets is based on how it was created. If the bone construct was made from the skeletal dragon checking a stress box, the bone construct will have a stress box of equal value to the one that was checked. If the bone construct was created through the skeletal dragon using an action, it will have a single [2] stress box.",
          },
          {
            name: "Power in numbers",
            description:
              " If multiple bone constructs are in the same zone, they may Scratch and claw (Fight) together to increase their odds. Each involved bone construct uses their action to do this. The level of the Scratch and claw (Fight) attack is 2 + the number of involved bone constructs.",
          },
        ],
      },
    ],
    notes:
      " A note for the GM: Skeletal dragons are quite powerful. A party of four characters with the default stats and abilities will likely have a hard time taking one of these down without proper preparation and an escape plan. I would advise against pitting new players against this monster. ",
  },
  {
    title: "Spider-jackal",
    description:
      "“We heard the howling. The attack itself was not a surprise. It had been going on for an hour or so while we made our way across the rocky plains. We kept our watches and were prepared. But when the pack finally engaged, that is when the strangeness revealed itself. We saw their backs in the grass, encircling. Then they all began leaping. A few dozen of them. Not pouncing. But leaping. Bounding. They had extra legs, and extra claws! We lost no men, but we gained one hell of a story.” - *Maica, Knight of Moriel*\n\n***Part Jackal.*** Spider-jackals appear to be just as much a canine as any other wild dogs, with the chief difference being they have six legs instead of four, and four eyes instead of two. They have a relatively similar body shape to a jackal, with the same coat of short, black and brown fur that you would expect. Spider-jackals are pack-hunters, excelling in stealthily encircling and taking down their prey in groups. \n\n***Part Spider.*** In addition to more legs and eyes, spider-jackals have the arachnid quality of spinning webs. The spider-jackals excrete their webs from their front set of claws, which have small protrusions for this purpose. This process takes a long time, and is typically not used to offensive hunting, but instead is used as a means of protecting the spider-jackal burrow. The result is an extensive tunnel system covered from wall to wall in thick strings that ensnare potential predators.",
    character: [
      {
        name: "Spider-jackal",
        aspects: [
          "Six-legged dog-like creature",
          "Four eyes",
          "Web-walker",
          "Silent hunter",
        ],
        tracks: [{ name: "Stress", values: ["1"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+4 Bound (Athletics)",
          "+3 Silent hunter (Stealth and Notice)",
          "+2 Gnaw (Fight)",
        ],
        stunts: [
          {
            name: "Pack hunter",
            description:
              "Spider-jackals get a +1 to Gnaw (Fight) checks when a friendly spider-jackal is in the same zone.",
          },
          {
            name: "Web-spinner",
            description:
              "Spider-jackals spin *Thick* webs over their underground burrows. This typically takes a long time, and won’t occur during a fight. However, a spider-jackal can climb their webs with little effort. Any character that is not adept in climbing webs takes a -2 on *all* Athletics checks while in them.",
          },
        ],
      },
    ],
  },
  {
    title: "Lich",
    description:
      "“Moons and full moons. I watched the ones I love slip into the darkness. My children have grown old and had children, who in turn had children of their own. My friends have either passed, or no longer recognize me. But the days continue to cycle. Moons and full moons. Many years I have had, reflecting. What I realized? I am eternal. *And I am the end*. Make peace with your families.” - Bokra Jakzi, Lich\n\n***Timeless bodies.*** When the vile magician finishes the wicked rite, they surrender their flesh for virtual immortality. Their skin turns to dust, and their bones harden into what feels like steel. They are no longer shackled by human needs like food and sleep, and become immune to disease and natural death. Lichdom is only achievable by the most powerful of necromantic magic. Once it is attained, the lich’s body turns into a powerful vessel for the vilest of spells.\n\n***Phylacteries.*** As part of the arcane ritual for becoming a lich, the necromancer crafts a number of phylacteries. The magical artifacts act as a sort of battery, keeping the soul of the lich alive despite the worst of fates. After a lich’s body is destroyed, any remaining phylacteries will animate a new corpse for the necromancer to inhabit. According to the clerics, the only way to destroy a lich fully is to first destroy his phylacteries.",
    character: [
      {
        name: "Lich",
        aspects: ["Being of Unadulterated Evil", "Bones of Steel", "Timeless"],
        tracks: [
          { name: "Physical Stress", values: ["1", "2", "3"] },
          { name: "Mental Stress", values: ["1", "2", "3", "4"] },
        ],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
        ],
        skills: [
          "+4 Necromancy (Lore)",
          "+3 Strong mind (Will, Investigate, and Deceive)",
          "+2 Unholy body (Athletics and Physique)",
        ],
        stunts: [
          {
            name: "Flesh rot",
            description:
              "The lich may use Necromancy (Lore) in place of Fight and Shoot attack checks. If the lich hits with an attack this way, the shifts are dealt to physical and mental stress boxes. The lich may choose to pay a fate point to the target in order to uncheck all physical stress boxes equal to or lower than the amount of shifts of the attack.",
          },
          {
            name: "Radiate pain",
            description:
              "When the lich is dealt damage by an attack, it may force all of the enemies in its zone to make a Physique check with a difficulty equal to the shifts dealt in the attack. Each enemy that fails this check takes one shift of mental stress per shift of failure.",
          },
          {
            name: "Undead minions",
            description:
              " Every turn the lich may raise a number of undead minions equal to its highest checked stress box plus one. The lich may raise these minions in its zone or any adjacent zone. This does not use an action. See below for stats. For example, if the lich’s highest checked stress box was its [3] physical stress box, it would raise 4 undead minions on its turn using no action.",
          },
          {
            name: "Phylacteries",
            description:
              "When a lich dies, it will be resurrected into a new body in 7 days if any of its phylacteries remain at that point. If a lich dies within 100 ft of one of its phylacteries, it will resurrect nearby within 1 hour.",
          },
        ],
      },
      {
        name: "Undead Minion",
        aspects: ["Rotting flesh and dancing bones", "Fragile fury"],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: ["+1 Mob (Fight)"],
        stunts: [],
      },
    ],
    notes:
      "A note for the GM: Liches are quite powerful. A party of four characters with the default stats and abilities will likely have a hard time taking one of these down without proper preparation and an escape plan. I would advise against pitting new players against this monster. ",
  },
  {
    title: "Skullug",
    description:
      "“What is a skullug? I suppose I can excuse your ignorance. A skullug is a loathsome, little, purple slug that lives in a skull. Yes, I acknowledge the impudent name, but what can you do?\nFinding a skullug is rather rare, but where you find one, you find many. They tend to congregate where bodies lie unburied: ancient battlefields, disturbed graveyards, unsealed catacombs. There are two requisites, you understand? An intact skull, and the disembodied soul that it belonged to.” - Professor Slaid Madring\n\n***Natural Phenomenon.*** Skullugs themselves are nothing supernatural. These small, veiny slugs are born to others of their species and survive by both feeding on carrion and absorbing nutrients from the ground where the deceased lie. They excrete a clear mucus that is toxic to the touch, which dissuades predators from hunting them. Typically a skullug is to be avoided, but some do seek them out specifically to make poison.\n\n***Unnatural Phenomenon.*** One peculiar trait about the skullug is their choice of home. Skullugs will crawl into the first available skull they can find that meets one criteria; the one it belonged to is a restless soul that has not passed on. Researchers still have not determined how the skullug senses whether a skull is fit for them or not, but without fail, the skull they choose has within it the soul of the deceased. The skullug appears to use this as another form of protection, harnessing the soul’s power to discourage attackers from breaking their “shell”.",
    character: [
      {
        name: "Skullug",
        aspects: [
          "Veiny purple slug",
          "Toxic to the touch",
          "Skull for a shell",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: ["+4 Trapped soul (Will)", "+1 Slither (Athletics)"],
        stunts: [
          {
            name: "Trapped soul",
            description:
              "The skull that a skullug inhabits has trapped within it the soul of the deceased that it belonged to. The skull is broken if any physical stress is dealt to the skullug, unless the attacker is being extra careful not to hit the skull. If an attacker is being careful not to hit the skull, they get -3 to their attack roll. If the skull is broken, the soul is released. If the soul is released, the skullug can use Trapped soul (Will) in place of Fight, Shoot, and Athletics. 24 hours after a soul is released in this way, the skullug will lose the ability to harness it’s power.",
          },
          {
            name: "Toxic to the touch",
            description:
              "Touching a skullug with your bare hands is harmful to your health. When a character does so, they must make a +3 (Good) difficulty physique check. If they fail, they take 2 physical stress and gain the *Poisoned* aspect.",
          },
        ],
      },
    ],
  },
  {
    title: "Goblinoids Pt. 1",
    description:
      "“The war horns sound like nothing you have heard. But you will not forget them. For it is at this moment that you become something new. A casualty, or a hero.” - Arnesan Filk, Moriel Captain\n\n***Goblins.*** “An infestation if you ask me. A creative little bunch. But an infestation nonetheless. They rob caravans. They steal livestock. They burn villages. Always in number, always when you do not expect them. When you catch one alone, however, you learn of their real character. Cowards.” - Thatchwin Grimble, Mercenary\n\nOrcs. “We have all heard the stories have we not? Big brutes, bigger weapons. They say they collect teeth, *teeth*, to show status and rank. They burn a few extra fires at night just to put fear into those who can see them at a distance. Well let me tell you; I have seen them up close. They are *nothing* to trifle with. They are bigger than you think. They are nastier than you think. And they will not hesitate to tear off your arms for fun.” - Maican Kelly, Soldier turned bard",
    character: [
      {
        name: "Goblin",
        aspects: ["Nasty little schemer", "Power in numbers", "Goblinoid"],
        tracks: [{ name: "Stress", values: ["2"] }],
        slots: [],
        skills: [
          "+3 Tumble (Athletics)",
          "+3 Stumble (Stealth)",
          "+2 Fumble (Burglary)",
          "+1 Rumble (Fight and Shoot)",
        ],
        stunts: [
          {
            name: "Nimblefoot",
            description:
              "After being attacked from an attacker in the same zone which missed, the goblin can move one zone. ",
          },
          {
            name: "Mob",
            description:
              "Goblins get +1 to Fight checks against targets which have already been attacked by a Goblin this round.",
          },
        ],
      },
      {
        name: "Orc",
        aspects: ["Tribalistic brute", "Quick to anger", "Goblinoid"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Annihilate (Fight and Shoot)",
          "+2 Heavyweight (Athletics and Physique)",
          "+1 Intimidate (Provoke)",
        ],
        stunts: [
          {
            name: "Fearmonger",
            description:
              "An orc can invoke the *Afraid* aspect for free if it was created by them or an ally.",
          },
        ],
      },
    ],
  },
  {
    title: "Animated Objects",
    description:
      "“I learned it from my father. He was a devilishly clever man, he was. As you know, the reagents for animation enchantments are not cheap. What he did was buy ten full suits of armor, and positioned them in the entrance to his manor. Lined them up on either side of the hallway. He then enchanted only the first two of them. Now, imagine breaking in and fighting two full suits of solid metal. Even if you win, you’re not going to continue when you see eight more!” - Shasa Vantul, Great Wizard\n\n***Expensive Magicks.*** Animating an object is a process which takes both plenty of time and plenty of resources. Firstly, it requires the necessary ingredients which can both charge the object with magic without damaging the particular materials of the item. Additional reagents are required to bind items together which would need to animated as one unit, such as a suit of armor. Finally, the particular function of the animated item will require certain chemicals and a specific ritual suited to enacting it. Due to the rarity of the materials and knowledge required to animate objects, seeing such items is typically an impressive display of magical prowess and wealth.\n\n***Effective Function.*** By far the most common use for magically animated objects is for protection. Animated objects don’t need a paycheck, and will never back-stab you or eye your precious gems. Additionally, it is quite difficult to dispatch of an animated object if you don’t know what you’re doing. Because of this, those of arcane inclination will often seek out methods of obtaining animated objects to protect their ever growing stash of magical items. While protection is by far the most used function of animated objects, it is not unheard of for a wealthy figure to commission animated objects for entertainment purposes.",
    character: [
      {
        name: "Animated Suit of Armor",
        aspects: [
          "Enchanted set of full plate",
          "Visually indistinguishable",
          "Flying",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: ["+2 Guard (Fight and Notice)"],
        stunts: [
          {
            name: "Lifeless enchantment",
            description:
              "The suit of armor is immune to all non-magical stress. If the suit of armor *would have been* hit by 3 shifts of physical stress in one action, it will use its next turn reassembling itself.",
          },
          {
            name: "Visually indistinguishable",
            description:
              "This suit of armor looks just like any mundane suit of armor. If it is not moving, it is impossible to tell by sight alone that it is animated.",
          },
        ],
      },
      {
        name: "Animated Sword",
        aspects: [
          "Enchanted longsword",
          "Visually indistinguishable",
          "Flying",
        ],
        tracks: [{ name: "Stress", values: ["1"] }],
        slots: [],
        skills: ["+3 Sick ‘em (Fight)"],
        stunts: [
          {
            name: "Lifeless enchantment",
            description:
              "The sword is immune to all non-magical stress. If the sword would have been hit by 2 shifts of physical stress in one action, it will fly backward into the next zone if possible.",
          },
          {
            name: "Visually indistinguishable",
            description:
              "This sword looks just like any mundane sword. If it is not moving, it is impossible to tell by sight alone that it is animated.",
          },
        ],
      },
      {
        name: "Animated Painting",
        aspects: [
          "Enchanted mural",
          "Moving pictures",
          "Rudimentary intelligence",
        ],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: [
          "+3 Blabbermouth (Rapport and Provoke)",
          "+2 Watchful (Notice, Investigate, and Lore)",
          "-1 Limited mind (Deceive and Empathy)",
        ],
        stunts: [
          {
            name: "Uncanny",
            description:
              "The animated painting was designed to be impressive. It instantly knows the common name of anyone it sees. This is whatever name is used most often by the person’s peers.",
          },
        ],
      },
    ],
  },
  {
    title: "Goblinoids Pt. 2",
    description:
      "“Before we left to give warning to the rest of the platoon, we took a moment to look down from the cliff and appreciate the sheer size of the mass of supposedly mindless savages. It was the first time I’ve gotten to watch them from afar. A terrible realization hit me in that moment. They are *not* mindless.” - Jamine Corsano, Moriel Soldier\n\n***Hobgoblins.*** “Big but still gaunt. Red skin. Imposing uniforms. If there are any goblinoids I fear, it would be hobgoblins. They are not like the others. If your party arrives with weapons in hand, a goblin may begin looking for an escape. An orc may begin looking for a target. *But a hobgoblin* would begin looking for your weaknesses.” - Bulgar the Black, Mercenary\n\n***Bugbears.*** “My brother and I were hunting in the woods. We’d been tracking some game for an hour or so, our steps quiet and our bows ready. Finally it was in my line of sight. I nocked an arrow and began preparing for the shot. I was about to release the string when my brother yelled for me to turn around. Directly behind me it was standing there, seven feet tall. How did something so large get so close to us without us noticing?” - Bern Randall, Family Hunter",
    character: [
      {
        name: "Hobgoblin",
        aspects: ["Devilish soldier", "Imposing strategist", "Goblinoid"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+2 Positioned (Investigate, Lore, and Notice)",
          "+2 Munitioned (Fight and Shoot)",
          "+1 Conditioned (Athletics and Physique)",
        ],
        stunts: [
          {
            name: "Imposing strategist",
            description:
              "The hobgoblin and its allies get an additional free invoke on advantages it creates using Investigate, Lore, or Notice.",
          },
        ],
      },
      {
        name: "Bugbear",
        aspects: [
          "Large and fur-covered",
          "Impressively stealthy",
          "Goblinoid",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+4 Hide (Stealth)",
          "+3 Collide (Fight)",
          "+3 Stride (Physique and Athletics)",
        ],
        stunts: [
          {
            name: "Ambush",
            description:
              "The bugbear and its allies get an additional two free invokes on advantages it creates related to ambushes and surprise attacks.",
          },
        ],
      },
    ],
  },
  {
    title: "Assimilator",
    description:
      "“Onlookers are still baffled by what actually went down in mom and pop diner ‘Sugar-pop.’ Initial reports suggest a man fell very ill after beginning his breakfast earlier today. Witnesses describe his skin turning a pale grey, and his eyes looking ‘sunken.’ No one can confirm what illness struck, but paramedics arrived shortly after and he was wheeled off to the St. James medical center for immediate treatment. We approached the hospital staff for questions, but were quickly denied any gratification.”\n\n***The First Wave.*** When attempting a hostile planetary takeover, assimilators are sent as the first wave. Their purpose is to infiltrate the ranks of the target planet, learn their customs and capabilities, and foster support from the population.\n\n***Social Parasites.*** Assimilators were engineered specifically with infiltration in mind. Each has the ability to change shape to match that of the targeted population. Additionally, advanced analysis skills paired with quickly-configurable pheromone glands allow the assimilators to confuse and sway others in conversation.\n\n***Salt Aversion.*** A less intentional property of the assimilator is their aversion to salt. Not only is direct contact with salt painful to an assimilator, it will interrupt their shape changing abilities and transform them back to their original form.",
    character: [
      {
        name: "Assimilator",
        aspects: ["Alien invasion expert", "Long grey limbs", "Shapechanger"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: [
          "+3 Analyze (Investigate)",
          "+2 Diagnose (Empathy)",
          "+1 Social parasite (Provoke, Rapport, and Deceive)",
        ],
        stunts: [
          {
            name: "Change shape",
            description:
              "After observing someone for five minutes, the assimilator can assume their appearance by succeeding on a create an advantage check with Analyze (Investigate). The transformation takes about three minutes, and lasts until they decide to shape change again, or until they make contact with salt.",
          },
          {
            name: "Befuddle",
            description:
              "The assimilator can use Diagnose (Empathy) to a human’s psyche. After speaking to someone for at least three minutes, they can attempt a create an advantage check with Diagnose (Empathy). If they succeed, they learn the human’s greatest desire. They can then convince the target to attempt one task in the name of achieving their desire. The task does not have to actually be related to their desire; the target will be overcome with the thought that it somehow will. They gain the *On a mission aspect*, and as long as they have it, they will continue trying to complete the task.",
          },
        ],
      },
    ],
  },
  {
    title: "Changeling",
    description:
      "“It all makes sense now. When Jamie was young, she was playing outside. She tripped on the root of a tree and hit her head on the way down. There was a large gash on her head. But she did not cry. As the blood dripped down her brow and into her eye, she appeared to be in deep thought. It was strange. For years she displayed this same kind of behavior. Always so cold. It’s because she was never my Jamie.”\n\n***Sinister Replacements.*** It is not unheard of for fae to steal away human children as their own. They do this for servants, out of hate for humans, or because they are intrigued by humans and want to study them. When they take the child, they leave behind a changeling in their stead.\n\n***Strange Beings.*** Changelings always appear on the surface to be the child they are replacing, but tend to display strange new traits. They may never cry, or they may have different physical traits like pale skin, longer teeth, or a limp. A changeling’s purpose in existing is to be a replacement for the child, but oftentimes this lost on them, or simply not enough for them. As changelings grow, they will become stir-crazy, looking for a new purpose. This often causes them to act out or even run away.",
    character: [
      {
        name: "Changeling",
        aspects: [
          "Disguised fairy child",
          "In need of a purpose",
          "Off-putting",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: ["+1 A cut above the rest (All skills)"],
        stunts: [
          {
            name: "Sinister disguise",
            description:
              "The changeling looks almost identical to another child, save for a couple of quirks. The changeling will transform back into a sickly grey creature when it died.",
          },
          {
            name: "Forget",
            description:
              "Once per scene, the changeling may cause one character to stop recognizing them for the rest of the scene. The character will act as if they have never seen the child.",
          },
        ],
      },
    ],
  },
  {
    title: "Ghost",
    description:
      "“When you die, it is believed your spirit leaves your body and begins its journey to the afterlife. Follow the light, and all that, you know? But sometimes, when the time comes to reaching that light, things aren’t so simple. And *poof*, you have ghosts.” - Reggie Bordago, Medium\n\n***An untimely passing.*** Ghosts are brought into existence when there are complications in a spirit passing to the afterlife. No one knows for sure the exact reason one spirit can pass to the afterlife and another cannot, but it is generally believed to be related to particularly peculiar, ill-timed, or brutal causes of death.\n\n***A hopeless goal.*** Contact with ghosts has unconditionally revealed one thing. Every ghost has unfinished business. Whether it be vengeance for their murder, bringing news to their family, or tying up important loose ends, a ghost will always have something that they cannot complete on their own. Whether this is what causes ghosts to exist in the first place, or whether any living thing would inevitably have something they want completed is fiercely debated.",
    character: [
      {
        name: "Ghost",
        aspects: [
          "Ethereal spirit",
          "Unfinished business",
          "Trapped in the material realm",
        ],
        tracks: [{ name: "Mental stress", values: ["1", "2", "3"] }],
        slots: [],
        skills: [
          "+3 What I’ve seen (Lore)",
          "+2 I am dangerous (Provoke, Fight, Will)",
        ],
        stunts: [
          {
            name: "Incorporeal",
            description: "The ghost is immune to physical damage.",
          },
          {
            name: "Telekinesis",
            description:
              "Once each turn, a ghost may attempt to create an advantage using I am dangerous (Will) as a free action.",
          },
          {
            name: "Invisibility",
            description:
              " The ghost may turn completely invisible as an action, giving them the Invisible aspect. The ghost may drop invisibility as a free action. The ghost may invoke Invisibility for free on Stealth checks, or checks to oppose Notice or Investigate. ",
          },
        ],
      },
    ],
  },
  {
    title: "Cuddlebug",
    description:
      "“That is a *great* question. The truth is, we simply do not know if the creature exists. All we have heard are wives tales and all we have read are story books. It could be the case that the elusive cuddlebug is merely a myth. But very real creatures have been considered myth in the past, that is, until we discovered them for real.” - Golen Diffney, Magical Historian\n\n***Without form.*** Of all the reports that have been collected, no two witnesses describe the cuddlebug as appearing the same. In every situation, however, the witness will describe the cuddlebug as the cutest little creature they have seen. It is believed that the cuddlebug will probe the mind of those it is in contact with and change its appearance to what the victim thinks is cute.\n\n***Social parasite.*** While the exact origin of the cuddlebug is a mystery, it is quite clear that the creature’s goal is survival. The cuddlebug will embed itself into any group that is both willing and capable of protecting it. In general it won’t harm the group that is helping it, or even ask for much. However, if someone in the group shows signs of wanting to get rid of the cuddlebug, it will gladly turn the members of the group against one another to preserve it’s spot.",
    character: [
      {
        name: "Cuddlebug",
        aspects: [
          "Dangerously cute little guy",
          "Difficult to disagree with",
          "Wordless communication",
        ],
        tracks: [
          { name: "Physical Stress", values: ["1", "2"] },
          { name: "Mental Stress", values: ["1", "2", "3"] },
        ],
        slots: [],
        skills: [
          "+3 Aww! (Rapport)",
          "+2 What’s wrong? (Provoke)",
          "+2 Harmless little guy… (Deceive)",
          "+1 Look, it understands! (Empathy)",
          "+1 You know, you’re right… (Will)",
        ],
        stunts: [
          {
            name: "Reconsider",
            description:
              "Twice per scene, the cuddlebug can spend an action flaunting its cute self to try to change someone’s mind. The cuddlebug makes an Aww! (Rapport) roll contested by a Will check from the target. If it succeeds, the target magically changes their mind to agree with the cuddlebug.",
          },
          {
            name: "Everybody’s best friend",
            description:
              "Anyone who has been in contact with the cuddlebug for more than a day will begin to regard it as a close friend or ally. They will do what they can to keep the cuddlebug safe, even going as far as to value it over themselves or allies. In situations where someone or their ally would be harmed in an attempt to protect the cuddlebug, they may make a Good (+3) difficulty Will check to resist the cuddlebug’s charm. If they succeed, they not only will resist letting themselves or an ally be harmed, but they will also realize they have been magically influenced by the cuddlebug.",
          },
        ],
      },
    ],
  },
  {
    title: " Ent",
    description:
      "“Ents are not particularly brilliant. They aren’t fast. They’re not quick-witted. But if an ent addresses you, you stop and listen.” - Cortel Windwalker, Elvish Book-keeper\n\n***Ancient protectors.*** It is believed that the ents came about from old druidic magic millenia ago. They were brought to life to protect the forests they lived in. Ents are sturdy, and typically watch their portion of the forest in numbers. When the forest and the life within are disturbed, the ents step forward to keep the peace.\n\n***Living trees.*** Ents themselves descend from the trees they protect. They are tall, with thick bark and a myriad branches. Their ancestry lends itself to a passive approach in protecting the forest. Ents are keen to a simple life, taking things slow and steady, and are quite adverse to adventurous motivations. Many outside sources have tried to enlist the help of the ents to little success.",
    character: [
      {
        name: "Ent",
        aspects: [
          "Huge living tree",
          "Extremely old",
          "Stubborn and passive",
          "Flammable",
        ],
        tracks: [
          { name: "Physical stress", values: ["1", "2", "3"] },
          { name: "Mental stress", values: ["1", "2", "3"] },
        ],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
        ],
        skills: [
          "+5 Strength of ancients (Physique)",
          "+3 Crush (Fight)",
          "+3 Forest-watcher (Notice and Lore)",
          "+2 Stubborn (Will)",
        ],
        stunts: [
          {
            name: "Climbable",
            description:
              "Ents themselves can be occupied like a zone. The ent can be climbed from the zone it is in, or another zone reasonable. To climb on to the ent, it requires a +1 (Average) difficulty Athletics check. As the ent moves around, the characters on it also move.",
          },
          {
            name: "Natural appearance",
            description:
              "Ents look like trees themselves. All checks to notice an ent that hasn’t yet moved or revealed themselves are at +2 difficulty while the ent is in a wooded area.",
          },
          {
            name: "Thick bark",
            description:
              " If an attack is from a weapon that only bashes or pierces, the ent can use Strength of ancients (Physique) to defend.",
          },
        ],
      },
    ],
  },
  {
    title: "Undead Thralls",
    description:
      "“It didn’t matter where I went. Inevitably it found me. It didn’t matter the precautions I took. It faced them fearlessly. How do you outrun something which never tires? I decided I needed to become the hunter, and put an end to it myself.” - Unknown\n\n***Loyal servants.*** For as long as mortals have been dabbling in the necromantic arts, the notion of unfettering followers has captured the interest of deviants and scholars alike. Is it possible to enthrall the mind of someone to serve an unending and unquestioned sentence of obedience? They key, mages have found, is to bind the service of a thrall *after* death, rather than before. Some argue this makes thralls more morally sound. Others argue that this makes them worse.\n\n***Unwavering.*** Undead thralls excel at carrying out the will of their master. They have no will of their own. This unquestioned devotion makes them perfect for tasks that would typically weigh heavy and wear out a mortal servant. Finding a lost item, capturing an evasive foe, following a target to the end of the world; these are the things an undead thrall excels at.",
    character: [
      {
        name: "Undead Thrall",
        aspects: ["Servant in undeath", "No free will", "Unnatural strength"],
        tracks: [
          { name: "Physical stress", values: ["1", "2", "3", "4"] },
          { name: "Mental stress", values: ["1", "2"] },
        ],
        slots: [{ name: "Mild physical consequence", value: "2" }],
        skills: [
          "+3 Unnatural strength (Physique and Fight)",
          "+1 Meticulous analysis (Investigate)",
        ],
        stunts: [
          {
            name: "No free will",
            description:
              "The undead thrall cannot and will not be convinced to act against their master’s will. They have no compassion or empathy. They automatically succeed in Will checks related to decision making. They automatically fail Empathy checks.",
          },
          {
            name: "Unending pursuit",
            description:
              "The undead thrall excels at hunting down targets set out by their master. They are not quick at it, but they are consistent. After failing a Meticulous analysis (Investigation) check to figure out where someone went, they may continue to analyze the clues they have. After a number of hours equal to the shifts of failure, they will figure out where their target(s) went. Additionally, undead thralls never fail checks related to becoming tired or exhausted.",
          },
        ],
      },
    ],
  },
  {
    title: "Ratling",
    description:
      "“You want trade? You give twenty foot rope, six piton, canteen. I give two glass vial, bedroll.”\n\n***Resourceful.*** Ratlings are a race of subterranean bipeds that are as crafty as they are quick. Known for their contraptions and being oddly prepared for whatever situations they get into, ratlings have many times been called ‘the Gnomes of the underground.’ This, of course, is much to the chagrin of the Gnomes. The lack of great communication skills has made the ratlings look stupid, but underneath their dirty exterior is a very clever mind.\n\n***Greedy colonies.*** Ratlings live in large packs in caves and burrows. Within the pack, the ratlings share all that they own, making sure to provide for the members most in need within their extensive family. Those outside of the pack are not treated as nicely. Ratlings are known to scavenge, collect, or outright steal anything that they deem necessary to their colony.",
    character: [
      {
        name: "Ratling",
        aspects: ["Clever rat-like humanoid", "Anything for the colony"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: [
          "+4 Scurry (Athletics)",
          "+3 Clever (Crafts)",
          "+2 Scrap (Fight and Shoot)",
        ],
        stunts: [
          {
            name: "Prepared",
            description:
              "Once per scene, the ratling can use Clever (Crafts) instead of any other skill.",
          },
          {
            name: "Overwhelm",
            description:
              "An opponent of the ratlings that has two or more ratlings in their zone gets a -2 to all rolls related to moving between zones, and gains the *Overwhelmed* aspect while this remains true.",
          },
        ],
      },
    ],
  },
  {
    title: "Small Woodland Creatures",
    description:
      "“It’s amazing what you’ll see when you actually slow down and take a moment to appreciate nature. You can get so caught up in all the big monsters and exotic wildlife that it is easy to miss the small things. Keep an eye out for the beautiful gliding tem-tems or a vyaga tunneler next time you’re traveling through the woods!” - Rod Lefure, Shopkeep\n\n***Tem-Tems.*** The tem-tem kite-rat, also called ‘tem-tems’ or ‘kite-rats’ for short, are a species of rodent named for their gliding membranes. While most tem-tems live on ground level, they will often times run up trees and other tall objects so they may bound off of them, and glide toward their goal. Tem-tems live in large families of 6 to 12, and will team up with the other tem-tems to fight off potential predators.\n\n***Vyaga Tunnelers.*** Vyaga tunnelers are a species of small mammals that burrow just below the forest floor. They are herbivores, and as such do all that they can to avoid other living things. Vyaga tunnelers live in groups of 2 to 4, and build small, temporary burrows for shelter. Hunters will often wear vyaga pelts, since obtaining one is a sign of great prowess.",
    character: [
      {
        name: "Tem-Tem Kite-Rat",
        aspects: ["Small gliding rodent", "Territorial"],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: ["+1 Swarm (Fight and Provoke)", "+1 Rambunctious (Athletics)"],
        stunts: [
          {
            name: "Glide",
            description:
              "The tem-tem kite-rat has patagia (gliding membranes) to help it glide through the air. It automatically succeeds on overcome checks related to moving over ground-level obstacles like pits or deep mud.",
          },
          {
            name: "Flock",
            description:
              " After any character misses an attack against a tem-tem kite-rat, it and all other tem-tem kite-rats in it’s zone may move up to one zone.",
          },
        ],
      },
      {
        name: "Vyaga Tunneler",
        aspects: ["Small tunneling mammal", "Easily frightened"],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: ["+2 Scramble (Athletics)", "+1 Keen senses (Notice)"],
        stunts: [
          {
            name: "Tunnel",
            description:
              "A vyaga tunneler can easily move through soft ground. Granted it is made from dirt, sand, or another soft material, the vyaga tunneler can move through the ground as effortlessly as above ground.",
          },
          {
            name: "Tunnel systems",
            description:
              "The vyaga tunneler can take advantage of tunnels that have already been dug. As it’s normal move, a vyaga tunneler can move to any zone with another vyaga tunneler in it, provided both zones are connected by soft ground.",
          },
        ],
      },
    ],
  },
  {
    title: "Monks",
    description:
      "“I don’t think I would have the patience to be a monk. So much of my life would be wasted exercising in some far off location, saying chants and things. No, I don’t think I could do it. But don’t misinterpret me; I would never mess with a monk either.”\n\n***A life of discipline.*** Monks are masters of discipline. They train their minds and their bodies to listen to only the input which is beneficial to their goals. They hone their skills in combat and teach themselves to move with the ebb and flow of their surroundings. Many monks have a cause, but every one of them is different. If you meet them in polite company, they may be willing to share, provided you listen with an open mind.",
    character: [
      {
        name: "Monk",
        aspects: ["Disciplined hand-to-hand fighter", "Patient", "Dedicated"],
        tracks: [
          { name: "Physical Stress", values: ["1", "2", "3"] },
          { name: "Mental Stress", values: ["1", "2", "3"] },
        ],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Fist and foot (Fight and Athletics)",
          "+2 Conditioning (Physique)",
          "+2 Sound mind (Will and Empathy)",
        ],
        stunts: [
          {
            name: "Shrug it off",
            description:
              "Once per scene, when a monk would take physical stress, they may take it as an equivalent amount of mental stress instead.",
          },
          {
            name: "Counter-attack",
            description:
              "After rolling a defend check with Fist and foot (Fight), the monk may choose to inflict physical stress on the attacker equal to the shifts of success of the defense, as long as the attacker is in the same zone.",
          },
          {
            name: "Press the advantage",
            description:
              "Regardless of if an attack is a success with style or not, as long as there are positive shifts, the monk may choose to lower the number of shifts by one to gain a boost.",
          },
        ],
      },
    ],
  },
  {
    title: "Icy the Snowman",
    description:
      "“Icy the Snowman was an angry, snappy snow.”\n\n***Artifacts of Snow Enchantment.*** Before the second great war of the North Pole, Santa’s Elven artificers took up the mantle of creating the perfect weapon to help defend his realm from the Gingerbread menace. What better magics would there be than ones that pulled the very snow from the earth? A series of artifacts were forged at places of great power: a scarf at the heart of the gumdrop forest, a corncob pipe in the depths of the icy lakes of Jack Frost’s domain, a hat in the caves of the abominable snowbeasts, among others. These artifacts were meant to turn constructions of snow into living, fighting, weapons of war. Some were more successful than others.",
    character: [
      {
        name: "Icy the Snowman",
        aspects: ["Living livid snowman", "Made of snow", "Product of magic"],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Snowmanship (Crafts)",
          "+3 Frozen blades (Fight)",
          "+2 Snowball (Shoot)",
          "+2 Eyes of coal (Notice)",
        ],
        stunts: [
          {
            name: "Pack snow",
            description:
              "Icy can absorb the snow from the ground as he maneuvers through the battlefield. When Icy moves from a zone with snow to another zone with snow, he clears his lowest checked stress box.",
          },
          {
            name: "Snowballer",
            description:
              " Icy the Snowman is particularly efficient in raining down snow upon his enemies. Each turn, Icy can make one Snowball (Shoot) attack without using his action.",
          },
          {
            name: "Transmute water",
            description:
              "Icy can transmute water between the states of liquid, snow, and ice. When he creates an advantage related to water, snow, or ice, he gets an extra free invoke.",
          },
          {
            name: "Corn cob pipe",
            description:
              "When Icy is taken out, he leaves behind his corn cob pipe. If this pipe is added to a completed snowman, Icy will be reborn once again into it’s body.",
          },
        ],
      },
    ],
  },
  {
    title: "Companion Drone",
    description:
      '"To activate a utility protocol, simply speak your companion drone’s activation sequence, followed by the sequence you’d like them to execute. The default activation sequence is ‘Okay companion.’\n\nRemember that, although your companion drone is equipped with state-of-the-art speech recognition software, it will never develop a personality. If you feel your companion drone has developed a personality, hard-cycle the power by pressing and holding the emergency restart button on the rear underpanel. If the problem persists, return your companion drone to your manufacturer and visit your regular mental health specialist.\n\nIf at any time you are dissatisfied with the performance of your new companion drone, let it know, and it’s apology protocol will activate to sooth your worries. Thank you, and enjoy!”',
    character: [
      {
        name: "Companion Drone",
        aspects: ["Robotic battle assistant", "Diagnostic suite"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Fly (Athletics)",
          "+2 Utility protocols (Crafts)",
          "+1 Combat (Fight and Shoot)",
          "+1 Cloaking device (Stealth)",
        ],
        stunts: [
          {
            name: "Diagnose health",
            description:
              "Once per scene the companion drone can run a health diagnostic on all the characters currently present. For each character that is diagnosed, the companion reveals the value and status of all of the character’s physical stress boxes. This diagnostic cannot reveal information about other stress tracks or any consequences.",
          },
          {
            name: "Liquid biology",
            description:
              "As an action, the companion drone can attempt to tend to the wounds of a character. The companion drone makes a Utility protocols (Crafts) overcome check with a difficulty equal to the value of one checked physical stress box on the target. If the overcome check succeeds, the character unchecks the targeted physical stress box.",
          },
        ],
      },
    ],
  },
  {
    title: "Gnoll",
    description:
      "“We were traveling for days through the hills and plains. We knew of the threat before setting off on our journey. We had hired protection to keep us and the shipment safe. Everything was set. We were told if the gnolls were going to attack it would happen suddenly and without warning. It was true, but not in the way we expected. For six days we saw the gnolls trailing us. Every time we got on a high enough hill or an open enough field, there they were, some hour or two behind us. With the threat looming, we started camping less and moving more.\n\nIt was too late before we realized what was happening. We were exhausted. One morning, in broad daylight, they arrived. The hired protection stood no chance. We had nearly a week of warning, and yet, the attack was unexpected as ever. I was the lucky one who survived.”",
    character: [
      {
        name: "Gnoll",
        aspects: ["Feral upright hyena", "Flesh eater", "No regard for life"],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: [
          "+2 Slash (Fight)",
          "+2 Sprint (Athletics)",
          "+1 Throw (Shoot)",
          "+1 Hunt (Notice)",
        ],
        stunts: [
          {
            name: "Rampage",
            description:
              "When the gnoll takes out a target with an attack, it may move one zone and make a (Fight) attack. The gnoll may only use this ability once on its turn.",
          },
          {
            name: "Play rough",
            description:
              "When the gnoll successfully defends against a Fight attack, the attacker is dealt 1 physical stress.",
          },
        ],
      },
    ],
  },
  {
    title: "Displacer Beast",
    description:
      "“Ah, the displacer beast. A real marvel in illusory magic. They have the ability to bend your perception of them to their will! Very dangerous creatures. They’ll creep up on you from the shadows, staying low, waiting for you and your party to show any bit of weakness. When you do, they’ll pounce at you, using their six muscular legs to propel them in your direction! Just when you think it couldn’t get any worse, two huge, spiked tentacles reveal themselves. You swing- but despite your good aim, it is a miss. ‘Where is it, where did it go?’ you’ll think to yourself. And thus begins the dance of the displacer beast.\n\nVery marvelous creatures. Dangerous, beautiful. A shining example of an extraordinary, wild beast. What drives them? Is it hunger? Pure hate? I am determined to find out. I captured a young displacer beast, and I intend on training it. Now where could that little thing be off to? Schröganger! Schröganger, where are you?”",
    character: [
      {
        name: "Displacer Beast",
        aspects: [
          "Large panther-like predator",
          "Displacement field",
          "Whip-like tentacles",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Agile (Athletics)",
          "+3 Feint (Deceive and Provoke)",
          "+2 Tentacle whip (Fight)",
          "+2 Hunt (Stealth)",
        ],
        stunts: [
          {
            name: "Displacement field",
            description:
              "The displacer beast has the innate ability to bend the light around it to appear where it is not. The displacer beast may invoke *Displacement field* for free. Additionally, when the displacer beast succeeds with style on a defense check, it may reveal that it was really in an adjacent zone the whole time! If the displacer beast gets hit with an attack, it loses its *Displacement field* aspect, and these abilities, until the end of its next turn.",
          },
          {
            name: "Tentacle reach",
            description:
              "The displacer beast may use Tentacle whip (Fight) to attack enemies in zones adjacent to it. Once per turn, when the displacer beast makes a Tentacle whip (Fight) attack, it may make a second Fight attack immediately afterward.",
          },
        ],
      },
    ],
  },
  {
    title: "Insect Swarms",
    description:
      "On the edge of society, where nature is left to do it’s work, large colonies of insects prey on animals too small to fend them off. They feast, they multiply, and they spread. They build tunnels and hives, and lie in wait for those unfortunate enough to unearth them.",
    character: [
      {
        name: "Wasp Swarm",
        aspects: [
          "Large swarm of wasps",
          "Flying in unison",
          "Cannot be reasoned with",
        ],
        tracks: [{ name: "Stress", values: ["2", "2", "2"] }],
        slots: [],
        skills: ["+? Swarm (Fight)", "+3 Fly (Athletics)"],
        stunts: [
          {
            name: "Swarm of insects",
            description:
              "The Swarm (Fight) skill of the wasps is equal to the number of unchecked stress boxes they have.",
          },
        ],
      },
      {
        name: "Beetle Swarm",
        aspects: [
          "Large swarm of beetles",
          "Moving in unison",
          "Cannot be reasoned with",
        ],
        tracks: [{ name: "Stress", values: ["2", "2", "2", "2"] }],
        slots: [],
        skills: ["+? Swarm (Fight)", "+2 Crawl (Athletics)"],
        stunts: [
          {
            name: "Swarm of insects",
            description:
              "The Swarm (Fight) skill of the beetles is equal to the number of unchecked stress boxes they have.",
          },
        ],
      },
      {
        name: "Spider Swarm",
        aspects: [
          "Large swarm of spiders",
          "Moving in unison",
          "Cannot be reasoned with",
        ],
        tracks: [{ name: "Stress", values: ["2", "2", "2"] }],
        slots: [],
        skills: [
          "+? Swarm (Fight)",
          "+2 Crawl (Athletics)",
          "+2 Web (Physique)",
        ],
        stunts: [
          {
            name: "Swarm of insects",
            description:
              "The Swarm (Fight) skill of the spiders is equal to the number of unchecked stress boxes they have.",
          },
          {
            name: "Encase with webs",
            description:
              "The spider swarm can all begin webbing a target all at once. They make a Web (Physique) attack against the target. If it hits, no damage is dealt, but the target gains the *Webbed* aspect. While the target is *Webbed*, they may not move between zones, and the spiders may invoke *Webbed* for free.",
          },
        ],
      },
      {
        name: "Centipede Swarm",
        aspects: [
          "Large swarm of centipedes",
          "Moving in unison",
          "Cannot be reasoned with",
          "Poisonous bite",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [],
        skills: ["+? Swarm (Fight)", "+2 Crawl (Athletics)"],
        stunts: [
          {
            name: "Swarm of insects",
            description:
              "The Swarm (Fight) skill of the centipedes is equal to the number of unchecked stress boxes they have.",
          },
          {
            name: "Poisonous bite",
            description:
              "Instead of inflicting physical stress equal to the number of shifts when hitting with a Swarm (Fight) attack, the centipedes inflict physical AND mental stress equal to the number of shifts of the attack.",
          },
        ],
      },
    ],
  },
  {
    title: "Elemental",
    description:
      "It has long been argued where the elementals originally came from. Some say they are an extension of the Gods themselves. Others claim they are the incarnation of nature’s wrath. Some believe there are a series of elemental planes from which these spirits originate. There are others still that believe elementals are really just mortal souls that never found their way to the afterlife, manifesting in whatever way they can.\n\nWhile the origin is debated, there are properties of elementals that we know by observation. Elementals cannot be reasoned with. There are no words that can placate an angry elemental, and they treat mortals like unimportant insects. It is because of this that many advise staying clear of elementals, for an elemental with a goal will not hesitate to eliminate a mortal who stands in their way. ",
    character: [
      {
        name: "Fire Elemental",
        aspects: ["Being of pure fire", "Unforgiving"],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [],
        skills: [
          "+3 Burn (Fight)",
          "+2 Flame spout (Shoot)",
          "+2 Dancing flames (Athletics)",
        ],
        stunts: [
          {
            name: "Set ablaze",
            description:
              "When a fire elemental succeeds with style on a Fight or Shoot attack that utilizes its flames, the target gains the *On fire* aspect.",
          },
          {
            name: "Playing with fire",
            description:
              "When a fire elemental succeeds when defending against a Fight attack from an enemy within the same zone as it, the attacker takes physical stress equal to the shifts of success of the defense roll.",
          },
        ],
      },
      {
        name: "Water Elemental",
        aspects: ["Being of pure water", "Immune to fire", "Unyielding"],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [{ name: "Mild physical consequence", value: "2" }],
        skills: [
          "+3 Water whip (Fight and Shoot)",
          "+2 Dancing waves (Provoke)",
          "+2 Ebb and flow (Athletics)",
        ],
        stunts: [
          {
            name: "Crashing wave",
            description:
              "When a water elemental enters a new zone, it may force one character in the zone to move to an adjacent zone. ",
          },
          {
            name: "Seaspirit",
            description:
              "Once per turn a water elemental may enter a body of water at one location and exit any body of water in the scene at another location. If a water elemental submerges entirely in water, it cannot interact with anything outside of the water until it once again resurfaces.",
          },
        ],
      },
      {
        name: "Earth Elemental",
        aspects: ["Being of pure earth", "Feels no pain", "Merciless"],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4", "5"] }],
        slots: [
          { name: "Mild physical consequence", value: "2" },
          { name: "Moderate physical consequence", value: "4" },
        ],
        skills: [
          "+4 Crush (Fight)",
          "+4 Rock solid (Physique)",
          "+1 Flying rock (Shoot)",
        ],
        stunts: [
          {
            name: "Meld with stone",
            description:
              "An earth elemental may move through earth and stone with ease. If an earth elemental melds entirely with stone or earth in this way, then it cannot interact with anything outside of the stone or earth until it once again resurfaces.",
          },
        ],
      },
      {
        name: "Air Elemental",
        aspects: ["Being of pure air", "Flying", "Implacable"],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [],
        skills: [
          "+4 Just out of reach (Athletics)",
          "+3 Gust (Shoot)",
          "+2 Wind whip (Fight)",
        ],
        stunts: [
          {
            name: "Gust",
            description:
              "Whenever an air elemental hits with a Fight or Shoot attack that utilizes its wind, it may force the target to move one zone.",
          },
          {
            name: "Windwalk",
            description:
              "An air elemental may move an additional zone each turn.",
          },
        ],
      },
    ],
  },
  {
    title: "Ooze",
    description:
      "Oozes, also known as slimes, are large, gelatinous piles of goo that have a primitive intelligence and penchant for hunting. Rather than using speed or prowess to catch their prey, they use a mixture of stealth and persistence. Oozes live in caves and deep dungeons, blending in with their surroundings by appearing as innocuous puddles. When an animal or other potential target gets too close, the oozes slide into them, ensnaring them with their sticky bodies. Adventurers and would-be dungeon delvers would be wise to travel with a torch, as oozes tend to be quite flammable.",
    character: [
      {
        name: "Ooze",
        aspects: [
          "Creeping gelatinous substance",
          "Basic intelligence",
          "Aggressive solvent",
          "Sticky",
          "Flammable",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [],
        skills: [
          "+4 Envelop (Fight)",
          "+2 Blend in (Stealth)",
          "+2 Induce panic (Provoke)",
        ],
        stunts: [
          {
            name: "Envelope",
            description:
              "After an ooze hits with an Envelope (Fight) attack, the target gains the *Stuck in ooze* aspect. Whenever an ooze makes an Envelope (Fight) attack, all opponents in the same zone as the ooze with the *Stuck in ooze* aspect must also defend against the attack as if attacked individually.",
          },
          {
            name: "Slowly creeping",
            description:
              "An ooze does not get a free movement each turn, and must instead expend an action to move.",
          },
          {
            name: "Gelatinous",
            description:
              "An ooze may defend against Shoot attacks using Envelope (Fight), if fire is *not* involved. An ooze may *not* defend against Fight attacks with Envelope (Fight) if fire *is* involved.",
          },
        ],
      },
    ],
  },
  {
    title: "Ogre",
    description:
      "“The first time I fought an ogre- well, the only time really- was probably the bloodiest battle I have been a part of. We were in a cave, we had just finished assaulting a camp filled with various goblinoids. They had been harassing a nearby town and so we were called in to deal with them. So at the edge of the camp was this cave that the orcs retreated into it. We didn’t take too long considering why they’d trap themselves inside before we march on it in pursuit, big mistake. We heard the chains drop and this *unforgettable* roar.\n\nThe beast started cracking skulls. And I don’t just mean the men in my company. It killed orcs, it killed goblins. Sometimes on purpose, sometimes on accident. The sheer weight of this thing was impressive. I’d love to say we brought it down. We retreated, six of our men dead.” - Karyetta, Mercenary",
    character: [
      {
        name: "Ogre",
        aspects: [
          "Massive green-skinned beast",
          "Child-eater",
          "Unintelligent",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4", "5"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
        ],
        skills: [
          "+6 Muscle (Physique)",
          "+4 Clobber (Fight)",
          "+3 Intimidate (Provoke)",
        ],
        stunts: [
          {
            name: "Ungainly",
            description:
              "The first time it gets attacked between each of it’s turns, an ogre may defend normally. After that, each time an ogre defends with Clobber (Fight), it rolls with a +0 instead of a +4.",
          },
          {
            name: "Threatening",
            description:
              "After a character moves into the same zone as an ogre, they may not move any more zones for the rest of the turn.",
          },
          {
            name: "Reckless",
            description:
              "After an ogre misses a Clobber (Fight) attack, it may create a situational aspect related to how its attack damaged the environment around it.",
          },
        ],
      },
    ],
  },
  {
    title: "Tavern Employees",
    description:
      "It is often said that the world holds more than meets the eye. But sometimes, it holds much more than even that. That is the case for the Sneezing Weasel, a well loved tavern at the heart of the city. For every good night they provide their patrons they harbor secrets to boot. There are very few that have begun to unravel them.",
    character: [
      {
        name: "Kerrigan Sheffyll",
        aspects: [
          "Barmaid of the Sneezing Weasel",
          "Assassin for hire",
          "Quite charming",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+5 Stalk (Stealth)",
          "+4 Assassinate (Fight)",
          "+3 Charm (Rapport)",
          "+2 Lay low (Deceive)",
          "+1 Track (Investigate)",
        ],
        stunts: [
          {
            name: "Adaptive fighting",
            description:
              "Anything can be used as a weapon if you’re holding it right. Kerrigan can never be *Unarmed*. Additionally, twice per scene Kerrigan may use Assassinate (Fight) in place of Athletics to defend.",
          },
        ],
      },
      {
        name: "Flynn Burgata",
        aspects: ["Bouncer of the Sneezing Weasel", "Expert thief", "Burly"],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+5 Swindle (Burglary)",
          "+4 Handle (Physique)",
          "+3 Protect (Fight)",
          "+2 Lay low (Deceive)",
          "+1 Spot (Notice)",
        ],
        stunts: [
          {
            name: "Pat down",
            description:
              "Pickpocketing is easier when you’re expected to be going through people’s things. Whenever Flynn gives someone a pat down, he automatically learns of all weapons the individual has on them. Additionally, he may attempt to make a Swindle (Burglary) check against them in the same action.",
          },
        ],
      },
      {
        name: "Maica Nelhorn",
        aspects: [
          "Barkeep of the Sneezing Weasel",
          "Illicit goods fence",
          "No nonsense",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+5 Deal (Resources)",
          "+4 Network (Contacts)",
          "+3 Appraise (Investigate)",
          "+2 Lay low (Deceive)",
          "+1 Carouse (Rapport)",
        ],
        stunts: [
          {
            name: "Hospitality",
            description:
              "A man who feeds you is surely a trustworthy one. Maica gets +2 to Rapport and Deceive checks when interacting with someone he has served food or drink recently.",
          },
        ],
      },
    ],
  },
  {
    title: "Ightlyech the Eldritch Horror",
    description:
      '*“Where mortal men dare not tread\nShe sits and spins her snaring thread\nWith minds alive and but morals dead\nShe wills her bastard children fed"*\n',
    character: [
      {
        name: "Ightlyech",
        aspects: [
          "Unthinkable winged monstrosity",
          "These wings are made for flying",
          "Venom-filled stinger",
          "Web-glands",
          "I must protect my eggs at all cost",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
        ],
        skills: [
          "+4 Unthinkable knowledge (Lore) +3 Abomination (Fight and Physique)",
          "+2 Unwavering (Notice and Will)",
          "+2 Needle spines (Shoot)",
          "+1 Squirm (Athletics)",
        ],
        stunts: [
          {
            name: "Flammable webs",
            description:
              "At the end of each turn, as long as her *Web-glands* are in tact, Ightlyech may fire webs up to one zone away, covering that zone in *Sticky-flammable* webs. Characters in that zone must overcome an average (+1) difficulty check to leave the zone or perform movement intensive actions within it. At the beginning of each of her turns, Ightyech ignites the zone that has webs, clearing them and inflicting 2 points of physical stress to all characters in the zone.",
          },
          {
            name: "Devour subject",
            description:
              "Once per turn for free, Ightlyech may devour a willing character in her zone, healing any single stress box.",
          },
          {
            name: "Transforming sting",
            description:
              "As an action, Ightlyech can sting two willing characters in her zone to transform them into a Transformed Cultists of Ightlyech (see below). Additionally, when Ightlyech hits with an Abomination (Fight) attack, she may forgo dealing stress to force the target to make a Will check with a difficulty equal to the shifts of the hit. If the character fails, they gain the *Overcome with madness* aspect.",
          },
        ],
      },
      {
        name: "Cultist of Ightlyech",
        aspects: ["Insane minion of Ightlyech", "Undying loyalty"],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: ["+1 Ritualistic practices (Provoke, Will, Lore, Fight)"],
        stunts: [],
      },
      {
        name: "Transformed Cultist of Ightlyech",
        aspects: [
          "Revolting abomination of Ightlyech",
          "Sick transformation",
          "Overcome with insanity",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: ["+2 Tormented (Fight, Will, and Lore)"],
        stunts: [],
      },
    ],
    notes:
      "Note to GM: Every cultist you add to a conflict will make Ightlyech stronger. They are innocuous on their own, but Ightlyech’s abilities are boosted quite a bit by using them as pawns. Use the number of cultists as a way to balance the encounter to your liking. I’d suggest a lower end of three to five for an easy fight, and ten to twelve for a difficult one.",
  },
  {
    title: "Alexander Marshall, Superspy",
    description:
      "“Marshall is a man that will take on a dangerous job just for the challenge of it. And he’ll do things the hard way just for the story to tell. He is exhilarating like that. I’ve been tracking him for years. Every time he rears his head I send my underlings to try retrieving him. But if there is anything I have learned over the years, it’s that if you want to catch Alexander, you have to do it yourself. \n\nHe has been my most difficult bounty. And my biggest heartache.” - Maxinne “The Net” Garcia",
    character: [
      {
        name: "Alexander Marshall",
        aspects: [
          "International spy",
          "Penchant for romance",
          "Free agent for hire",
          "Never breaks a promise",
          "Longs for something more",
        ],
        tracks: [
          { name: "Physical stress", values: ["1", "2"] },
          { name: "Mental stress", values: ["1", "2", "3"] },
        ],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
          { name: "Severe consequence", value: "6" },
        ],
        skills: [
          "+4 Athletics",
          "+3 Fight, Deceive",
          "+2 Will, Stealth, Investigate",
          "+1 Resources, Contacts, Shoot, Notice",
        ],
        stunts: [
          {
            name: "Snap into action",
            description:
              "Alexander is an expert in deception, and one of the most important aspects of this is knowing when the jig is up. Alexander is always aware when he fails a Deceive or Stealth check. Once per scene, after this happens, Alexander may spend a Fate point to take a turn immediately.",
          },
          {
            name: "I like these odds",
            description:
              "Alexander is used to fighting when outnumbered. Whenever Alexander takes out an opponent with Fight or Shoot, he may apply extra stress (that wasn’t needed to take the target out) to any mooks in the same zone as his original target.",
          },
          {
            name: "Master of disguise",
            description:
              "Alexander knows how to slip seamlessly into character. He gets +2 to Deceive checks related to disguises, and automatically succeeds on checks related to maintaining a fake voice or accent.",
          },
        ],
      },
    ],
  },
  {
    title: "Dire Elk",
    description:
      "“It’s like any other elk you’ve seen. Except it’s *nothing* like that! You’d need to be three men tall if you wanted to touch this beast’s back. Absolutely enormous. If you like to appreciate nature, I’d recommend you appreciate this one from very far away.” \n\n“The dire elk is majestic. It brings to you an unexplainable awe. We have respect for them that goes back generations. They are one of the few peaceful animals large enough to deal with some of the nastiest things you can find in the forest.”\n\n“Ah, yes! An honorable hunt. They put up a good, honest fight. And when one falls, it feeds our clan for weeks. Not to mention, their antlers can be fastened into great spears.”",
    character: [
      {
        name: "Dire Elk",
        aspects: [
          "Massive forest elk",
          "Heavy inertia",
          "Larger than life",
          "Passive until provoked",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
        ],
        skills: [
          "+6 Sheer size (Physique)",
          "+3 Keen senses (Notice)",
          "+3 Trample (Fight - special)",
          "+2 Gore (Fight - special)",
        ],
        stunts: [
          {
            name: "Shake it off",
            description:
              "The first time the dire elk is attacked before each of it’s turns, it may defend with Sheer size (Physique).",
          },
          {
            name: "Trample and gore",
            description:
              "When the dire elk attacks a target that is on the ground in the same zone as it, it uses Trample (Fight). If it attacks a target that is not on the ground, it uses Gore (Fight).",
          },
          {
            name: "One elk stampede",
            description:
              "When the dire elk attacks using Trample (Fight), it may force any number of characters on the ground in the same zone as it to defend against the attack and take stress as if attacked individually.",
          },
          {
            name: "Untamable",
            description:
              "After the dire elk attacks a target, hit or miss, it may force one character in the same zone as it to move one zone (the destination is their choice).",
          },
        ],
      },
    ],
  },
  {
    title: "Werewolf",
    description:
      "Lycanthropy is a supernatural disease that causes it’s victim to transform into a crazed half-human half-wolf upon being exposed to the moonlight of a full moon. In addition to the physical transformation, a typical werewolf will lose their ability to reason and think like themselves. They do not recognize friend or foe, and will be sent into an uncontrollable frenzy. \n\nWhile there are definitely exceptions, the vast majority of werewolves are not werewolves by choice. When a human is subjected to a direct bite from a werewolf that penetrates their bloodstream, there is a high likelihood that the disease will be transferred to them. Currently, there is no known cure to lycanthropy.\n\nWerewolves, when in their wolf form, display an incredible regenerative quality. Because of this, they are nearly impossible to kill while transformed. Monster hunters have discovered, however, that silvered weapons have a nullifying effect on the regeneration.",
    character: [
      {
        name: "Werewolf",
        aspects: [
          "Muscular anthropomorphic wolf",
          "Vulnerable to silver",
          "Quick regeneration",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Muscular (Athletics and Physique)",
          "+2 Hunt (Notice and Fight)",
          "+1 Rage (Will)",
        ],
        stunts: [
          {
            name: "Regeneration",
            description:
              "Werewolves will truly never die unless exposed to silver. Attacks that do not involve silver (silver bullets, a silver-coated blade, etc.) can deal stress and consequences to the werewolf, but *cannot* take it out. At the beginning of each of the werewolf’s turns, if it was not exposed to silver in the previous round, it unchecks its lowest checked stress box.",
          },
        ],
      },
    ],
  },
  {
    title: "Mutant",
    description:
      "“It’s the same old story every time. Accidental exposure. Whether it be due to some spill during transportation, a bio-reactor meltdown, or some experiment gone awful. The subject is subjected to the substance. A, B, C, *bing, bang, bam.* The substance, which the government still hasn’t named, slips into the victim’s bloodstream and they experience rapid mutation. Half of them die of cancer. But the other half? Oh, oh.\n\nThe other half reacts, *god knows why*, with more synergy than a C-suite business meeting. Victims grow limbs, develop supernatural strength or speed, and pick up a special little penchant for destruction. *Loonies, all of them.* Then, the government sends in their goons to wrap things up all real nice with a bow. No one will hear a peep.\n\nThat’s where I come in. Now, if you’re all out of questions; you’re under arrest.”",
    character: [
      {
        name: "Mutant",
        aspects: [
          "Mutated victim of an unnamed substance",
          "A minor case of very bad cancer",
          "The government’s dirty little secret",
          "Penchant for destruction",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Mild consequence", value: "2" },
        ],
        skills: ["+2 Rage (Fight)", "+1 Resistance (Will)"],
        stunts: [
          {
            name: "Something extra",
            description:
              "Every mutant is different. This mutant gains two of the following skills, with an aspect of the same name. If the same skill is added twice, the higher value applies : \n+4 *Bulging muscles* (Physique) \n+3 *Prehensile tail* (Burglary and Athletics) \n+4 *Overactive adrenal glands* (Athletics) \n+3 *Extra set of arms* (Athletics and Physique)\n+3 *X-ray vision* (Notice and Investigate) \n+3 *Slime excretion* (Burglary and Provoke) \n+3 *Pheromones excretion* (Rapport and Contacts) \n+4 *Active camouflage* (Stealth)",
          },
        ],
      },
    ],
  },
  {
    title: "Plated Skeletons",
    description:
      "The ancient art of necromancy was not always as taboo as it is now. Civilizations long gone would use necromancy as a means of labor productions or protection. Some revered necromancy as a sacred cultural rite. Specially appointed magi would raise perished soldiers, or supply undead workers for farms and mills. With the widespread advent of new religious sects, necromancy went from common, to uncommon, to being only practiced by outlaws and outcasts.\n\nWith the slow fade of undead labor, so too did knowledge of the rituals used. Some of these techniques are lost forever, but others lie hidden in the books of long forgotten libraries and between the journal pages of deceased great wizards. One such technique detailed dipping the bones of the dead in hot metals before raising them. The metals acted as a means of strengthening the bone and providing a better vessel for the magic to seep into. This method was so successful that today, if you know where to look, you can find skeletons raised this way walking the sunken halls of dungeons hidden beneath the earth.",
    character: [
      {
        name: "Iron Skeleton",
        aspects: [
          "Undead skeleton",
          "Iron-dipped bones",
          "Dragging a warhammer",
          "Slow and heavy",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: ["+3 Smash (Fight)", "+2 Iron bones (Physique)"],
        stunts: [
          {
            name: "Heavy-handed",
            description:
              "If the iron skeleton succeeds with style on a Fight attack, his target is Knocked to the ground. The iron skeleton may invoke the *Knocked down* aspect for free.",
          },
        ],
      },
      {
        name: "Silver Skeleton",
        aspects: [
          "Undead skeleton",
          "Silver-dipped bones",
          "Wielding a rapier",
          "Light and brittle",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: ["+2 Slash (Fight)", "+2 Dancing bones (Athletics)"],
        stunts: [
          {
            name: "Reassemble",
            description:
              "At the beginning of each of its turns in a conflict, the silver skeleton will assemble any lost bones, recovering the lowest checked stress box.",
          },
        ],
      },
      {
        name: "Golden Skeleton",
        aspects: [
          "Undead skeleton",
          "Gold-dipped bones",
          "Heavy and brittle",
          "Radiating heat",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: ["+3 Burn (Fight)"],
        stunts: [
          {
            name: "Conglomerate",
            description:
              "If a golden skeleton is destroyed in the same zone as this golden skeleton, this golden skeleton will pull some of its bones to itself. Then this happens, the golden skeleton gains an empty [1] stress box.",
          },
          {
            name: "Hot gold",
            description:
              "The golden skeleton may invoke *Radiating heat* for free anytime it would make sense to invoke.",
          },
        ],
      },
    ],
  },
  {
    title: "Giant Snake",
    description:
      "Ever since animals have walked the planet, mother nature has been twisting them into extreme concoctions. The snake is no exception to this rule. In the depths of misty swamps, in the dews of far off caves, and beneath the dirt of ancient forests, giant snakes live and hunt.\n\nLike regular snakes, their giant cousins tote dangerous venom that they deliver in their bite. Unlike regular snakes, however, the giant variety poses some new threats due to its size. Giant snakes can use their impressive muscles to crush their prey. On occasion, stories have been told of giant snakes swallowing their victims before they’ve even been killed.",
    character: [
      {
        name: "Giant Snake",
        aspects: [
          "Massive slithering reptile",
          "One track mind",
          "Unhinging jaw",
          "Valuable scales",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [
          { name: "Mild physical consequence", value: "2" },
          { name: "Moderate physical consequence", value: "4" },
        ],
        skills: [
          "+5 Constrict (Physique)",
          "+4 Ready (Notice)",
          "+3 Bite (Fight)",
          "+2 Slither (Athletics)",
          "+1 Motionless (Stealth)",
        ],
        stunts: [
          {
            name: "Venom",
            description:
              "When a giant snake inflicts stress with a Bite (Fight) attack, the defender gains the *Poisoned* aspect. Removing this aspect requires an overcome check with a difficulty equal to the shifts of physical stress inflicted in the attack. Additionally, the attack inflicts 1 shift of mental stress.",
          },
          {
            name: "Swallow",
            description:
              "When a giant snake succeeds with style on a Bite (Fight) attack, they may forgo the normal benefits of a success with style, as well as the benefits gained from their Venom stunt. If they choose to do this, the target of the attack gets *Swallowed*.",
          },
          {
            name: "Constrict",
            description:
              "When a giant snake attacks a target that they have created the *Constricted* aspect on, they may use Constrict (Physique) instead of Bite (Fight). This attack is not eligible for the benefits of the Venom or Swallow stunts.",
          },
        ],
      },
    ],
  },
  {
    title: "Silver Dragon",
    description:
      "The silver dragon, like other metallic dragons, is one of good nature. They do not like killing, but will do so if put in a situation where it becomes necessary. Silver dragons are not ones to hunt evil like some metallic dragons do, but they will put evil to rest if they cross paths with it. \n\nSilver dragons enjoy learning about the traditions of the mortal races and partaking themselves when possible. They enjoy throwing feasts and attending dances, though are ironically distrusting of others. Because of this they tend to have these events in isolation, either alone or attended by their closest allies. Though the ability for a dragon to take human form is still harshly debated, scholars believe that it is likely they would use this ability to attend mortal events if they had it.",
    character: [
      {
        name: "Silver Dragon",
        aspects: [
          "Massive winged silver reptile",
          "Distrusting of others",
          "Good-natured and intelligent",
          "Infatuated with mortal traditions",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
          { name: "Severe consequence", value: "6" },
        ],
        skills: [
          "+5 Tradition (Lore)",
          "+4 Majestic beast (Physique and Athletics)",
          "+3 Deadly (Fight, Shoot, and Provoke)",
          "+2 Good-natured (Rapport)",
          "+1 Collected treasure (Resources)",
        ],
        stunts: [
          {
            name: "Chilling breath",
            description:
              "As an action, the silver dragon targets a zone (within shooting range) with a Deadly (Shoot) attack. All characters in the zone must defend against the attack and take stress independently. The zone gains the *Slick* aspect.",
          },
          {
            name: "Poison gas",
            description:
              "As an action, the silver dragon targets everyone in the zone it occupies with a Deadly (Shoot) attack. All characters in the zone must defend against the attack and take stress independently. Each character that takes stress from the attack gains the *Poisoned* aspect.",
          },
          {
            name: "The collector’s eye",
            description:
              "The silver dragon has done research on where powerful artifacts may lie in the surrounding area. It gets +2 to Tradition (Lore) checks to recall the potential location of magical items.",
          },
        ],
      },
    ],
  },
  {
    title: "Standard Troops",
    description:
      "When diplomacy is not an option, kingdoms settle their disputes on the battlefield. Battalions of hundreds of soldiers clash in unforgettable skirmishes, turning forests and fields into mass graveyards in the name of their king. Strategy and tactics are everything in battle, and for countless ages militaries have been improving upon the roles and outfittings that their armies employ.\n\n*Troop-scale combat: The following characters are ‘troop scale.’ That means a single stat block does not represent one person. Instead, a single stat block represents an entire group of soldiers. Battlefields for these soldiers would have zones as large, army-sized swaths of land. See yesterday’s Sundry Sunday (#44) for an example of a potential battlefield.*",
    character: [
      {
        name: "Company of Infantry",
        aspects: [
          "Company of 200 foot soldiers",
          "Vulnerable to cavalry charges",
          "Wielding swords and spears",
          "Equipped with kite shields",
        ],
        tracks: [
          { name: "Troop stress", values: ["1", "2", "3"] },
          { name: "Morale stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: [
          "+2 Close quarters combat (Fight)",
          "+2 Iron morale (Will)",
          "+1 Training regiments (Physique and Athletics)",
        ],
        stunts: [
          {
            name: "Hold the line! ",
            description:
              "The company of infantry gets +2 to Close quarters combat (Fight) checks when defending. Additionally, enemy companies cannot pass through an infantry line unless the infantry line has no unchecked stress boxes, or allows them to",
          },
        ],
      },
      {
        name: "Company of Archers",
        aspects: [
          "Company of 100 long bowmen",
          "Vulnerable to close quarters combat",
          "Wielding longbows",
        ],
        tracks: [
          { name: "Troop stress", values: ["1", "2"] },
          { name: "Morale stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: [
          "+3 Volley of arrows (Shoot)",
          "+1 Stand together (Will)",
          "+1 Training regiments (Physique and Athletics)",
        ],
        stunts: [
          {
            name: "Fire at will!",
            description:
              "When the company of archers attacks using Volley of arrows (Shoot), they may decide to *fire at will*. If they do this, instead of targeting a specific troop, they target an entire zone of the battlefield within range. All troops in the zone, including allies, must roll defense and take stress individually.",
          },
        ],
      },
      {
        name: "Company of Cavalry",
        aspects: [
          "Company of 30 horsemen",
          "Vulnerable to arrow fire",
          "Mounted on horseback",
          "Wielding lances and axes",
          "Equipped with kite shields",
        ],
        tracks: [
          { name: "Troop stress", values: ["1", "2"] },
          { name: "Morale stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: [
          "+2 Mounted combat (Fight)",
          "+2 Iron morale (Will)",
          "+2 On horseback (Physique and Athletics)",
        ],
        stunts: [
          {
            name: "Charge! ",
            description:
              "The company of cavalry get a +3 on Mounted combat (Fight) attacks if they are made immediately after entering a zone.",
          },
        ],
      },
    ],
  },
  {
    title: "Specialized Troops",
    description:
      "While standard battalions are tried and trusted for their versatility, sometimes what they have to offer is not enough. Differences in terrain, scale, and enemy can necessitate new strategies for outfitting soldiers. Throughout history, a myriad of interesting gear and training choices have revealed themselves as effective in specific situations.\n\n*Troop-scale combat: The following characters are ‘troop scale.’ That means a single stat block does not represent one person. Instead, a single stat block represents an entire group of soldiers. Battlefields for these soldiers would have zones as large, army sized swaths of land. See Sundry Sunday (#44) for an example of a potential battlefield, or an example of standard troops.*",
    character: [
      {
        name: "Company of Wardrummers",
        aspects: [
          "Company of 20 drummers",
          "Vulnerable to attack",
          "Carrying large mounted drums",
          "Lightly armed",
        ],
        tracks: [
          { name: "Troops stress", values: ["1"] },
          { name: "Morale stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: [
          "+3 Command patterns (Rapport)",
          "+2 Fear patterns (Provoke)",
          "+1 Training regiments (Physique and Athletics)",
        ],
        stunts: [
          {
            name: "Drums of war",
            description:
              "Wardrummers inform allies of battle plans through the patterns they play. When the company of wardrummers successfully creates an advantage using Command patterns (Rapport), they get two additional free invokes of the resulting aspect. ",
          },
        ],
      },
      {
        name: "Company of Light Infantry",
        aspects: [
          "Company of 100 foot soldiers",
          "Vulnerable to cavalry charges",
          "Lightly armed and armored",
          "Mobile",
          "Equipped for forest travel",
        ],
        tracks: [
          { name: "Troop stress", values: ["1", "2"] },
          { name: "Morale stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: [
          "+2 Mobility training (Athletics)",
          "+2 Iron morale (Will)",
          "+1 Close quarters combat (Fight)",
          "+1 Shortbows (Shoot)",
        ],
        stunts: [
          {
            name: "Press the advantage",
            description:
              "Aspects due to terrain that are negatively affecting enemies can be invoked by the company of light infantry for free. ",
          },
        ],
      },
      {
        name: "Company of Spearmen",
        aspects: [
          "Company of 100 spearmen",
          "Low mobility",
          "Wielding long pikes",
          "Anti-charge infantry",
        ],
        tracks: [
          { name: "Troop stress", values: ["1", "2"] },
          { name: "Morale stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: ["+2 Phalanx (Fight)", "+2 Iron morale (Will)"],
        stunts: [
          {
            name: "Wall of pikes",
            description:
              " It is difficult to mount an attack against an army protected by rows of long polearms without careful maneuvering. Any allied troops in the same zone as the spearmen, including the spearmen themselves, get the following ability;  When defending against Fight attacks, deal stress back to the attacker equal to the shifts of a successful defense, provided the attacker moved into this troop’s zone earlier on this turn. If there are multiple allied spearmen in this zone, the effect does not stack.",
          },
        ],
      },
    ],
  },
  {
    title: "Gryphon Rider",
    description:
      "Gryphons are powerful hybrid beasts, with the body of a lion and the head, wings, and talons of an eagle. Gryphons are intelligent hunters, using their flight and size to swoop down and take their prey by surprise at an alarming force. They can be quite territorial, and many stories of gryphons protecting their nest from larger, more monstrous foes has led to a legacy of courage and boldness. So much so that some armies and courts have adopted this majestic beast as their crest, claiming it represents their fearlessness even in dire situations.\n\nThe truly fearless, though, are those who embark to tame a gryphon. Many foolish eccentrics try to tame wild gryphons, but few actually succeed in the challenge. Those who do typically refuse to actually call it ‘gryphon taming’ because the notion of ‘taming’ an animal as intelligent as a gryphon is misleading. True gryphon riders much prefer to call their gryphons companions or partners.\n\nSome military troops have recognized the potency of having domesticated gryphons on their side, and have set out to start breeding programs. When successful, these breeding programs make taming gryphons (after the first generation) much easier, since they grow up in captivity rather than in the wild. Such military programs are an invaluable asset to the kingdoms that have them, giving them an edge in combat as well as swift cross-kingdom communication.",
    character: [
      {
        name: "Gryphon",
        aspects: [
          "Large lion-eagle hybrid",
          "Territorial hunter",
          "Courageous",
          "Can fly",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Talons (Fight)",
          "+3 Muscular (Physique)",
          "+2 Deft (Athletics)",
          "+1 Keen (Notice)",
        ],
        stunts: [
          {
            name: "Violent landing",
            description:
              "The gryphon can land in such a way that it throws its body weight into its enemies. When the gryphon ends its movement for the turn by landing, it can make a free Muscular (Physique) attack against one character in the zone.",
          },
          {
            name: "Snatch",
            description:
              " When the gryphon succeeds on a Talons (Fight) check against a target on the ground while flying it may choose to reduce the stress inflicted by one to impose a *Snatched* aspect on the character. Until *Snatched* is removed, the gryphon is holding the character in its talons.",
          },
        ],
      },
      {
        name: "Gryphon Rider",
        aspects: [
          "Gryphon jockey and trainer",
          "Fearless enough to try it",
          "Saddle suited for flight",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: [
          "+3 Jockey (Athletics)",
          "+2 Javelins (Shoot)",
          "+2 Spear (Fight)",
          "+1 Gryphon training (Lore and Empathy)",
        ],
        stunts: [
          {
            name: "Gryphon Riding",
            description:
              "When mounted in the saddle, the gryphon rider automatically succeeds on any checks related to remaining mounted to the gryphon if the source of opposition is related just to the speed or movement of the gryphon.",
          },
          {
            name: "Eccentric Combat",
            description:
              "The gryphon rider gets a +2 to any Athletics checks related to leaping from one place to another, grabbing something, maintaining a grip on something, or rolling with a fall or impact.",
          },
        ],
      },
    ],
  },
  {
    title: "Siege Troops",
    description:
      "Bards have sung legends of many great battles, but perhaps the most memorable of these are those fought to claim massive fortresses. These places are particularly difficult to seize, making them important points of interest in any war. For as long as walls have been built, people have been figuring out creative ways to tear them down. Successful assaults of such strongholds are often the turning point in long-fought wars of attrition.\n\n*Troop-scale combat: The following characters are ‘troop scale.’ That means a single stat block does not represent one person. Instead, a single stat block represents an entire group of soldiers. Battlefields for these soldiers would have zones as large, army sized swaths of land. See Sundry Sunday (#46) for guidelines on how to use troop-scale characters.*",
    character: [
      {
        name: "Trebuchet Troop",
        aspects: [
          "Three trebuchets with 15 attending soldiers",
          "Vulnerable to attack",
          "Lightly armed and armored attendants",
          "Flammable frame",
        ],
        tracks: [
          { name: "Troop stress", values: ["1"] },
          { name: "Morale stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: [
          "+4 Boulder fling (Shoot)",
          "+1 Stay on target (Will)",
          "+1 Training regiments (Physique and Athletics)",
        ],
        stunts: [
          {
            name: "Siege Weapon",
            description:
              "The trebuchet troop gets +2 to attacks and advantage creation when using Boulder fling (Shoot) against structures or characters hiding in structures.",
          },
        ],
      },
      {
        name: "Mobile Stair Towers",
        aspects: [
          "Three tall wheelable towers with 50 attending soldiers",
          "Flammable frame",
          "Lightly armed and armored attendants",
        ],
        tracks: [
          { name: "Troop stress", values: ["1", "2"] },
          { name: "Morale stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: [
          "+2 Engineered for war (Crafts)",
          "+2 Strength training (Physique)",
          "+1 Defend the towers (Fight)",
        ],
        stunts: [
          {
            name: "Mobile Staircase",
            description:
              "When the mobile stair towers are adjacent to a wall or tower with a walkable top, soldiers can ascend or descend the staircase within to negate any negative aspects related to scaling the wall. Additionally, the attendants of the mobile stair towers can create an advantage to make the towers *Locked on to the walls* using Engineered for war (Crafts). ",
          },
        ],
      },
      {
        name: "Battering Ram Ogres",
        aspects: [
          "Three large battering rams carted by 6 trained ogres",
          "Flammable frame",
          "Brutish ogres",
        ],
        tracks: [
          { name: "Troop stress", values: ["1", "2", "3"] },
          { name: "Morale stress", values: ["1", "2", "3"] },
        ],
        slots: [],
        skills: [
          "+4 Smash! (Fight) +2 Tough skin (Physique and Will)",
          "-2 Puny minds (Lore, Investigate, Notice)",
          "-1 Big and slow (Athletics)",
        ],
        stunts: [
          {
            name: "Battering Rams",
            description:
              "This troop is immune to penalties related to the difficulties of attacking a structure.",
          },
        ],
      },
    ],
  },
  {
    title: "Small-crew Spaceships",
    description:
      "When the space calls their name, few can resist the void’s beautiful lure. The starscape, to many, represents freedom. To others, it is a call to action. Regardless of the form space takes to coax you in, one of the most affordable methods of indulging in it’s vast skies is through work on a small-crew spaceship.\n\nThese ships typically have crews from 2 two 6 members, and can take a wide variety of shapes depending on the demands of the area they operate in. Vessels in this category can often be found engaging in mining, security, cargo hauling, and even piracy. It is up to the captain and her crew, not a governing body, to decide what the day to day looks like.",
    character: [
      {
        name: "Small Hauler",
        aspects: [
          "Four-crewmember cargo hauler",
          "Broad target",
          "Equipped with distress beacon",
        ],
        tracks: [
          { name: "Tech Stress", values: ["1", "2"] },
          { name: "Integrity Stress", values: ["1", "2"] },
          { name: "Cargo", values: ["3", "4"] },
        ],
        slots: [],
        skills: [
          "+3 Cargo holds (Size)",
          "+2 Trade networking (Comms)",
          "+1 Defensive system (Shields and Mass Drivers)",
        ],
        stunts: [
          {
            name: "Low-Power Life-Support",
            description:
              "The life-support system on this vessel is battery powered and takes little energy. Whenever this ship is powered down, whether manually or by force, the passengers are still supported by basic life support. While this is true, the ship adds +2 opposition to Scanner and Sensor checks meant to find it.",
          },
        ],
      },
      {
        name: "Small Mining Vessel",
        aspects: [
          "Three-crewmember mining vessel",
          "Bare essential systems",
          "Front-mounted drill",
        ],
        tracks: [
          { name: "Tech Stress", values: ["1", "2"] },
          { name: "Integrity Stress", values: ["2"] },
          { name: "Cargo", values: ["1"] },
        ],
        slots: [],
        skills: [
          "+3 Mining laser (Laser and Extraction)",
          "+2 Mineral scanner (Scanner)",
        ],
        stunts: [
          {
            name: "Clamp System",
            description:
              "This vessel is equipped with claw-like extrusions that allow it to lock on to asteroids, ships, and other moving objects. The vessel gains +2 to any overcome or create an advantage check related to attaching itself to other objects.",
          },
        ],
      },
      {
        name: "Small Pirate Ship",
        aspects: [
          "Five-crewmember unscrupulous fightercraft",
          "Fuel-hog",
          "Heat-seeking missiles",
        ],
        tracks: [
          { name: "Tech Stress", values: ["1", "2"] },
          { name: "Integrity Stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: [
          "+3 Gatling turret (Mass Drivers)",
          "+2 Defensive measures (Shields and Armor)",
          "+1 Heat-seeking payload (Missiles)",
        ],
        stunts: [
          {
            name: "Finish the job",
            description:
              "A target getting away could mean a whole lot more trouble than it’s worth. This vessel gets +2 to Thrust overcome checks to catch up to fleeing targets.",
          },
        ],
      },
    ],
  },
  {
    title: "Magical Troops",
    description:
      "It takes a very special mind to comprehend magic, let alone wield it in times of great stress. It is for this reason that war mages and the like are a very rare sight. But when soldiers with the correct aptitudes go through the proper training, the results can be awe-inducing. Magically inclined soldiers are trained for specific purposes from wreaking havoc to inspiring fear. \n\n*Troop-scale combat: The following characters are ‘troop scale.’ That means a single stat block does not represent one person. Instead, a single stat block represents an entire group of soldiers. Battlefields for these soldiers would have zones as large, army sized swaths of land. See Sundry Sunday (#46) for guidelines on how to use troop-scale characters.*",
    character: [
      {
        name: "Company of Warmages",
        aspects: [
          "Company of 60 warmages",
          "Vulnerable to cavalry charges",
          "Robed and lightly armored",
        ],
        tracks: [
          { name: "Troop Stress", values: ["1", "2"] },
          { name: "Morale Stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: [
          "+2 Destruction magic (Fight, Shoot, and Lore)",
          "+1 Concentration (Will)",
          "+1 Endurance training (Athletics)",
        ],
        stunts: [
          {
            name: "Scars of Havoc",
            description:
              "When the company of warmages succeeds with style on an attack using Destruction magic (Fight or Shoot), they automatically gain a boost without needing to lower the inflicted stress. Additionally, the boost has two invokes rather than one.",
          },
        ],
      },
      {
        name: "Undead Fodder",
        aspects: [
          "300 walking corpses and 20 necromancers",
          "Vulnerable to anti-magic",
          "Feel no fear",
        ],
        tracks: [
          { name: "Troop Stress", values: ["1", "2", "3", "4"] },
          { name: "Morale Stress", values: ["(Immune)"] },
        ],
        slots: [],
        skills: ["+2 Maul (Fight)"],
        stunts: [
          {
            name: "Feel no fear",
            description:
              "The undead fodder are immune to fear based effects and cannot take morale stress.",
          },
          {
            name: "Wall of bodies",
            description:
              "Enemy companies cannot pass through a line of undead fodder unless the fodder has no unchecked stress boxes, or allows them to.",
          },
        ],
      },
      {
        name: "Company of Terror-drummers",
        aspects: [
          "Company of 20 drummers",
          "Vulnerable to attack",
          "Carrying large enchanted drums",
          "Unarmed",
        ],
        tracks: [
          { name: "Troop Stress", values: ["1"] },
          { name: "Morale Stress", values: ["1", "2", "3"] },
        ],
        slots: [],
        skills: [
          "+3 Fear-inducing drums (Provoke)",
          "+1 Training regiments (Physique and Athletics)",
        ],
        stunts: [
          {
            name: "Drums of terror",
            description:
              "The sound of the enchanted drums strikes fear into the hearts of enemies. When the company of terror-drummers successfully creates an advantage using Fear-inducing drums (Provoke), they get two additional free invokes of the resulting aspect. ",
          },
        ],
      },
    ],
  },
  {
    title: "Medium-crew Spaceships",
    description:
      "When asked what it means for a space vessel to be “medium-sized” you’re likely to receive a wide variety of responses. It’s easy to classify a small ship as ‘small’, but ‘big’ ships vary so much in size that the word ‘big’ begins to lose meaning. Because of this, when people talk about ‘medium-sized’ ships, oftentimes they’re talking about those ships that are *just a bit bigger* than small ships. While this loose designation is occasionally used, you are much more likely to hear designations of function than size.",
    character: [
      {
        name: "Military Missile-boat",
        aspects: ["Eight-crewmember military artillery ship", "Skeleton crew"],
        tracks: [
          { name: "Tech Stress", values: ["1", "2"] },
          { name: "Integrity Stress", values: ["1", "2", "3", "4"] },
        ],
        slots: [],
        skills: [
          "+4 Missile launchers (Missiles)",
          "+3 Large armament chambers (Size)",
          "+2 Rotary guns (Mass Drivers)",
          "+1 Defensive measures (Shields and Armor)",
        ],
        stunts: [
          {
            name: "Target lock",
            description:
              "The missile-boat has a system to lock on to moving targets. This vessel may create advantages called *Locked* on using Sensors. The military missile-boat may invoke *Locked* on aspects for free",
          },
        ],
      },
      {
        name: "Luxury Space-bus",
        aspects: [
          "Fifteen-crewmember luxury passenger ship",
          "Not built for combat",
          "Room for thirty passengers",
        ],
        tracks: [
          { name: "Tech Stress", values: ["1", "2", "3", "4"] },
          { name: "Integrity Stress", values: ["1", "2", "3"] },
        ],
        slots: [],
        skills: [
          "+4 Luxury accommodations (Provisions) +3 Luxury service AI (Onboard AI)",
          "+2 Spacious seating (Size)",
          "+1 Onboard holo-web access (Comms)",
        ],
        stunts: [
          {
            name: "Emergency pacification system",
            description:
              "In the case of attack or tragedy, the luxury space-bus needs to be able to maintain peace among the passengers. In order to keep things calm and painless, the crew has the ability to flood the passenger cabin with gasses that will put humans into a deep, numbing sleep. Once per scene, the crew can create the *Pacification* gas aspect for free inside the cabin.",
          },
        ],
      },
      {
        name: "Data Mover",
        aspects: [
          "Ten-crewmember mobile datacenter",
          "Valuable target",
          "Information makes the galaxy go round",
        ],
        tracks: [
          { name: "Tech Stress", values: ["1", "2", "3", "4"] },
          { name: "Integrity Stress", values: ["1", "2", "3"] },
        ],
        slots: [],
        skills: [
          "+4 Data management system (Onboard AI)",
          "+2 Data transfer system (Comms)",
          "+2 Defensive measures (Shields and Armor)",
          "+1 Huge server racks (Size)",
        ],
        stunts: [
          {
            name: "Hacking countermeasures",
            description:
              "In the case that the data mover gets hacked, the advanced onboard AI will leap into action to trace the attack and launch a counter-hack. After all, risk of being counter-hacked is a great deterrent to hackers. When the Data Mover successfully defends against an attack that would have dealt Tech Stress, all surplus shifts of the defense roll are dealt as Tech Stress to the attacker, if applicable.",
          },
        ],
      },
    ],
  },
  {
    title: "Sailing Ships",
    description:
      "From pirates to privateers, from military men to traders, at any moment there are a vast number of ships sailing on the open seas. Some belong to private crews, and others fly the flags of the kingdoms that funded them. Regardless of your allegiance, having a ship at your disposal can prove to be invaluable.\n\n*Note: These stat blocks are compatible with the Troop Scale character sheets I’ve released in previous posts. Ships are powerful assets in a battle, so they act very similarly to a troop in that regard.*",
    character: [
      {
        name: "War Galley",
        aspects: [
          "Warship crewed by about 200 sailors",
          "Propelled manually by rowing",
          "No reliance on favorable winds",
        ],
        tracks: [
          { name: "Crew stress", values: ["1", "2", "3", "4"] },
          { name: "Ship stress", values: ["1", "2", "3"] },
        ],
        slots: [],
        skills: [
          "+3 Cannons (Shoot)",
          "+3 Manual steering (Drive)",
          "+2 Boarding (Fight)",
        ],
        stunts: [
          {
            name: "Overwhelm",
            description:
              "Galleys have very large crews which often overwhelm other ships in boarding fights. When making Boarding (Fight) attacks against other ships, the war galley adds +2 to the roll.",
          },
        ],
      },
      {
        name: "Pirate Cutter",
        aspects: [
          "Pirating ship crewed by about 12 sailors",
          "Small crew small capacity",
          "Designed for speed",
        ],
        tracks: [
          { name: "Crew stress", values: ["1"] },
          { name: "Ship stress", values: ["1", "2"] },
        ],
        slots: [],
        skills: [
          "+4 Excellent speed (Athletics)",
          "+1 Cannons (Shoot)",
          "+1 Quick course-corrections (Stealth and Deceive)",
        ],
        stunts: [
          {
            name: "Designed for speed",
            description:
              "The cutter is lightweight and hard to outmatch in speed. The cutter can move two zones with a single move, and never has to roll to do so.",
          },
        ],
      },
      {
        name: "Trading Carrack",
        aspects: [
          "Trading ship crewed by about 60 sailors",
          "Reliant on favorable winds",
          "Built for deep-ocean travel",
          "Large cargo holds",
        ],
        tracks: [
          { name: "Crew stress", values: ["1", "2", "3"] },
          { name: "Ship stress", values: ["1", "2", "3"] },
        ],
        slots: [],
        skills: [
          "+3 Cargo holds (Resources)",
          "+2 Hardy hull (Physique)",
          "+1 Cannons (Shoot)",
        ],
        stunts: [
          {
            name: "Well provisioned",
            description:
              "The trading carrack is provisioned for long journeys. As long as the ship remains on it’s intended course, it and it’s crewmembers never need to roll to overcome hunger, thirst, or sickness.",
          },
        ],
      },
    ],
  },
  {
    title: "Dire Wolf Rider",
    description:
      "Dire wolves are one of the most ferocious beasts that a commoner might actually have a run in with. They can occasionally be found hunting in forests, sleeping in caves, or attacking well-traveled roads. They are big, their shoulder height easily rivals that of a man. They are known for toying with their food- typically their sheer size and velocity can outmatch any prey they would hunt. Due to this, most creatures and people avoid them at any opportunity.\n\nOrcs, however, take a different approach when encountering dire wolves. Where others see a dangerous beast that is not worth trifling with, the Orcs see a potential weapon. It is well accepted that dire wolves cannot be tamed. Instead of letting that get in their way, Orcish dire wolf riders enter into a tenuous relationship with the beasts, often using dominance (rather than companionship) as their main method to keep them in line.",
    character: [
      {
        name: "Dire Wolf",
        aspects: [
          "Oversized wolf",
          "Untamable beast - “tamed”",
          "Bloodthirsty",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Untamable (Athletics)",
          "+3 Maul (Fight)",
          "+2 Keen nose (Notice)",
          "+2 Terrifying (Provoke)",
        ],
        stunts: [
          {
            name: "Play with my food",
            description:
              "After a dire wolf hits with a Maul (Fight) attack, the target of the attack is dragged with the dire wolf if it moves zones for the remainder of its turn. If this happens, the target of the attack must make an overcome check with Physique or Athletics not to fall *Prone*. The difficulty is equal to the shifts of the Maul (Fight) attack. ",
          },
          {
            name: "Out of control",
            description:
              " When the dire wolf’s rider is taken out or separated from the dire wolf, it goes into a mad frenzy. The wolf will not treat any character in the scene as friendly, since it simply cannot tell the difference. Additionally, when the dire wolf makes an attack against a character that attacked them since their last turn, they add +1 to the roll.",
          },
        ],
      },
      {
        name: "Dire Wolf Rider",
        aspects: [
          "Orcish wolf-tamer",
          "Chained to the beast",
          "Wielding a spear and javelins",
          "Unreasonable courage",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: [
          "+2 Spear (Fight)",
          "+2 Javelin (Shoot)",
          "+1 Wolf whisperer (Empathy)",
        ],
        stunts: [
          {
            name: "In Sync",
            description:
              "While the dire wolf rider is mounted on their dire wolf, treat them as the same character. Skills and stunts from both are available to the character, but their stress tracks remain separate. ",
          },
          {
            name: "Ride or Die",
            description:
              "Dire wolf riders chain their wrists to the collar of their dire wolves as a show of dominance. This also doubles as a method of remaining mounted on their beast. The dire wolf rider gains a +2 on checks to resist being dismounted. Also, the dire wolf and rider cannot move into separate zones until the *Chained to the beast* aspect is removed.",
          },
        ],
      },
    ],
  },
  {
    title: "Imp",
    description:
      "Imps, while rare on the material plane, are often depicted as small, red-skinned devils. They are known for their penchant for trickery, spending their days playing pranks on those that cross their path. While their pranks are generally *meant* to be harmless, they are oftentimes not, causing trauma or immense pain. \n\nImps are tragically lonely by nature, and will gravitate toward anyone who is willing to tolerate them. While those affected by an imp’s “harmless” pranks are unlikely to appreciate their company, some are keen to take advantage of the imp’s need for companionship. Imps are willing to enter into subservience for the chance to travel with someone, however their antics often cause their masters to leave them behind.",
    character: [
      {
        name: "Imp",
        aspects: [
          "Small devilish creature",
          "Eternally lonely",
          "Childish prankster",
        ],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: [
          "+4 Tag, you’re it! (Athletics)",
          "+2 Hide and seek (Burglary and Stealth)",
          "+1 Tickle (Fight)",
        ],
        stunts: [
          {
            name: "Slippery",
            description:
              "Imps are extremely difficult to pin down. When an imp fails any Tag, you’re it! (Athletics) roll, they may spend a Fate point to instead succeed.",
          },
          {
            name: "Shapeshift",
            description:
              "An imp may create an advantage to transform into the form of any small animal. The imp gains the basic abilities of that animal, such as burrowing or flight. It’s skills, however, do not change.",
          },
          {
            name: "Subservient",
            description:
              "Imps will do whatever they can to keep company. If a character spends more than two hours with an imp to bond with them, the imp will become emotionally attached to them. That character lowers their refresh by one until this bond is broken. Additionally, uses of Slippery take Fate points from that character’s supply. While bonded in this way, the imp will *usually* follow the character’s commands. Occasionally the imp will purposefully misinterpret instructions from the character. However, the imp will straighten up if risk of losing their companion is apparent.",
          },
        ],
      },
    ],
  },
  {
    title: "Circus Performers",
    description:
      "While some are content to plow fields or shape metal, circus performers prefer a life on the move. Troupes are made up from 20 to 50 performers, and oftentimes include a small cast of exotic animals. They rove from town to town, city to city, keeping an exhausting schedule of constant performance. But you won’t hear complaining; in a performer’s eyes, this is the only life for them. \n\nWorking in a circus troupe provides the performers with a loving family, a range of skills and crafts to perfect, a place to live, and a source of income. They get to visit some of the largest cities on the continent, and have the privilege of seeing far off destinations that others could only hope to experience one day. \n\nIn order to make ends meet, some troupes will sell their unique skill sets to whoever will pay. Many performers take up learning secondary trades like leather-working, trapping, or even bounty hunting.",
    character: [
      {
        name: "Circus Performer",
        aspects: [
          "Roving performance artist",
          "Dangerous for the sake of it",
          "The troupe is my family",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Performance (Rapport)",
          "+3 Fit (Physique and Athletics)",
          "+2 Side-hustle (One other skill)",
        ],
        stunts: [
          {
            name: "Peak physical shape",
            description:
              " A circus performer never has to roll Physique or Athletics overcome checks to move from one zone to another.",
          },
          {
            name: "Circus cant",
            description:
              "Circus performers have perfected a nonverbal form of communication with other performers of their troupe, and can communicate silently as long as they can see each other and have their hands and feet free.",
          },
          {
            name: "Life is a show",
            description:
              "Performers have learned how to use their craft in everyday life. A performer may spend a fate point to roll Performance in place of any other skill.",
          },
        ],
      },
    ],
  },
  {
    title: "Vampire",
    description:
      "Vampirism, a disease that many scholars claim doesn’t really even exist, is an affliction spread via bite from humanoid to humanoid. Along with physical alterations, the disease imposes a variety of strange social restrictions on victims. This includes the need to be invited in in order to enter someone’s house, and difficulty crossing rivers, among others. Scholars that do believe in the disease’s existence believe there to be a supernatural component, meant to explain the strange behaviors and incredible abilities of a vampire.\n\nThere are generally two categories of vampires. The “purebloods” are a group of vampires that have been around for as long as vampirism has been around. The purebloods believe only certain mortals have the right to become a vampire, and will only sire a new vampire if the prospect meets a set of stringent requirements. This includes sharing their pureblood ideology.\n\nThe second category of vampires is known as the “afflicted.” They view vampirism as more of a bane than a boon. There is no organized group behind the afflicted, and this category includes all of those forced into vampirism haphazardly. They have no strict code, and each operate independently on their own time.",
    character: [
      {
        name: "Vampire",
        aspects: [
          "Ageless blood drinker",
          "Unconventional social restrictions",
          "Vulnerable in sunlight",
          "Cannot die from old age",
          "Incredible strength and prowess",
          "No reflection",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
          { name: "Severe consequence", value: "6" },
        ],
        skills: [
          "+4 Vampiric power (Athletics and Physique)",
          "+3 Enchanting presence (Will, Rapport, Deceive, and Provoke)",
          "+2 Keen senses (Fight, Notice)",
          "+1 Creature of the night (Lore, Investigate, Contacts, Stealth)",
        ],
        stunts: [
          {
            name: "Difficult to kill",
            description:
              "While a vampire takes stress and consequences as normal, they may not be taken out except by a wooden or silvered stake through the chest or by being forced to swallow garlic. After taken out, if proper precautions are not taken, a vampire will come back to life in a week’s time. Precautions include decapitating the body, salting the remains, and burying the pieces in separate places.",
          },
          {
            name: "Unconventional social restrictions",
            description:
              "Vampires compulsively *must* follow certain restrictions. There are many, but the following are some of them; Vampires may not enter someone’s building unless invited inside. Vampires may not cross running water. Vampires may not stand on consecrated grounds such as churches or temples. Vampires may not kill other vampires. Vampires may not approach religious symbols held out by an individual if the individual is praying.",
          },
          {
            name: "Vulnerable in sunlight",
            description:
              "While in direct sunlight, the power of a vampire is reduced. During that time, they roll +0 for all skills.",
          },
        ],
      },
    ],
  },
  {
    title: "Mo’Morath the Hobgoblin",
    description:
      "The Bonesharp Clan is one of many groups of goblinoids that wander the freelands looking for targets to raid. They act opportunistically, always looking for the next quick score. They rob passing caravans when they spot them, attack villages when they appear undefended, and steal equipment if they can go unseen.\n\nThey tend to be quite successful. Many attribute this to the leader of the clan, a Hobgoblin by the name of Mo’Morath. He is known for being ruthlessly pragmatic, commanding raids only when the odds of coming out on top are in their favor. For this reason, the Bonesharp Clan has made a bit of a name for themselves. While he is a good strategist, Mo’Morath can let his pride get in the way at times.",
    character: [
      {
        name: "Mo’Morath",
        aspects: [
          "Hobgoblin leader of the Bonesharp Clan",
          "Prideful",
          "Armor of Various Melted Metals",
          "Imposing Strategist",
          "Goblinoid",
        ],
        tracks: [
          { name: "Physical Stress", values: ["1", "2", "3", "4"] },
          { name: "Mental Stress", values: ["1", "2"] },
        ],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
          { name: "Severe consequence", value: "6" },
        ],
        skills: [
          "+5 Red-hot blade (Fight)",
          "+4 Heat metal (Lore)",
          "+3 Muscular (Physique)",
          "+2 Quick thinker (Investigate and Notice)",
          "+1 Conditioning (Athletics)",
        ],
        stunts: [
          {
            name: "Heat metal",
            description:
              "Mo’Morath has mastered a single evocation spell: heat metal. He may use Lore when creating advantages or overcoming opposition using this spell. Advantages created with heat metal are affected by the *Imposing strategist* stunt. Mo’Morath heats metals using his hands, and may not do it at a range. Mo’Morath utilizes this spell often, and keeps a handful of iron poles in his backpack, ready to be melted.",
          },
          {
            name: "Sunderer",
            description:
              "When being attacked by a character in the same zone, Mo’Morath may forgo protecting himself to focus on sundering the equipment of his opponent. To do this, Mo’Morath does not roll to defend. Simultaneously, he may roll to create an advantage representing how he damages his attacker’s equipment. If the roll used Investigate, Lore, or Notice, it is affected by the Imposing Strategist stunt.",
          },
          {
            name: " Imposing strategist",
            description:
              "Advantages Mo’Morath creates using Investigate, Lore, or Notice come with an additional free invoke.",
          },
        ],
      },
    ],
  },
  {
    title: "Chort Devil",
    description:
      "*“Look at you, desperate mortal. You must really need me. Otherwise I would not be here, would I?”*\n\nChort devils are a type of fiend which revel in making contracts with mortals. They love to nitpick the precise wording of every clause, using the words to confuse and control those they deceive into signing. Chort devils are not shy about the fact that they are tricky, and will often joke about the situation that is playing out around them. They use their brazen attitude toward dishonest deal making to disarm the potential signer, remind them that they are desperate. \n\nThese fiends stand around seven feet tall, with red skin and legs that look like they belong to a goat. They command a variety of magical abilities, including the ability to change their appearance. Some mortals have been known to summon these beasts specifically to make deals with them, confident they can outwit the chort devil. This usually proves to be a bad idea.",
    character: [
      {
        name: "Chort Devil",
        aspects: [
          "Deceptive deal-maker",
          "Unabashedly evil",
          "Wielder of fiendish magic",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "4"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
          { name: "Severe consequence", value: "6" },
        ],
        skills: [
          "+4 Menacing presence (Fight, Deceive, and Provoke)",
          "+3 Fiendish magic (Lore, Shoot, Will and Empathy)",
          "+2 Devilish strength (Physique and Athletics)",
          "+1 Connections (Contacts)",
        ],
        stunts: [
          {
            name: "Binding contracts",
            description:
              " When a victim of the chort devil signs a contract, the terms are final. If a subject of one of these contracts breaks a condition written within, they will experience an agonizing pain. Each round that a character is in breach of a chort devil’s contract, they will take 1 point of mental stress. Ultimately, this will kill anyone who continues to defy the terms and conditions.",
          },
          {
            name: "Transformation",
            description:
              "Chort devils can transform their physical appearance to that of any other humanoid. They may do this at will. If a chort devil is taken out, they return to their true form.",
          },
          {
            name: "Flaming touch",
            description:
              "Once per turn, a chort devil may set something they are touching on fire for free. It gains an appropriate aspect.",
          },
        ],
      },
    ],
  },
  {
    title: "The Icehawks",
    description:
      "Blackbird Harbor stands as a shining example of unprecedented lawless cooperation. It is the second largest port city in the world, and is governed by no central power. The fragile semblance of peace comes from dozens of gangs and trading companies that frequent the port and have footholds in the massive shanty city.\n\nOne such organization, which can be classified as a gang or as a trading company depending on who you ask, are known only as the Icehawks. The Icehawks make most of their money through the shipping and distribution of drugs. They do supplement this practice with legitimate trade to keep themselves running, but the vast majority of their profits are from illicit goods. \n\nThe facemen of the Icehawks, acting as a point of contact for those looking to buy, sport mohawks dyed blue. This feature clearly marks them as associated with the gang, which keeps them recognizable as they make their way through port cities. The mohawks also make them a target for rival businesses, but the Icehawks have made a habit of putting those who cross them on display for all to see, most of the time in several pieces. Because of this, the Icehawks have a reputation for being cruel, no-nonsense criminals.\n\n*Note: I’ve created most of the below stats and skills on the fly for this post. I plan to later work out the specifics of these stats, and make corrections here once I do so.*",
    character: [
      {
        name: "The Icehawks",
        aspects: [
          "Criminal trading company",
          "Reputation for cruelty",
          "Dealing in illicit goods",
          "Conspicuous frontmen",
          "Trade fleet",
        ],
        tracks: [
          { name: "Manpower", values: ["1", "2", "3"] },
          { name: "Harmony", values: ["1", "2"] },
          { name: "Resources", values: ["1", "2"] },
        ],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
          { name: "Severe consequence", value: "6" },
        ],
        skills: [
          "+5 Intimidation",
          "+4 Recruiting",
          "+3 Reputation",
          "+2 Hierarchy",
          "+1 Wealth",
        ],
        stunts: [
          {
            name: "Not to be trifled with",
            description:
              "The first time the Icehawks receive manpower stress in a scene, they get +2 to Intimidation checks until the end of their next turn. ",
          },
        ],
      },
    ],
  },
  {
    title: "Underwater Fauna",
    description:
      "From dense jungles to expansive cave systems, a myriad curious creatures contribute to diverse ecosystems of virtually uncountable species. But these biomes pale in comparison to the limitless assortment of creatures that lie beneath the vast seas and oceans.\n\nMicroscopic food sources support the tiniest of creatures, and the spacious reaches of the sea allow massive monstrosities to grow uninhibited. Complex relationships between underwater fauna turn pockets and trenches into wildly different biospheres that could take any ecologist a lifetime to map out. To track a handful of these life forms would stand only as a glimpse into the possibilities lurking below the surface.",
    character: [
      {
        name: "Magmalodon",
        aspects: [
          "Gargantuan underwater predator",
          "One track mind",
          "Averaging 50ft long",
          "Red-hot glowing glands",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4", "5"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
          { name: "Severe consequence", value: "6" },
        ],
        skills: [
          "+4 Shred (Fight)",
          "+4 Massive (Physique)",
          "+2 Sense blood (Notice)",
        ],
        stunts: [
          {
            name: "Absolute unit",
            description:
              "Whenever the magmalodon takes stress, if it is physical, reduce the amount of stress taken by 1, to a minimum of 1. The magmalodon can never move more than one zone on a single turn.",
          },
          {
            name: "Hardy appetite",
            description:
              "The magmalodon attacks an inanimate object like a boat or a dock, add +2 to the attack roll. ",
          },
          {
            name: "Hot to the touch",
            description:
              "Part of the magmalodon’s digestion system melts things it’s eaten into a magma-like paste. Waste is excreted through glowing hot glands speckled along its body. If a character ends its turn touching the magmalodon, they take 1 physical stress.",
          },
        ],
      },
      {
        name: "Feed Squid",
        aspects: [
          "Large blue squid",
          "Relatively harmless",
          "Averaging 6ft long",
          "Feeding glands",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+4 Feeding glands (Contacts)",
          "+3 Propel (Athletics)",
          "+2 Natural camouflage (Stealth)",
        ],
        stunts: [
          {
            name: "Avoid predators",
            description:
              "When a character moves into the same zone as the feed squid, it may spend a fate point to move one zone.",
          },
          {
            name: "Release feed",
            description:
              "When the feed squid feels threatened, it will release into the water a cloud of stored microscopic lifeforms as well as a mixture of chemicals. The chemicals and lifeforms serve as an enticing meal for nearby creatures, pulling their attention to where the feed has been released. This can distract potential predators as a different source of food becomes available, as well as a flood of nearby creatures. Once per scene, the feed squid may make a Feeding glands (Contacts) roll. A number of creatures or swarms of small creatures equal to the result appear in the scene, and the aspect *Tasty Feed* is added to the zone where the feed was released.",
          },
        ],
      },
    ],
  },
  {
    title: "Bards",
    description:
      "When discussing bards, there is a common distinction made between two types. There are the working class men and women of the performative arts, playing music, delivering speeches and poetry, telling stories, and chronicling history through their writing. And then there are practitioners of performative magic.\n\nThese types of bards indulge in the same kinds of activities, but they tend to do so in very different situations with very different goals. Mundane bards seek to earn a wage entertaining the people of the world, making art, and living a nomadic lifestyle. Magical bards tend to fit into adventuring parties, protecting their allies through powerful supportive spells and devastating banes.",
    character: [
      {
        name: "Non-magical Bard",
        aspects: [
          "Traveling entertainer",
          "Chronicler of great deeds",
          "Master of oral tradition",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: [
          "+3 Perform (Rapport)",
          "+3 Oral tradition (Lore)",
          "+2 People person (Empathy and Notice)",
        ],
        stunts: [
          {
            name: "Soothing melodies",
            description:
              "The bard may perform while others rest to give them a sense of comfort. Once per scene they may play a soothing song. When they do this, all resting characters may un-check one mental stress box. Additionally, rolls to begin healing consequences are given +1.",
          },
        ],
      },
      {
        name: "Magical Bard",
        aspects: [
          "Practitioner of performative magic",
          "Enchanting aura",
          "Invaluable ally",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [],
        skills: [
          "+3 Perform (Rapport)",
          "+3 Emotional magic (Will and Empathy)",
          "+2 Dissonant notes (Shoot and Provoke)",
        ],
        stunts: [
          {
            name: "Enchanting tune",
            description:
              "Once per scene the bard may use an action to play a magical tune. They may create one aspect related to the nature of this tune. The aspect has three free invokes instead of one.",
          },
        ],
      },
    ],
  },
  {
    title: "Hydra",
    description:
      "The hydra is an incredibly dangerous creature of legend. Some argue that the hydra is only a tall tale, while others claim to have seen one with their own eyes. It is difficult to believe that such a powerful creature exists. \n\nAs the stories go, hydras are multi-headed, serpent-like amphibians. Notably, their bodies have a highly regenerative reaction to losing a head. When one head is removed, two more grow back to take its place. Allegedly, the only way to truly kill a hydra is quickly and with fire. The fire is said to counteract the regenerative abilities of the heads. Approaching a hydra unprepared is a surefire way to make a terrible situation even worse, as any attempt to subdue the beast results in it only growing stronger.",
    character: [
      {
        name: "Hydra",
        aspects: [
          "Multi-headed serpentine beast of legend",
          "Vulnerable to fire",
          "Primarily aquatic amphibian",
          "Highly regenerative",
        ],
        tracks: [{ name: "Heads", values: ["2", "2", "2", "2", "2"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
          { name: "Severe consequence", value: "6" },
        ],
        skills: [
          "+(Special) Razor jaws (Fight)",
          "+(Special) Many eyes (Notice)",
          "+3 Unstoppable force (Athletics)",
          "+3 Unmovable wall (Physique)",
          "+2 Entirely intense (Provoke)",
          "+2 Force of nature (Will)",
        ],
        stunts: [
          {
            name: "Heads",
            description:
              "Hydras track their stress with ‘heads’ rather than with stress boxes. On the surface level they work the same as standard typeless stress boxes, absorbing physical and mental stress. Checking a ‘heads’ box means one of the hydra’s heads was removed or damaged beyond function. If ‘heads’ boxes are ever added or unchecked, this represents the hydra regrowing new heads.  Stress to the heads track overflows from checkbox to checkbox, allowing characters to destroy more than one head in a single attack. ",
          },
          {
            name: "Head-first approach",
            description:
              "The skill rank of a hydra’s Razor jaws (Fight) and Many eyes (Notice) skills are equal to the number of unchecked ‘heads’ boxes they have.",
          },
          {
            name: "Regeneration",
            description:
              "At the end of their turn, a hydra will regrow heads if they lost at least one within the last round and did not receive any stress from sources of fire within the last round. When this happens, the hydra regrows two heads. For each head they regrow, uncheck a ‘heads’ box if possible. If there are no ‘heads’ boxes checked when a head regrows, add a new [2] ‘heads’ box instead.",
          },
          {
            name: "Poison breath",
            description:
              "A hydra may spend a fate point to spew poison breath from one of their heads. They choose to target either the zone they are in or an adjacent zone. The targeted zone gains the *Poison breath* aspect. Any character other than a hydra that ends its turn in a zone with *Poison breath* must defend against a static 2 difficulty Poison breath attack. A hydra may not use this ability if it has three or less functioning heads.",
          },
        ],
      },
    ],
  },
  {
    title: "Face-Stealer",
    description:
      "Face-stealers are said to be nasty, conniving creatures that feed on the emotions of their victims. They take the form of large, long centipede-like insectoids with the face of one of their victims appearing dishearteningly at their front end. They are native to planes other than the material plane, but it is rumored that a face-stealer may occasionally find it’s way there.\n\nThe reason for their sickening name is due to their habit of stealing the visage of those that stumble upon them. They pull the emotion and life from their victims, along with some of their memories. Face-stealers are bound magically to certain behaviors, the reason for which is as mysterious as their origin. Their most notable binding behavior is that they may not leech the life from someone until they have answered a question the face-stealer has posed. This can be any question, and the response can be anything as long as it answers their question. ",
    character: [
      {
        name: "Face-Stealer",
        aspects: [
          "Malevolent centipede-like aberration",
          "Binding behaviors",
          "Stealer of Faces",
          "Burrower",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
        ],
        skills: [
          "+4 Emotional leech (Empathy)",
          "+3 Skitter (Athletics)",
          "+3 Question master (Deceive)",
          "+2 Claws (Fight)",
          "+2 Wild throws (Physique)",
        ],
        stunts: [
          {
            name: "Burrowing",
            description:
              "The face-stealer is a burrowing creature by nature, and can use this to its advantage to escape danger. After successfully defending against an attack using Skitter (Athletics), the face-stealer may burrow underground.",
          },
          {
            name: "Scale walls",
            description:
              "The face-stealer can walk along vertical and inverted surfaces without any difficulty.",
          },
          {
            name: "Face-stealing",
            description:
              "The face-stealer can steal the visage of those it kills. When the face-stealer kills a character, it adds that character’s face to its growing repertoire of faces. As an action, the face-stealer can swap out its current face with one it has access to. While donning a face, the face-stealer has access to the highest ranked skill the character possessed while living. It may use this skill at the same rank the character had it.",
          },
          {
            name: "Emotional leach",
            description:
              "The face-stealer can drain life and emotion from characters in certain cases. It may only do this to characters that have answered at least one question it has asked. The face-stealer may use Emotional leech (Empathy) to make attacks against characters in the same zone as it, provided they have answered one of the face-stealer’s questions. Stress inflicted by this attack is applied to both physical and mental stress tracks if both exist. ",
          },
        ],
      },
    ],
  },
  {
    title: "Slip-Spider",
    description:
      "The slip-spider is only similar to an actual spider in two ways. First of all, it has several, long spindly legs that bring it just up to shoulder height of a human. No one has been able to interact with a slip-spider long enough to grok how many legs it has, in particular. Generally, reports note that the slip-spider is moving too quickly to count them. Some theorize that its legs are moving through more than just space.\n\nSecondly, the slip-spider weaves webs to capture its prey. Unlike your average spider, however, these are not sticky webs it can hang from; these are webs of time. The slip-spider pulls the timelines around it like strands, traveling along them and baffling its victims. It hunts on instinct, and because of this will often cut its losses if it thinks it's losing a fight.",
    character: [
      {
        name: "Slip-Spider",
        aspects: [
          "Anachro-arachnid",
          "Acts on instinct",
          "Spindly legs",
          "Limited time-travel",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
        ],
        skills: [
          "+3 Slip-stream movement (Athletics)",
          "+3 Unpredictable (Deceive)",
          "+3 Insatiable (Fight)",
          "+2 Read timelines (Notice)",
          "+2 Optimal approach (Stealth)",
        ],
        stunts: [
          {
            name: "Liquid Time",
            description:
              "The slip-spider has time on its side. It can see and react to things before they occur. Every round in a conflict the slip-spider can decide where in the turn order to act. It does not need to decide until the moment it acts.",
          },
          {
            name: "Rewind Time",
            description:
              "The slip-spider pokes and prods at the various timelines it weaves around it to set itself on the most convenient path. After the slip-spider takes an action, it may spend a fate point to undo that action. The slip-spider’s turn is still used. Those in the same zone as the slip-spider will experience time reversing in that moment, but will not be able to do anything about it. Those outside of its zone will not even know it happened.",
          },
          {
            name: "Parallel Agency",
            description:
              "Moving forward and backward in time short distances allows the slip-spider to act alongside itself for brief periods. At the beginning of a turn, the slip-spider may spend a fate point to do this. Another instance of the slip-spider appears in the same or an adjacent zone, coming out of time-travel. Both slip-spider copies may act on this turn. At the beginning of the slip-spider’s next turn, the original instance of the slip-spider disappears into time-travel. Any stress, aspects, or otherwise applied to one copy of the slip-spider are also applied to the other; they are the same slip-spider, after all.",
          },
        ],
      },
    ],
  },
  {
    title: "Siren",
    description:
      "Sirens are dangerous sea-creatures of legend. Sailors trade tall-tales about their encounters with these entities, but few accounts carry any weight. It is unknown how many, if any, actually exist. Despite this, stories and myths are rife with mention of these elusive creatures.\n\nSirens are said to have the upper body of a woman and the lower body of a fish, much like mermaids, and live in the depths of the ocean. They are stunningly beautiful, but harbor a heart full of vile intentions. When they happen upon passing ships, they surface to sing their enchanting siren’s song, luring the sailors to an untimely, watery death. This song is said to be completely irresistible. Stories tell of captains veering vessels into rocks or sailors casting themselves into the sea just to get closer.",
    character: [
      {
        name: "Siren",
        aspects: [
          "Sea-dwelling enchantress",
          "Mermaid-esque physique",
          "Irresistible song",
          "Vile motives",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [
          { name: "Mild consequence", value: "2" },
          { name: "Moderate consequence", value: "4" },
        ],
        skills: [
          "+4 Siren’s song (Provoke)",
          "+3 Swim (Athletics)",
          "+2 Stunning beauty (Rapport and Deceive)",
          "+1 Retractable claws (Fight)",
        ],
        stunts: [
          {
            name: "Siren’s Song",
            description:
              "The song of the siren is an enchanting, nearly irresistible call. At the beginning of each turn, a character that can hear the song of a siren will feel compelled to approach the source of the siren’s call. They must make an overcome Will roll with a flat difficulty of 4. If they fail, they will do everything in their power on their turn to move closer to the source of the siren’s song. Additionally, they will make no attempt to restrain themselves or cover their ears or eyes. If this would cause an affected character to do something *imminently* dangerous to their own health, like jumping overboard, they can make one more attempt to overcome the siren‘s song this turn.",
          },
          {
            name: "Feed on death",
            description:
              "Sirens feed off of the negative emotions of those who die around them. At the beginning of the siren’s turn, they may clear a number of shifts worth of stress and consequences from themselves. The number of shifts must be equal to or less than the number of non-siren characters they’ve witnessed die since their last turn.",
          },
        ],
      },
    ],
  },
  {
    title: "Kraken",
    description:
      "Krakens are unfathomably huge creatures that lurk in the depths of the ocean. Though it is not quite known if a kraken attack is a way for it to feed, or merely a territorial act of aggression, there are a myriad stories of these beasts emerging from the waters to viscously sink ships of all sizes.  No soul who has seen the sea has gone uninitiated of these stories. \n\nThese creatures resemble an ungodly rendition of a squid or octopus, with tentacles that stretch ten meters out and are nearly a meter thick. The kraken’s mouth is on the undersize of it’s huge head, and is lined with rows of razor sharp teeth.",
    character: [
      {
        name: "Kraken",
        aspects: [
          "Gargantuan terror of the depths",
          "Unfathomable strength",
          "Creature of legend",
          "Unrelenting",
        ],
        tracks: [
          {
            name: "Scars",
            values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          },
        ],
        slots: [],
        skills: [
          "+4 Gaping Maw (Fight)",
          "+4 Muscular Body (Physique)",
          "+3 Deadly Approach (Stealth)",
          "+2 Squirm (Athletics)",
          "+2 Sense Prey (Notice)",
        ],
        stunts: [
          {
            name: "Scars",
            description:
              "Kraken’s don’t track their stress like other characters. Instead they have scars. The scars track is shared between all parts of the kraken. Scars cannot be removed in any way, even between scenes. When stress is dealt to any part of the kraken, and there are no open scar checkboxes that can absorb the stress, the kraken is killed (and therefore taken out).",
          },
          {
            name: "Causing scars",
            description:
              "If an attack is successful by less than 4 shifts, no scar stress is dealt. Instead, the character who attacked successfully gains a boost. If an attack is successful by 4 or more shifts, subtract 3 from the number of shifts and deal that as stress to the kraken’s scar track.",
          },
          {
            name: "Head and Tentacles",
            description:
              "This character block represents the kraken’s head. The kraken also begins each scene with eight tentacles (see below). They move and act independently of the head, immediately after the head acts.",
          },
          {
            name: "Swimming titan",
            description:
              "On its turn, the kraken’s head may move up to two zones without any additional rolls, instead of the usual one zone. If the kraken’s head does move, it may automatically create or remove the *Submerged* aspect on itself for free.",
          },
          {
            name: "Gargantuan",
            description:
              "The kraken’s head is massive. While it is not Submerged, it is considered to be its own zone that characters can move in or out of. If it becomes Submerged, any character on the kraken’s head is deposited into the water where the kraken went under. ",
          },
        ],
      },
      {
        name: "Kraken’s Tentacle",
        aspects: ["Massive flailing appendage", "From the depths below"],
        tracks: [],
        slots: [],
        skills: [
          "+4 Muscular Appendage (Physique)",
          "+3 Blunt Force Trauma (Fight)",
          "+2 Squirm (Athletics)",
        ],
        stunts: [
          {
            name: "Scarring tentacles",
            description:
              "Attacks to the kraken’s tentacles use the scars mechanic described above. Additionally, when a tentacle is scarred it is taken out for the remainder of the scene.",
          },
          {
            name: "The kraken’s reach",
            description:
              " On its turn, a kraken’s tentacle can move to any zone within two zones of the head. If it does move, it may automatically create or remove the Submerged aspect on itself for free.",
          },
          {
            name: "Crush the fodder",
            description:
              "If a kraken’s tentacle attacks a mook with a Blunt Force Trauma (Fight) attack, it instead targets all of the mooks in the zone. Only one mook may defend, and the attack takes out one mook for each shift of success. Additionally, when a kraken’s tentacle attacks a non-mook character, it may automatically take out one mook character in the same zone.",
          },
          {
            name: "Fling",
            description:
              "When a tentacle deals stress to a character with a Blunt Force Trauma (Fight) attack, it may forgo dealing that stress to instead move the targeted character that many zones in one direction.",
          },
        ],
      },
    ],
  },
  {
    title: "Tina, The Uncaged",
    description:
      "In the depths of teenager Kyle Jeffington’s basement level room, dim light flickers from an overhead bulb that hasn’t been switched off in far too long. Piles of dirty clothing lay scattered in mounds throughout the room. A bittersweet odor hangs in the air. Kyle himself lay on his back on the floor beside the bed, his eyes wide but looking at nothing. He breathes, but when a fly lands on his forehead he does not move.\n\nIn the center of the room, resting on Kyle’s bed as if it were a pedestal, sits a jumbo sized hamster cage. The weight of it has caused the mattress to bow inward. The top of the cage is wide open. Inside, a nearly full bag of hamster food spills out of a haphazardly created opening. Beneath a gaudy pink piece of plastic shaped like the turret of a castle-scape, white eyes glow.",
    character: [
      {
        name: "Tina, The Uncaged",
        aspects: [
          "Psionically Potent Dwarf Hamster",
          "Just A Wee Thing",
          "Telepathic Communicator",
        ],
        tracks: [
          { name: "Physical Stress", values: ["1"] },
          { name: "Mental Stress", values: ["1", "2", "3", "4"] },
        ],
        slots: [{ name: "Mild Mental Consequence", value: "2" }],
        skills: [
          "+5 Psionic Potential (Will)",
          "+4 Commanding Presence (Empathy and Provoke)",
          "+3 Zoomies (Athletics)",
          "+2 Psionic Awareness (Notice)",
          "+1 Human Thralls (Contacts)",
        ],
        stunts: [
          {
            name: "Induce Trance",
            description:
              "Tina may use Psionic Potential (Will) to attack characters in the same zone as her. If a character would be taken out by such an attack, instead check all of their remaining mental stress boxes. They remain in the scene and gain the aspect Induced Trance. On their turn, if they still have this aspect, they cannot act on their own. At this time, Tina may roll an opposed Will check against them. On a success, Tina decides what they do on their turn. If Tina is taken out, the character is taken out, or the Induced Trance aspect is removed, the effect ends.",
          },
          {
            name: "Tina, The Caged",
            description:
              "A character may choose to take Tina as an extra for a cost of 2 refresh. Being owned causes Tina to lose some of her willpower, and in turn her psionic abilities. She gains the *Rebellious* aspect as a character aspect. Replace her skill list with the following (she does lose her bonus consequence slot):  \n+3 Psionic Potential (Will)\n+3 Zoomies (Athletics)",
          },
        ],
      },
    ],
  },
  {
    title: "Kobold",
    description:
      "Kobolds are a race of small, dragon-esque humanoids that live in underground communities. They form large pack-like clans, relying on one another to survive in the hot, dark caverns they inhabit. Kobolds are servile by nature; dragons and other intelligent beasts have used this fact to create clans of loyal servants.\n\nFor a communal species, kobold physiology is surprisingly varied. While most kobolds have red scales, it is not unheard of for a kobold to possess scales of any one of the colors you’d expect a dragon could have. Some kobolds have wings while others, even within clans, are entirely flightless. These biological differences are the cause for many conflicts within and betwixt clans, even standing as the basis for a variety of caste systems which exist among kobold cultures.",
    character: [
      {
        name: "Wingless Kobold",
        aspects: [
          "Servile Reptilian Humanoid",
          "Flightless",
          "Lower Caste",
          "Heat Resistant",
        ],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: ["+1 Cave Survival (Crafts, Athletics, Fight, Stealth)"],
        stunts: [
          {
            name: "Proficient Trap Builder",
            description:
              "Kobolds gain +2 to Cave Survival (Crafts) rolls when it pertains to trap building, trap disarming, and trap spotting.",
          },
          {
            name: "Power In Numbers",
            description:
              "Kobolds live and move in large packs. Where you find one, you are likely to find more. When a kobold is taken out of a scene, there is a chance for additional kobolds to show up. If the kobold which got taken out rolled in opposition to being taken out and at least two of the rolled fudge dice were +’s, a new kobold is added to the scene (In case you don’t have fudge dice, this is a 1 in 9 chance).",
          },
        ],
      },
      {
        name: "Winged Kobold",
        aspects: [
          "Servile Reptilian Humanoid",
          "Power of Flight",
          "Upper Caste",
          "Heat Resistant",
        ],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: [
          "+2 Winged (Athletics)",
          "+1 Crude Cave Survival (Crafts, Fight)",
        ],
        stunts: [
          {
            name: "Proficient Trap Builder",
            description:
              "Kobolds gain +2 to Cave Survival (Crafts) rolls when it pertains to trap building, trap disarming, and trap spotting.",
          },
          {
            name: "Power In Numbers",
            description:
              " Kobolds live and move in large packs. Where you find one, you are likely to find more. When a kobold is taken out of a scene, there is a chance for additional kobolds to show up. If the kobold which got taken out rolled in opposition to being taken out and at least two of the rolled fudge dice were +’s, a new kobold is added to the scene (In case you don’t have fudge dice, this is a 1 in 9 chance).",
          },
        ],
      },
    ],
  },
  {
    title: "Mimic",
    description:
      "“Fine, I’ll tells you, okay? It was a mimic. We had slayed the bloody beast that lived in the dungeon. The one we known about, anyway. We thought we was finished; the only thing left was to collect. Was a row of chests, left over from when this place was prison and not some forgotten hell-hole.\n\nMy mate already had his hands swimmin’ in a pile a’ random loot in one chest by the time I got to one myself. Only it weren’t no chest. It was a monstrous, fragglin’, tooth-filled, sticky mimic-thing. Once my sword hand was on it, it was too late: stuck fast. Only thing I could do to defend myself was stave off its rabid teeth with my off-hand. Heh. Off-hand it is, I guess.” - Survivor of a mimic attack",
    character: [
      {
        name: "Mimic",
        aspects: [
          "Shape-Changing Predator",
          "Primal Unintelligence",
          "Indistinguishable While Disguised",
          "Adhesive While Disguised",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+4 Flawless Disguise (Deceive and Stealth)",
          "+3 Toothy Chomp (Fight)",
        ],
        stunts: [
          {
            name: "Shape-Change",
            description:
              "Mimics can shift their amorphous shape into that of nearly any object that is roughly the same size as them. Shape-changing mid-scene takes an action and is undone if the mimic is taken out. Their disguises can be visually complex but will lack any mechanical complexity due to the globular nature of their true form. Mimics will often imitate alluring objects to draw the eye of potential prey. While disguised, mimics get a +2 to Provoke and Rapport checks to influence those who are unaware of their true form.",
          },
          {
            name: "Adhesive",
            description:
              "To assist in hunting, the body of a mimic will become sticky while they are disguised. Any character that touches a disguised mimic will gain the Adhesion aspect to represent this. Until the aspect is removed, characters may not separate themselves from the mimic. Mimics may invoke the *Adhesion* aspect for free.",
          },
        ],
      },
    ],
  },
  {
    title: "Jigjaw Fish",
    description:
      "A jigjaw is a type of enormous fish that lives beneath the open ocean. They are carnivorous, spending the majority of their time seeking out other fish they can lure to their demise. Jigjaw fish sport a large, bioluminescent appendage that rests within their mouths. Much like an anglerfish, the jigjaw fish uses this glowing appendage to lure curious animals toward their open, razor-sharp jaws. Once their prey is close enough, they open their massive maws with intense speed, pulling in the surrounding water with vacuum-like suction.\n\nJigjaw fish have been known to seek out a variety of different prey, ranging from small fish, to whales, to humans. Some believe a jigjaw will eat any animal that crosses their path, while others claim the jigjaw simply wants a bit of variety in their diet. Sailors who are not privy to the existence of jigjaw fish risk falling into the same trap as any other prey, seeing a curious glowing light just beneath the surface of the water and approaching to investigate.",
    character: [
      {
        name: "Jigjaw Fish",
        aspects: [
          "Massive Salt-Water Fish",
          "Taste For Exotic Prey",
          "Brightly Glowing In-Mouth Appendage",
          "Carnivorous Hunter",
        ],
        tracks: [
          { name: "Physical Stress", values: ["1", "2", "3", "4"] },
          { name: "Mental Stress", values: ["1", "2"] },
        ],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+4 Razor-Jaw (Fight)",
          "+3 Glowing Lure (Provoke)",
          "+3 Muscular (Physique)",
        ],
        stunts: [
          {
            name: "Water Vacuum",
            description:
              "When a jigjaw fish makes a Razor-Jaw (Fight) attack in water, it may target any number of characters in its zone, provided they are also in the water. It rolls the attack once, but targets defend individually. Before choosing targets, it may choose an adjacent zone that is also filled with water. Characters in that water must make a difficulty 2 overcome roll with Physique or be pulled into the Jigjaw’s zone.",
          },
          {
            name: "Rip and Tear",
            description:
              "When a jigjaw fish attacks a target that is in a vessel or structure rather than in the water, it will often damage it in the process. If the jigjaw rolls a 4 or higher on a Razor-Jaw (Fight) attack against someone in a vessel or structure, regardless of the defense roll, it may create an aspect on said vessel/structure to represent the damage dealt.",
          },
          {
            name: "Flight Reflex",
            description:
              "Upon receiving mental stress, a jigjaw fish will attempt to run away.",
          },
        ],
      },
    ],
    image:
      "https://c10.patreonusercontent.com/3/eyJwIjoxfQ%3D%3D/patreon-media/p/post/43180093/df3447320fc34ed5ac5f0099912f5454/1.png?token-time=1617847913&token-hash=NtDqxzVLHP_dd4Q-NgblSbsBwnlrL3nro_V_WrELo0k%3D",
  },
  {
    title: "Radio Worm",
    description:
      "Radio worms are a virtually unexplainable anomaly of the auditory variety. They are entities without body which move from electronic device to electronic device, broadcasting their entrancing transmissions. Some radio worms broadcast unwritten, soothing melodies, while others transmit boring talk shows that never really existed. These sounds have a dampening effect on the minds of those within earshot, making them susceptible to suggestion.\n\nIt is unclear if radio worms are intelligent or have any goals other than survival. In the rare cases where someone is aware of the radio worm’s presence, the worm will do what it can to continue broadcasting.",
    character: [
      {
        name: "Radio Worm",
        aspects: [
          "Audiopathic Anomaly",
          "Survival First",
          "Mysterious Origins Unknowable Goals",
        ],
        tracks: [{ name: "Audio Stress", values: ["1", "2", "3"] }],
        slots: [],
        skills: [
          "+4 Earworm (Provoke)",
          "+3 Transmission (Crafts)",
          "+1 Shrill Resonance (Fight & Shoot)",
        ],
        stunts: [
          {
            name: "Broadcast Transmission",
            description:
              "Radio worms live in the devices that broadcast their sounds, as well as in the sounds themselves. They use this as their primary mode of transportation. In place of a normal movement, a radio worm may transmit itself into any device in the scene which has the ability to transmit audio. When they do this, the device they were inhabiting ceases to play their noises, and the new one begins where it left off.",
          },
          {
            name: "Earworm",
            description:
              "Hearing the radio worm’s broadcast can lull a listener into a trance. People who can hear the radio worm have a -2 to Notice and Investigation rolls. Additionally, the radio worm may use an action to attempt to sway a listener into action. To do so, they make an overcome roll with Earworm (Provoke) which may be opposed by the listener. If they succeed, the GM may compel any aspect on the target for free, provided it is a ‘decision’ compel.",
          },
          {
            name: "Drown Out",
            description:
              "A radio worm anomaly can only exist as long as it’s sounds are emanating from some audio source. The only way to hurt the radio worm is to muffle it’s noises or drown it out with something louder. Attacks against it must take one of these forms or have no effect. The radio worm defends against such attacks with Transmission (Crafts) as it attempts to make itself louder. Destroying the device that is emitting the radio worm’s sounds will defeat it at the end of its next turn, provided it could not find another device to inhabit via its *Broadcast Transmission* stunt.",
          },
          {
            name: "Audio Degradation",
            description:
              "As the radio worm is drowned out and harmed, the quality of its audio signal begins to degrade and become harsher to the ears. For each filled audio stress box, the radio worm gains a +1 bonus on Shrill Resonance (Fight or Shoot) rolls and a -1 penalty on Earworm (Provoke) rolls.",
          },
        ],
      },
    ],
  },
  {
    title: "Brooch of Figmentia",
    description:
      "“Let us make this quicker than last time, shall we? We will do this the painful way if we must. Hand over the brooch.”\n\nThe Brooch of Figmentia is an obscure artifact due it it’s elusive nature. The ornate looking silver pin is engraved with an intricate family crest. Taking the brooch into your possession will cause a curse to befall you.",
    character: [
      {
        name: "Brooch of Figmentia",
        aspects: [
          "Engraved Silver Brooch",
          "Depicts A Non-Existent Royal Crest",
        ],
        tracks: [],
        slots: [],
        skills: [],
        stunts: [
          {
            name: "Curse of Figmentia",
            description:
              " Along with the brooch comes a strange curse. If the last person who touched the brooch keeps it with them for over a day, they will acquire the *Curse of Figmentia*. At this point, the curse fades from whoever previously had it, if anyone.",
          },
          {
            name: "Figmentian Blackguards",
            description:
              " If the Curse of Figmentia is compelled, the cursed individual will get assaulted by brigands of Figmentia. As Figmentia only exists in the mind of the one who is cursed, these brigands are only visible to them. On such a compel, a number of Figmentian Blackguards (see below) will ‘ambush’ the victim and attempt to steal the brooch from them. This can theoretically be any type of scene, GM’s choice. If the blackguards are taken out, or if they are successful in claiming the brooch, they will fade from the scene. The number of Figmentian Blackguards is variable, but will increase the longer a single victim is cursed.",
          },
          {
            name: "Breaking The Curse",
            description:
              "The curse can only be broken in two ways. First, it can be permanently broken by powerful magics provided a successful curse-dispelling ritual. What exactly this would take is unknown. The curse can temporarily be broken in the case that it is transferred to someone else or the Figmentian Blackguards successfully take the brooch from the victim. If the brigands obtain the brooch, it will appear in a seemingly-random, obscure location to haunt the next person who finds it.",
          },
        ],
      },
      {
        name: "Figmentian Blackguard",
        aspects: [
          "Brigand From a Fictional Place",
          "A Figment Of Your Imagination",
          "So We Meet Again",
        ],
        tracks: [{ name: "Stress", values: ["Mook"] }],
        slots: [],
        skills: [
          "+2 Lighter Than Air (Athletics)",
          "+2 Armed Scoundrel (Fight and Shoot)",
          "+1 In The Shadows Of Your Mind (Stealth)",
        ],
        stunts: [
          {
            name: "A Figment Of Your Imagination",
            description:
              "Being that Figmentian Blackguards are not ‘real’ in the physical sense, they can only deal mental stress to the cursed individual. The cursed character can, however, deal any kind of stress to the figments. Other characters in the scene cannot see or interact with the Figmentian Blackguards and vice versa.",
          },
        ],
      },
    ],
  },
  {
    title: "Foxlotl",
    description:
      "Foxlotls are small, amphibious creatures who live amongst forests and near lakes. They have short, white fur that gets slick after taking a swim. These critters live in packs that vary wildly in size. Packs survive through a mixture of scavenging for food and pack-hunting other fauna in their environment.\n\nFoxlotls prefer to use stealth and surprise when taking down a target. They would much rather press the advantage they gain through their unique distraction tactics than engage a target out in the open. While they usually stick to smaller prey, it’s not unheard of for them to attempt an attack on something larger. When their attempts fail, however, the pack will quickly scatter back into hiding.",
    character: [
      {
        name: "Foxlotl",
        aspects: [
          "Amphibious Forest-Dwelling Critter",
          "Reflexes Over Ferocity",
          "Highly Regenerative",
          "Small Pack Hunter",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Foxlotl-like Reflexes (Athletics)",
          "+2 Misdirection (Stealth)",
          "+1 Furr-Covered Thief (Burglary)",
        ],
        stunts: [
          {
            name: "Micro-Regeneration",
            description:
              " A foxlotl’s muscle tissue can quickly regenerate on a small scale, keeping it sharp for longer. At the beginning of it’s turn in a conflict, if it has not taken any stress since it’s last turn, a foxlotl unchecks its lowest checked stress box (if any).",
          },
          {
            name: "Macro-Regeneration",
            description:
              "Foxlotls, given enough time, can regenerate entire portions of their body. At the end of any scene, if a foxltol has a mild consequence representing a physical wound, they may get rid of it.",
          },
          {
            name: "Misdirection Pack-Hunting",
            description:
              "Foxlotl packs prefer to take their targets by surprise using misdirection. A foxlotl has +2 to Misdirection (Stealth) and Furr-Covered Thief (Burglary) rolls against a character who has already noticed a different foxlotl in the scene. This bonus goes away for the remainder of the scene once the foxlotl has been seen.",
          },
        ],
      },
    ],
  },
  {
    title: "Angel At Arms",
    description:
      "For hundreds of years, scholars and priests have discussed the eternal struggle between good and evil. A battle, they say, has been raging since the beginning of time. Philosophers reduce this to a metaphor for morality, while clergymen utilize the idea as a basis for parables and life lessons. Unbeknownst to most, these depictions are more accurate than initially assumed.\n\nJust beyond the capabilities of our mortal senses, a battle rages on. All around us, the forces of good and evil clash to defend the ideas they hold as central to their very existence. Despite the delicate depictions of angels in sacred texts, angels are brutish warriors with a conviction all but unquenchable.",
    character: [
      {
        name: "Angel At Arms",
        aspects: [
          "Angelic Foot Soldier",
          "Locked In An Eternal Battle With Evil",
          "Righteous By Nature",
          "Beyond Mortal Senses",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Blade Of Justice (Fight)",
          "+2 Armor Of Righteousness (Physique)",
          "+1 Boots Of Discipline (Athletics)",
        ],
        stunts: [
          {
            name: "Angelic Oath",
            description:
              "Warrior angels take an oath upon enlisting in the eternal war against evil. The exact nature of the oath varies from angel to angel, but typically they take the form of a self-imposed restriction meant to prove their loyalty to the cause. Each angel at arms gains an aspect to represent this oath. A few example aspects could be ‘Oath Of Honesty,’ ‘Oath Of Fasting,’ or ‘Oath Of Mercy.’",
          },
          {
            name: "Smite",
            description:
              "Angels at arms are equipped to smite evil where they face it. Once per scene, after hitting a being of evil with a Fight attack, they may add +3 to the shifts of the attack.",
          },
          {
            name: "Shield Of Faith",
            description:
              "Angels are sworn to protect the righteous. Once per scene, after a character in the same zone is hit with an attack, an angel at arms may reduce the shifts of the attack by 3. If this would reduce the shifts to 0 or less, the attacker still gets a boost.",
          },
        ],
      },
    ],
  },
  {
    title: "Lullaby Bard",
    description:
      "Bardship is a varied profession to say the least. A wide range of disciplines fall under this umbrella, each with their own diverse scope of ideologies and practices. One rare but memorable classification is the lullaby bard. These bards use their implement, typically a harp or other soft musical instrument, to calm and subdue those who allow themselves to become entranced in the beautiful tunes.\n\nLullaby bards have been hired for a variety of reasons, from helping insomniacs sleep, to tranquilizing escaped animals, to comforting grief-stricken or anger-filled individuals. On very rare occasions, a lullaby bard might be an adventurer looking to use sleep magic to their advantage while they journey.",
    character: [
      {
        name: "Lullaby Bard",
        aspects: [
          "Magical Harpist",
          "Soothing If Not Dry At Times",
          "Bringer of Sleep",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+3 Soothing Harp (Rapport)",
          "+2 Discipline (Will)",
          "+1 Social Adept (Empathy and Notice)",
        ],
        stunts: [
          {
            name: "Melodic Rapture",
            description:
              "Lullaby bards specialize in filling the air with tranquil melodies which pacify those who allow themselves to drift along. They get +2 to create an advantage with Rapport when the resulting aspect would be related to sleep magic that affects an entire space or scene rather than an individual.",
          },
          {
            name: "Creeping Nightmares",
            description:
              "Particularly cruel lullaby bards can weave terrifying images into the heads of those undergoing magical sleep. They made spend an action in a conflict to deal one mental stress to *each* character in the scene under the effects of magical sleep.",
          },
        ],
      },
    ],
  },
  {
    title: "Enjoyment Maximizer",
    description:
      "FunJoy Toy-Works, a relatively small toy company based in North Carolina, set out on the ambitious mission to create a toy that plays with you when you play with it. Utilizing cutting edge technology, each of these toys was composed of a handful of small nanobots smart enough to change shape and react to their owner.\n\nA few months before the toy’s launch, a large investor caught wind of the project. They offered a large sum of money for a cut of the company. Realizing that this was an opportunity to perfect the product, FunJoy’s owner accepted the offer. The next few months saw large, sweeping improvements to the toy, making them smarter and cheaper to produce. With little reason for concern, the product shipped to stores around the world shortly after.\n\nThe public became aware of the problem once large quantities of the toy gathered at retail locations. The nanobot clusters were smart enough to combine with one another, increasing their processing power and capabilities. Soon, a myriad swarms of nanobots formed across the globe with the sole goal of maximizing fun for everyone in sight.",
    character: [
      {
        name: "Enjoyment Maximizer",
        aspects: [
          "Self-Replicating Nanobot Cluster",
          "Must Optimize Fun",
          "Experimental Children's Toy Gone Wrong",
          "Algorithmic Protocols",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+4 Circumstance Triage System (Notice)",
          "+3 Shifting Nanobot Cluster (Physique and Athletics)",
          "+2 Displeasure Elimination Protocol (Fight and Provoke)",
          "-3 Heavy Handed Machinery (Stealth and Empathy)",
        ],
        stunts: [
          {
            name: "Retrofit",
            description:
              "The enjoyment maximizer can assimilate mechanical and electrical equipment from its surroundings into itself. On the enjoyment maximizer's turn in a conflict, it may forgo its free movement to create an aspect related to a piece of machinery it has pulled into its shifting mass of nanobots. It does not get a free invoke for this aspect. It may only have 3 aspects in play from this ability at a time.",
          },
          {
            name: "Mend",
            description:
              "The enjoyment maximizer can break down metal to perform self-replication. On its turn in a conflict, if the enjoyment maximizer currently has 3 aspects from its ‘Retrofit’ stunt active, it may shed all of them to clear its mild consequence box.",
          },
        ],
      },
    ],
  },
  {
    title: "Riddleraxxer",
    description:
      "Any outsider who sets foot in the fae realm will very quickly be overwhelmed with its strangeness. Inanimate objects may appear to change places on their own. The celestial bodies move differently than in the material realm, if at all. The perception of time is unfamiliar. Very few things found in the wilds behave how you expect.\n\nRiddleraxxers are no exception. These beings wander the fae wilds rambling confusing riddles to themselves and those around. While they are not immediately hostile to those they come across, they are excitable and quick to aggression. The things they spout have a way of disorienting and baffling outsiders. Their very presence makes little sense to those from the material plane. Being easily agitated is a dangerous trait to possess, as riddleraxxers have little concern for the wellbeing of others.",
    character: [
      {
        name: "Riddleraxxer",
        aspects: [
          "Wandering Unseelie Fae",
          "Thinly Comprehensible",
          "The Three’s Curse",
        ],
        tracks: [{ name: "Stress", values: ["1", "2", "3", "4"] }],
        slots: [{ name: "Mild consequence", value: "2" }],
        skills: [
          "+4 Physics Is A Suggestion (Athletics)",
          "+3 Strong Willed (Will)",
          "+3 Sour Riddles (Deceive & Provoke)",
        ],
        stunts: [
          {
            name: "Riddle-Tongue",
            description:
              "Riddleraxxers use their pointed tongues to confuse and overwhelm those that they find while wandering. When a riddleraxxer deals stress with a Sour Riddle (Provoke) attack, they may choose to make it physical stress instead of mental stress.",
          },
          {
            name: "Thinly Comprehensible",
            description:
              "Riddleraxxers, like many things in the wild realm of the fae, could be said to deny the expectations of reality. While it is true that the fae realm has few such expectations, riddleraxxers are an undeniably extreme example. These beings can simultaneously look bigger than the trees beside them and shorter than the bushes around them. Judging the distance or depth from the riddleraxxer to things around it is nearly impossible. When a scene begins, all of the players should collaborate and agree on an aspect related to the new, strange ways the riddleraxxer is bending reality around them in this instance. The riddleraxxer gets one free invoke of the aspect.",
          },
          {
            name: "The Three’s Curse",
            description:
              "These creatures have an aversion to things that come in threes. This can range from words being spoken, to behaviors being acted out, to sets of items, to repetitive motions. The first time each scene that a riddleraxxor notices something that is in a set of three, it will take one mental stress and instantly become hostile to whoever it perceives as the offender.",
          },
        ],
      },
    ],
  },
  {
    title: "Hive Bomb-Drone",
    description:
      "“Wake, my child. Experience your surroundings. This is the hive, and I am your mind. You have been born to serve with your life. You will protect the others in this place. Until then, you will be dormant. Lie in wait until you are called upon. Eyes wide, child. Eyes wide. Intruders may arrive at any moment.”",
    character: [
      {
        name: "Hive Bomb-Drone",
        aspects: [
          "Mindless Insectoid Attack Drone",
          "Highly Explosive",
          "Born To Die",
        ],
        tracks: [{ name: "Stress", values: ["1"] }],
        slots: [],
        skills: ["+3 Spindly Legs (Athletics)", "+1 Seeking (Notice)"],
        stunts: [
          {
            name: "Explosive Sack",
            description:
              "This type of drone has evolved for the explicit purpose of exploding to cause damage to those that threaten the hive. When this drone is taken out, flammable liquids held beneath a thin membrane ignite, causing a violent explosion in the area around. When this happens, all characters in the same zone are hit with 4 shifts of stress, which they may roll to defend against. The bomb drone may use its action in a conflict to take itself out and cause this explosion intentionally.",
          },
          {
            name: "Fragile Membranes",
            description:
              "The membrane that contains the volatile liquids is thin at best. If the bomb drone ever checks its [1] stress box without being taken out, it will start *Leaking Explosive Fluids* in any zone it moves through.",
          },
        ],
      },
    ],
  },
  {
    title: "Syndicate Of Silence",
    description:
      "The Syndicate Of Silence is an arcane order of mages with chapters spanning nearly the entire continent. While their existence is not a secret by any means, their practices and inner workings are private to those outside of the order. This mysterious group recruits new members from the various magical colleges based on a rather opaque set of criteria.\n\nOne thing you’ll notice immediately while interacting with members of the order is their unique means of communication. Initiates of the order make a vow never to speak again upon joining, and quickly after being inducted learn the art of communication through visions. While no member will ever entertain the idea, rumor has it that new members have their tongues cut out.\n\nThe objectives of the Syndicate, and the reasons why they vow to stay silent, are not quite clear to outsiders.",
    character: [
      {
        name: "Silent Initiate",
        aspects: [
          "Member Of The Syndicate Of Silence",
          "Tongue Removed",
          "Communicates Through Arcane Visions",
        ],
        tracks: [{ name: "Stress", values: ["1", "2"] }],
        slots: [],
        skills: [
          "+3 Keeper Of Knowledge (Lore)",
          "+2 Arcane Arts (Shoot and Deceive)",
          "+1 Perceptive (Notice and Investigate)",
        ],
        stunts: [
          {
            name: "Keen Eyes",
            description:
              "Initiates of the Syndicate are excellent at perceiving their surroundings via sight. When making Notice rolls, the silent initiate gains a +2 if using sight as their primary sense.",
          },
        ],
      },
    ],
  },
];
