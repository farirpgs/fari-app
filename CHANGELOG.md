# Changelog

## v3.4 Join screen UX, Italian translations

#### January 5th, 2021

- feat: new join screen
- feat: load character sheet in player row
- feat: change character sheet in player row
- feat: italian translations 👏 [#191](https://github.com/fariapp/fari/issues/191) @Redjaw

## v3.3 Group Scenes or Character Sheets, Roll with modifier and Russian Localizations

#### Nov 10, 2020 - Dec 29 2020

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

## v3.2.0 New Drawing Area, Brazian Portuguse translations

#### Oct 20, 2020

- feat: A brand new Drawing Area with support for multiple shapes, colors and even player tokens. 👏 [ddkn](https://github.com/ddkn) for the help with the player token designs
- feat: Brazilian Portuguese translations. 👏 [pedrogsribeiro](https://github.com/pedrogsribeiro) for the translations
- feat: French translations for the About page. 👏 [corrinachow](https://github.com/corrinachow) for the translations
- fix: Various bug fixes and minor improvements
- tests: thanks you guys for the prerelease testing!
  - [handcraftedsource](https://github.com/handcraftedsource)
  - [player-03](https://github.com/player-03)
  - [ddkn](https://github.com/ddkn)

## v3.0.0 Scene Storage, More Flexible Index Cards, and Import/Export functionnalities!

#### Aug 24, 2020

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

## v2.3.8 - Blank Index Cards, Coutdown, Advanced Mode for Character Sheets

#### Jul 6, 2020

- feat: it is now possible to add a "blank" index card
- feat: it is now possible to add a "Countdown" track to any index card
- feat: character sheets now have an "advanced" mode which gives you the ability to add,remove or rename pretty much everything

## v2.3 - Character Sheets, Zones and better Peer-to-Peer

#### May 27, 2020

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

## v2.2 - Player Controls, Confetti and Dark Theme

#### May 19, 2020

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

## v2.1 - Index Cards Arrangement, Dice Animations and Internationalization

#### May 15, 2020

- feat: grid System for Index Cards
- feat: dice Animations
- feat: prompt before leaving a scene
- feat: translation framework proof of concept
- doc: new CHANGELOG file
- doc: new LICENSE file
- fix: nbsp and tags in title of the page

## v2.0 - Revamped Scene Management

#### May 8, 2020

- feat: real-Time Modifications (The GM controls the scene, players see modifications in real-time)
- feat: index Cards (Aspects, Boost, Colorization, Invokes and Stress & Consequences for bad guys)
- feat: dice Rolling (For GM and Players)
- feat: initiative Tracking
- feat: fate Points Management

https://www.reddit.com/r/FATErpg/comments/gg00pr/announcing_fari_20_the_best_fate_rpg_companion/

## v1.0 Initial POC

#### Dec 15, 2019

- feat: initial proof of concept

https://www.reddit.com/r/FATErpg/comments/eb4xpk/fari_the_roleplaying_fate_game_companion/
