# Changelog

<page-meta author="René-Pier Deshaies-Gélinas" description="Detailed technical changelog"></page-meta>

# v4.0 New Character Sheet Framework, Data Mangagement

- feat: new character sheet
  - feat: new character sheet Text Block
  - feat: new character sheet Numeric Block
  - feat: new character sheet Skill Block
  - feat: new character sheet Dice Pool Block
  - feat: new character sheet Point Counter Block
  - feat: new character sheet Slot Tracker Block
  - feat: add support for pages (add, move, remove)
  - feat: move sections (right, left, to page)
  - feat: move blocks (drag and drop)
  - feat: support for community driven templates
  - feat: print mode
- feat: new Data management page /data
  - feat: export all
  - feat: import all
  - feat: import all and duplicate
  - feat: filter by name, group, type
  - feat: sort
- feat: organize index cards with drag-and-drop
- feat: enhanced player row to always display dice result
- feat: Dice Pool route /dice-pool
- feat: let anyone sync characters to their machine
- feat: let GM add character sheets to players
- fix: can click skill of other other player's character sheets
- fix: add timeout when connecting to game + link to wiki about connection uissues
- fix: keep scene group when reset-ing them.
- feat: added Storybook to help with frontend development
- feat: draw area moved to a new tab
- fix: heartbreaker template listed twice
- fix: blog date
- fix: seelie squire edit link
- fix: seelie squire consequence
- fix: index card double modifier

**4.0.5**

- feat: The default character sheet template is now `Blank`
  - But now the character sheets displays the `Load Template` option directly inside the character sheet even if the advanced mode is turned off
- feat: Display the `Load Template` toggle in advanced mode even if the character sheet is loaded in a dialog (e.g. inside a game)
- feat/refac: Dice commands are now `sticky` which means that the latest roll that you have done, where ever it was rolled, is going to be saved so that you can re-roll it easily.
  - The latest roll commands are now displayed correctly when you open the dice menu (the little badge numbers displayed in the top right corner of each die icon)
- fix: Display the `has played` tooltip on index cards initiative tracker. Thanks @tjbearse for this fix.
  - https://github.com/fariapp/fari/pull/256#issuecomment-816675961
- fix: Changed the position of the floating dice box at the bottom right corner instead of bottom left to help Fari be more "Twitch friendly"
- fix: Disappearing Toggles when a Text block label is empty and the advanced mode is turned off. Thanks @sleighr for the bug report.
- fix: Non-draggable blocks if two sections have the same name. Thanks @sleighr for the bug report.
- fix: When rolling a character sheet skill has a GM, it was always the GM that was associated with the dice roll. Thanks @JFRobillard for the bug report.
- feat: Let the ability to both GMs and Players to either Assign the original version of a character sheet or assign e duplicate version.
- feat: better spanish translations by @1d12monos
  - https://github.com/fariapp/fari/pull/259#event-4594870648
- fix: empty label for dice pools should be hidden when advanced mode is turned off
- fix: toggles for text box always visible after JSON file import
- feat: enable customizing dice pools without toggling the advanced mode using Right Clicks!
- feat: give the ability to use Skills/Pools dice commands and add other dice commands using the dice menu.
- feat: new Player component UI
- fix: clicking on the roll button when the dice menu is closed rolls the latest rolled commands instead of the selected ones

**4.0.8**

fix: remove image tip from wiki
feat: new Star Wars Edge of The Empire template from @Gpoitras

**4.0.9**

- fix: edge of the empire character card @Gpoitras
- feat: edge of the empire french version + storybook @Gpoitras

# v3.7 Fari Wiki, Success With Style, Image Preview, Dice Menu

- feat: new Fari Wiki
- feat: new Sucess with Style blog
- feat: new image preview on content editable component
- feat: new Dice Menu
- feat: new Dice Floating Action Button in Scenes
- feat: new Dice Floating Action Button in Character Sheet
- feat: dynamic dice modifier on Index Cards
- feat: new Doc "quote" style used for page-meta description
- feat: Doc image alt text
- feat: Doc sidebarOption for renaming default category
- fix: highlight Doc "Misc" section if inside category
- refac: default Index Card Track label from `...` to `Track`
- fix: moving cursor when typing inside a content-editable component if content had an image

# v3.6 Document SideBar + Table of Contents and support for more dice

### Feb 10th, 2021

