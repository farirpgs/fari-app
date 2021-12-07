# Changelog

<page-meta author="René-Pier Deshaies-Gélinas" description="Detailed technical changelog"></page-meta>

# v6.0.0

- feat: new cloud infra for real time features
- feat: new drawing area
- feat: character sheet now support rows and columns
- feat: copy/paste blocks from character sheets

# v5.3

- feat: Dice Pool block enhancements
  - feat: better UX for to align with skill block
  - feat: can add "Toggle" to block
  - feat: can quickly add or remove dice if all the dice commands are the same
- feat: Charge RPG character sheet
- feat: New scene image on home page
- tech: update Vite
- tech: update to MUI 5
- fix: typo in Fate spanish sheets

**v5.3.3**

- feat: collapsible dice pool controls

**v5.3.1**

- fix: remove default property from character sheet template
- feat: Charge character template

**v5.3.2**

- fix: dice fab tooltip placement
- feat: binder analytics
- fix: character card dice pool roll + margins
- feat: Life Beyond Exo Station character template
- fix: storybook

# v5.2

- feat: new "Pause Button" safety tool when playing online games. Anyone can click on it, but only the GM can resume the game.
- feat: NPCs now show up in the scene's characters tab
- feat: GMs can now hide NPCs from players
- fix: When there is less than 10 index cards in a scene, they will flow from left to right. More than 10 index cards will trigger the masonry (pinterest) style layout
- feat: New "Card Collections" beta feature that lets you create your own "add index cards" buttons!
- feat: Adding a new Skill/Pool block uses the latest used dice commands as its default.
- feat: Players can update index cards.
- feat: can middle-click or command click to open binder items in new tab
- fix: analytics tracking using GA
- fix: duplicated binder latest items
- fix: stop duplicating pinned icons
- fix: make app faster with shorter useLazy delays
- feat: new scene UI
- tech: new Migrator utility class
- tech: Material-UI was updated from v4 to v5
- tech: Performance issue when using multiple tabs

# v5.1

- feat: A new binder view has replaced the previous scenes and characters drawer to offer new search and filtering features on Fari's data;
- feat: The scene screen user interface has been revamped to make it easier to use and understand;
- feat: The Dice box and the Player row components have been revamped to make them easier on the eye!;
- feat: It is now possible to move index cards inside others or to move them out of a parent card.
- feat: Fari now includes a [Story Builder Tool](/story-builder)
- feat: Fari now includes a [Story Dice Tool](/story-dice)
- deps: The different technologies, libraries and framework have been updated to make sure Fari stand the test of time;
- feat: It is now possible to export Characters/Scenes as template. This will export them without their `id`. This means that when they are imported, they will have a new `id` assigned to them and there will no longer be conflicts and people all having the same character sheet and overriding each other's changes all the time.
- feat: When starting a new scene, the new scene will have the same group as the previous one
- feat: Fari will remember the last name you used when you last joined a game.
- feat: The latest dice commands that you have rolled will now be saved and reused when you close and reopen the app
- feat: If you loose connection to a game and join again, Fari will try to remap you to the original player that was in the game so that you don't have to re-assign your character sheets.
- tech: Fari now only downloads the language you are using. This helps loading the app around 200ms faster than before.
- tech: Devs contributing to the repo now have to use npm 7 + node 16 to run Fari locally on their machine
- tech: Session and Scene information are now splitted on the tech side of things which will make it easier to maintain in the future.

**v5.1.1**

- feat: polish translations
- feat: polish Fate Core/Condensed/Accelerated templates
- feat: display game master characters in offline
- **v5.1.2**

- fix: only sort dice results when its a dice pool
- feat: slot tracker can now be displayed as clocks

# v5.0 Better Index Cards and New Block Types

- feat: pick any color for index cards
- feat: give ability to add sub cards to index cards
- feat: use building blocks inside index cards
- feat: collapse or expand index cards
- feat: new index cards sort options
- feat: sort private index cards
- feat: display character cards from left to right
- feat: display size (in KB or MB) of each character or scenes in the data manager
- feat: new Image building block
- feat: new Link building block
- feat: new Separator building block
- feat: display player id in player component
- feat: automatically save a character sheet when assigned by the GM
- feat: duplicate character sheet page
- feat: duplicate character sheet section
- feat: better print mode
- fix: disable image in content editable components
- fix: print mode temporarily disables dark mode
- feat: nice "Pick from deck of card" dice command
- feat: character sheet wide mode
- feat: character sheet block width
- fix: move section weird behaviors
- feat: adding a new index cards adds it to the top of the scene
- fix: index card drag and drop
- feat: esperato translations [#290](https://github.com/fariapp/fari/pull/290) @ejheil

**v5.0.1**

- feat: translation update
- fix: scene sub cards ids arent re-generated when a parent card is duplicated

**v5.0.2**

- feat: update the Fate of Cthulhu template to include the corruption track
- feat: fate condensed is now fully available in pt-br
- fix: index card colors in dark mode have been adjusted so that they are easier on the eye
- feat: the index card color picker now offers a set of 12 colors to help you organize your cards better
- fix: there is now a confirmation pop-up if you try to delete an index card

**v5.0.6**

- feat: new navigation
- feat: header canny changelog integration
- feat: characrer sheets don't close after save when playing online.
- feat: new character sheet templates
  - Fate Condensed in Spanish
  - Fate Core in Spanish
  - Tachyon Squadron Character
  - Tachyon Squadron Ship
  - Tachyon Squadron Character And Ship
  - Dresden Files RPG Character
  - Dresden Files RPG Spell Caster
  - Dresden Files RPG Vampire

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
- feat: better french translations @chocoporto

**4.0.10**

- feat: [lodash audit fix](https://github.com/fariapp/fari/pull/285)
- feat: [better german translations](https://github.com/fariapp/fari/pull/283) @TecnoSmurf
- feat: [better pr-br translations](https://github.com/fariapp/fari/pull/288) @Ruulul

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