- feat: new doc sidebar
- feat: new doc table of content
- feat: support for more dice types (4df, 1df, coin toss, 1d100, 2d6)
- feat: prettier dice result tooltip
- feat: support for meta images in documents
- fix: uniq groups in data export manager
- fix: footer alignments

# v3.5 Resources, Private Aspects and Scene Notes

### January 19th, 2021

- feat: SRDs Document
- feat: Scene Checklist Document
- feat: Stunts Document
- feat: Cheatsheet Document
- feat: Public and Private index cards for scenes
- feat: Private GM notes for scenes
- feat: better SRD title and description for SEO
- feat: Index Card context menu for boost

**v3.5.2**

feat: better SRD title and description for SEO
feat: Index Card context menu for boost
feat: character cards in tabs
fix: Galcian typo #218
fix: security issue with immer

**v3.5.3**

feat: better Docs SEO
feat: Quick Conflicts and Fate Magic dials
feat: dynamic table of content for certain docs (like /dials)
feat: dynamic anchors for certain docs (like /fate-stunts)
fix: routing mechanism for SRD (using paths instead of hash)

**v3.5.4**

feat: new WIP wiki
feat: more flexible dynamic table of content for docs
feat: new doc mode to using `h2` as seperate pages (used for the fate-stunts doc)
feat: ⚠ BETA ⚠ data export and import manager

**v3.5.5**

fix: scroll issue in docs
fix: removed `showdown` markdown transformer in favor of `marked`

# v3.4 Join screen UX, Italian translations

### January 5th, 2021

- feat: new join screen
- feat: load character sheet in player row
- feat: change character sheet in player row
- feat: italian translations 👏 [#191](https://github.com/fariapp/fari/issues/191) @Redjaw

# v3.3 Group Scenes or Character Sheets, Roll with modifier and Russian Localizations

### Nov 10, 2020 - Dec 29 2020

- feat: Group Scenes or Character sheets by campaigns
- feat: Click on a skill to roll + skill modifier
- feat: More detailed dice roll
- feat: Re order any field in the character sheet
- feat: new "Notes" field in character sheet [#145](https://github.com/fariapp/fari/issues/145) 👏 [tgirod](https://github.com/tgirod)
- feat: Russian Localizations [#122](https://github.com/fariapp/fari/issues/122) 👏 [hattivatt](https://github.com/hattivatt)
- feat: Support screens up to 1920px wide [#144](https://github.com/fariapp/fari/issues/144)
- feat: Mini Character Sheets in scenes [#131](https://github.com/fariapp/fari/issues/131)
- fix: share draw area controls between fullscreen and normal mode [#147](https://github.com/fariapp/fari/issues/147)
- fix: character sheet synchronisation [#151](https://github.com/fariapp/fari/issues/151)

**3.3.6**

- chore: bump all dependencies
- fix: emotion package import
- feat: performance boost removing about page markdown (saves 1s on load time)
- feat: brand update
- fix: #160 encoding issues when transferring player names with emojis like 🐺
- fix: #163 map not updating for players
- fix: #119 more robust character sync

**3.3.7**

- fix: disable setAspectDrawArea to stop default isDirty on scene load
- fix: add try-catch on useDrawing setPointerCapture for unsupported browsers
- fix: only reposition index card if component is mounted

**3.3.8**

- feat: add Fate License in footer

**3.3.9**

- fix: block reload when playing a Scene [#178](https://github.com/fariapp/fari/issues/178)
- fix: sort button [#177](https://github.com/fariapp/fari/issues/177)
- feat: join a game using the Add or Import character buttons
- feat: scene name help text

**3.3.10**

- fix: sentry errors on magic grid container

**3.3.11**

- fix: default character name in player row

**3.3.12**

- fix: en translation

# v3.2.0 New Drawing Area, Brazian Portuguse translations

### Oct 20, 2020

- feat: A brand new Drawing Area with support for multiple shapes, colors and even player tokens. 👏 [ddkn](https://github.com/ddkn) for the help with the player token designs
- feat: Brazilian Portuguese translations. 👏 [pedrogsribeiro](https://github.com/pedrogsribeiro) for the translations
- feat: French translations for the About page. 👏 [corrinachow](https://github.com/corrinachow) for the translations
- fix: Various bug fixes and minor improvements
- tests: thanks you guys for the prerelease testing!
  - [handcraftedsource](https://github.com/handcraftedsource)
  - [player-03](https://github.com/player-03)
  - [ddkn](https://github.com/ddkn)

# v3.0.0 Scene Storage, More Flexible Index Cards, and Import/Export functionnalities!

### Aug 24, 2020

- feat: Scenes can now be prepared in advance, saved and then loaded directly during a play session.
- feat: Index Cards are now more flexible. You can now add, remove or rename tracks or consequences as you wish.
- feat: Scenes and Characters can now be exported from a device and imported on another one 👏 [nfregoso](https://github.com/nfregoso)
- feat: The game session screen is now more focused on the current game and removes unnecessary menus.
- feat: The game session join screen has an updated design.
- feat: Load scene templates during a game
- doc: More spanish translations 👏 [Erynus](https://github.com/Erynus).
- tests: thanks you guys for the prerelease testing!
  - [Erynus](https://github.com/Erynus)
  - [nottsknight](https://github.com/nottsknight)
  - [nfregoso](https://github.com/nfregoso)
  - [roypenrod-ohn](https://github.com/roypenrod-ohn)

# v2.3.8 - Blank Index Cards, Coutdown, Advanced Mode for Character Sheets

### Jul 6, 2020

- feat: it is now possible to add a "blank" index card
- feat: it is now possible to add a "Countdown" track to any index card
- feat: character sheets now have an "advanced" mode which gives you the ability to add,remove or rename pretty much everything

# v2.3 - Character Sheets, Zones and better Peer-to-Peer

### May 27, 2020

- feat: new [Characters](https://fari.app/characters) page to manage your characters sheets and save them in your browser's storage [#61](https://github.com/fariapp/fari/issues/61)
- feat: character sheets can be sent to a scene.
- feat: character sheets can be edited by it's player or the GM
- feat: GM can draw zones in a drawing pad when playing a scene [#58](https://github.com/fariapp/fari/issues/58)
- feat: performance and stability improvement over peer to peer communications by using a brand new _Fari Peer Server_ [#65](https://github.com/fariapp/fari/issues/65)
- fix: scene name placeholder [#59](https://github.com/fariapp/fari/issues/59)
- feat: spanish translations [#71](https://github.com/fariapp/fari/issues/71) 👏 [Erynus](https://github.com/Erynus)
- fix: [#76](https://github.com/fariapp/fari/issues/76)
- fix: player re-initialization when a new player joins a session
- fix: dice rolls gettings stuck during animation
- feat: sticky dark mode

# v2.2 - Player Controls, Confetti and Dark Theme

### May 19, 2020

- feat: players can control their own initiative
- feat: players can consume their own fate points
- feat: GM and players can click on a dice to roll it
- feat: the dice page supports clicking on the dice to roll it
- feat: confetti 🎉 on >= 3 or <= -3 rolls
- feat: confetti buttons in scene
- feat: index cards tooltip on stress track checkboxes
- feat: scene buttons re-arrangement and icons for each action
- feat: scene "add npc" button
- feat: scene "add bad guy" button
- feat: scene aspects sort button
- feat: aspect initiative tracker
- fix: reset scene button prompt
- feat: dark theme ⛅️
- fix: fairer dice [#57](https://github.com/fariapp/fari/pull/57) 👏 [@ConDar15](https://github.com/ConDar15)

# v2.1 - Index Cards Arrangement, Dice Animations and Internationalization

### May 15, 2020

- feat: grid System for Index Cards
- feat: dice Animations
- feat: prompt before leaving a scene
- feat: translation framework proof of concept
- doc: new CHANGELOG file
- doc: new LICENSE file
- fix: nbsp and tags in title of the page

# v2.0 - Revamped Scene Management

### May 8, 2020

- feat: real-Time Modifications (The GM controls the scene, players see modifications in real-time)
- feat: index Cards (Aspects, Boost, Colorization, Invokes and Stress & Consequences for bad guys)
- feat: dice Rolling (For GM and Players)
- feat: initiative Tracking
- feat: fate Points Management

https://www.reddit.com/r/FATErpg/comments/gg00pr/announcing_fari_20_the_best_fate_rpg_companion/

# v1.0 Initial POC

### Dec 15, 2019

- feat: initial proof of concept

https://www.reddit.com/r/FATErpg/comments/eb4xpk/fari_the_roleplaying_fate_game_companion/

```

```
