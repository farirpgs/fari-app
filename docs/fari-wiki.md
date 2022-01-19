# Introduction

<page-meta author="René-Pier Deshaies-Gélinas" description="Everything you need to know to use Fari effectively."></page-meta>

Fari might seem like a simple application at first, but there a lot of more advanced features that you can leverage to boost your Fate online sessions to the next level.

This Wiki will go over the basic feature as well as the more advanced use cases step by step to give you the ability to use Fari at its full potential.

> Have an idea and want to contribute to this wiki ? Come chat with us on [Discord](https://discord.com/invite/vMAJFjUraA).

# Playing

When playing in real life, you go to you friend's house, sit at their table and just get started immediately.

Playing your favorite TTRPG with Fari isn't more complicated than that, though there are still a couple of things you should know before getting started.

## Online VS Offline

To start a new game session, Fari offers you the following two options:

- Playing Online
- Playing Offline

### Online

When you click on the `Play Online` button on the home page, Fari will create a temporary space for you that we call a `Session` where you are the host and owner.

When a session is started, Fari gives you access to a `Session Link` that you can send to your friends so that they can join your `Session`.

![Copying a Game Link](https://gyazo.com/9e8faf0a0e3a1c25e5119bc1034f186d.png)

After you sent your players the session link, they can enter their name and join the game, and every modification that you do to the Session, Scene, or Character will be synced with all the players.

![Joining a Game](https://gyazo.com/c3c4a71bfc268c8739a016a07756f122.png)

> #### How does Fari sync my data with my players ?
>
> Fari relies on something called `peer to peer communication` using the `WebRTC` protocol.

### Offline

The Offline mode is useful if everyone is physically in the same room but the GM still wants to use Fari to manage their Scenes.

When playing in Offline mode, Fari won't connect to its server and won't generate the session link cited above.

This mode is also useful if for some reason, some of your players can't connect to your Online game session and you want to share your screen with them. See more about connection issues below.

> #### Issues When Joining a Game
>
> Some users might experience issues when trying to join an Online game session.
>
> If that is the case for you or one of your player, you should look into why this is happening here.
>
> [Connection Issues | Fari Wiki](/fari-wiki/connection-issues)

## Player: Choose your Character

When a player joins an Online game session, they don't have a character assigned to them yet.

Kind of like in real life, the player needs to pull their character sheet out of their bag and put it on the table.

To do that, a player simply has to click on the `Assign Character Sheet` button beside the player's name on the left of the screen.

![Assign A Character Sheet](https://gyazo.com/e3c035bb1997f71dc35bae11d0792363.gif)

You then have the ability to do three things:

- `Select` an existing character from the list.
- Create a `New` Character.
- `Import` a character based off a template your GM might have given you.

Once that is done, you are ready to play!

## GM: Assign a Character to a player

Sometimes, it's easier if the GM does the heavy lifting of preparing the game material.

For that reason, when a GM clicks on the `Assign Character Sheet` button, they will be prompted to either assign an existing character sheet or assign a duplicate of a character sheet.

This can be useful if the GM prepared character templates in advance for the players

![Assign Original VS Assign Duplicate Character Sheets](https://gyazo.com/be49f9201d04386f9734c17f4c099a18.png)

## GM: Managing Game Scenes

### New Scenes

When you start either an Online or Offline game, Fari creates a `New Empty Scene`.

From there, you can get started and start playing right away, but as you play, your players will move forward in the story and you will want to get a new scene going.

If so, you can create a `New Empty Scene` again by pressing the `New Scene` button.

![GM Controls](https://gyazo.com/32f320a4c24b5f341c8b13ce290bf768.png)

### Saving

During a game session, there is a very high probably that you will have to cancel the session early, but you probably don't want to lose your current scene and all the index cards you've added so far.

No worries, simply click the `Save Scene` button and Fari will save your scene so that you can load it in another game session.

### Loading Scenes

Whether you had to leave your last game session early or you've prepared scenes in advance for tonight's game, Fari lets you load scenes on the fly during your session so that you are always on top of your game.

Use the `...` menu on the right and either click `Load Scene` or `Clone And Load Scene`

![Loading a Scene](https://gyazo.com/5f093ab4cdf5783d1f61818d1120251f.png)

## Offline Access

Fari is kind of like a desktop application that runs in your browser.

It doesn't have any servers or databases to store your data. You are 100% in control of your data because it lives inside your browser's local storage on your computer.

But when you are playing an online game, Fari acts as a gateway so that you can see other people's data. Things like the current scene in play or players' character sheets.

So, Fari is like a **virtual table** that lets you share temporarily data with others. When you leave that table and close your browser's tab, you take with you your character sheet and put it in your **backpack**.

Because of that, it's not directly possible to see other people's data without sitting at the **table**.

But, Fari has a mechanism in place that lets you see data that doesn't belong to you using what we call the `Stored Toggle`.

When opening a character sheet inside an online game and clicking on the `Stored Toggle`, Fari will act has your personal assistant and keep an up to date copy of that character sheet in your **backpack** so that you can consult it later without sitting at the **table**.

> A word of caution, if modify a character sheet that you aren't the true owner of and join an online game later, Fari might override those changes if the owner also modified the sheet on their end.

![Stored Toggle](https://gyazo.com/ea063d783e6d026ee077d4d94e5f6c91.png)

> #### Load VS Clone and Load
>
> Everytime you create something in Fari, Fari creates a unique identifier and attaches it to what you created.
>
> When you `Load a Scene`, you are truly loading _this_ scene. Which means that if you click `Save` during your game session, you will modify the scene you loaded.
>
> When you `Clone and Load` a scene, Fari will clone that scene and assign it a new unique identifier. So modifications done during the game session will be done on the copy of the scene and not the original.
>
> This can be useful if for example you want to have a "Scene Template" that you want to use or something along those lines.

# Managing Scenes

This guide will cover how you can create and organize your Scenes inside Fari.

## What are Scenes used for ?

When you play tabletop RPGs in real life, each scene will probably consists of a bunch of index cards laid out all over a table.

Those cards will probably be of different colors, have text, numbers and checkboxes doodled all over them.

Fari Scenes are organized exactly like that. Each scene is a board which you can use to add index cards on!

![Scene Example](https://gyazo.com/fa2315a4dcbb0dd7bafdcf8bbb50b0af.png)

> ### What kind of content can I add on index cards ?
>
> To make index cards as versatile as possible, Fari leverages the building blocks framework used by the character sheets to let you add any type of content you want to index card.
>
> \> **Read more about the different building blocks you can use [here](/fari-wiki/managing-characters?goTo=blocks)**

## Public and Private Index Cards

Each scene support two types of index cards: `Public` and `Private`.

`Public` cards are things you want everyone at your table to see. While the `Private` cards are only going to be visible to the game master!

As the GM, you can use the private index cards to keep some aces up your sleeves or introduces some bad guys or interesting aspects during play.

### Moving a card from one section to another

When you create a private index card, it is possible to move it out of this section and into the public section.

The opposite is also totally possible.

If you want to do this, simply click on the `Mark Public/Private` button at the top right corner of the index card.

![Mark Public/Private](https://gyazo.com/d121694e8673e28e573e24ca4deee667.png)

## Notes

Each scene has also a basic note field that you can use if you want to save some information like scene recap or things like that.

![Scene Notes](https://gyazo.com/8578285231381b2f70750ba4c85cff0f.png)

## Index Cards Quick Templates

Like said previously, Index Cards are built using the character sheet building blocks.

To help you quickly add index cards during play, Fari as multiple pre mades templates for Fate, Blades in the Dark. You can also use the `Card Collection` feature to make your own templates to pull in during a gane.

![Quick Templates Buttons](https://gyazo.com/fa537106c33dd715830bb325c28a3eea.png)
![Quick Templates](https://gyazo.com/e03c3b97e16b425c2c5ea26cdcacd452.png)

## Sorting Index Cards

Scenes can become pretty messy over time. That why Fari offers 3 index card sorting functions

- `None`: Index Cards can be freely re-organized by the GM. Using this options lets the GM define how index cards are organized
- `Group First`: Index Cards can contain sub cards, this sorting function will keep those group cards at the top, followed by cards without sub cards
- `Pinned First`: Cards can also be `Pinned`. Using this sort function will keep the pinned cards first followed by unpinned cards.

![Sorting Index Cards](https://gyazo.com/d05d64413bba2dcc4c787998351366c8.png)

## Collapsing or Expanding Index Cards

Since scenes can become quite big and cluttered as you play, another useful features for organizing your index cards is the `Collapse/Expand` feature.

Using either the top level `Collapse All / Expand All` button or by clicking on the `Collapse/Expand` arrow on an index card, you can minimize the space index cards take by hiding all the content of the card except for the title.

![Collapse All / Expand All](https://gyazo.com/262f04773e08db223b9caa863a8fa177.png)
![Collapse / Expand Arrow](https://gyazo.com/a81824f73a959da4c72008de7cc64d0b.png)

## Index Card Content

Each index card contains by default two text field: a `Title` field and a `Content/Notes` field.

Both fields can be used to add content to help describe what that card is about.

The title field as a label attached to it that by default says `Index Card`.
The content field also as a label, but this one says `Notes` by default.

Both of those labels can be changed to your liking.

![Index Card Text Fields](https://gyazo.com/eee55be60c3175a4d317ebadbee8fa4f.png)

## Index Card Controls

The following section will go over the different controls that index cards have and what you can do with them

### Color Picker

By default, index cards have a white background. But the cool thing is that you can change this color to what ever you like by using the index card color picker.

If you use a light color, all the content and text of the card will be black. On the other hand, if your card is darker, all the content and the text will be white to make sure that it's always easy to see what is written on the cards.

This feature is super useful if you want to make a card stand-out from the lot!

![Change Index Card Color](https://gyazo.com/3d04bd6d92a4529d86e92dc27e909b37.gif)

### Initiative Tracker

Each index card has an initiative tracker which is represented by the little icon of a person waving!

You can use this to track if an npc has acted during the initiative or is still waiting for their turn

![Initiative Tracker](https://gyazo.com/02c983f637dc26c912e9e5617660a344.png)

### Pin

Fari also offers you the ability to pin index cards.

When an index card is pinned, it will elevate itself a bit from the board as to stand out from the rest of the cards.

You can also sort all the cards so that pinned cards show up first.

### Adding Sub Cards

As you can see, index cards are pretty flexible, but Fari as even more to offer.

Top level index cards have the ability can have sub cards associated with them!

You can use this feature to group cards together, or to describe zones with certain cards associated with them.

![Sub Cards](https://gyazo.com/810c375bb03944fe966868ec9753af9e.gif)

### Adding Building Blocks

Like mentioned earlier, it is possible to add the same kind of building blocks supported by Fari's Character Sheets, but inside index cards.

If you want to know more about what kind of blocks Fari supports, you can [read more about it here](/fari-wiki/managing-characters?goTo=blocks).

To add a new block to an index card, click on the Add Block button and select the type of block you want to add.

![Add Block](https://gyazo.com/675e2322017a629036688f5672804108.png)

Afterwards, sky is the limit. You can use this to add more detail or more dynamic fields to you cards. You could also use this to build relatively simple NPCs or add countdowns to your scenes.

![Index Card with Blocks](https://gyazo.com/459b64b8658cbdc3537c27226f8038c8.png)

#### Advanced Mode

Like with the character sheet, you can toggle the index card's `Advanced Mode` to show the blocks' advanced options

![Index Card Advanced Mode](https://gyazo.com/59caaea61dce0fe88661b9adc89f914b.gif)

### Duplicate, Reset, Delete

If you can to either duplicate, delete or reset an index card to their initial state, simply use of on the three action buttons at the bottom right corner of the card to do those operations

![Duplicate/Reset/Delete](https://gyazo.com/2004336c36c90942e6da2e569777b35e.png)

# Managing Characters

This goal of this guide is to help you understand everything you can do with Fari's Character Sheet framework.

Fari's character sheets are extremely flexible and basically limitless, so here how you can get the most out of it.

## Customizing your Character Sheets

When you create a new character, Fari will load the `Fate Condensed` template by default, if you want to customize your sheet yourself or load a different template, simply toggle the `Advanced Mode`.

![Toggle The Advanced Mode](https://gyazo.com/39c3eea686057a9e18168bb5725251e2.gif)

## Name & Group

You can give your character a `Name` and assign them a `Group`. Groups are a basic organization feature where characters with the same group will be _grouped_ together when you open the Character Drawer.

You can view the `Group` field as a "Campaign" field if you want.

## Pages

When the `Advanced Mode` is turned on, you can customize how your sheet is organized.

The Character Sheet is seperated into multiple `Pages/Tabs` where each page can have its own set of sections and building blocks.

### Adding a Page

To add a page, click on the `+` icon on the right and click on the Page name to rename it as you wish

![Addding a Page](https://gyazo.com/e180cb0f68661380ed9da33ef3285459.gif)

### Moving a Page

You can also move your pages left or right by using the Move Page arrows.

![Moving a Page](https://gyazo.com/0438808d699788ce5c1173861828940e.gif)

### Duplicating a Page

If you are building a template that as a lot of sections that are the same from one page to another, you can use the Duplicate Page button to help you in the creation of your character sheet.

![Duplicating a Page](https://gyazo.com/087bb807b9a537dd5f6e1c36f61ebe47.gif)

### Deleting a Page

Finally, if you want to remove a page, you can do so by simply clicking on the Remove Page button which is located between the Move Page arrows

![Deleting a Page](https://gyazo.com/04e055c9c1d943db85d65b63f1981b64.gif)

## Sections

Sections let you group your building blocks of a similar kind together.

### Adding a new Section

At the bottom of a each existing section, you can find a button labeled as `Add Section` which will let you add a section below the on you are looking at.

Once added, you can change its name simply by clicking on it and typing what you want.

![Adding a new Section](https://gyazo.com/95eb5246e35aec45063851d45c17f67b.gif)

### Making Sections Visible inside the Character Card

On the right side of your section's name, you will see an Eye button representing the `Visible on Card` action.

Clicking on it will make your entire section visible inside the Character Card.

The Character Card is kind of a condensed version of your character sheet that is going to be accessible to everyone during a game session.

You can use this functionality to make some sections of your characters sheets easily reachable during game play.

![The Character Card](https://gyazo.com/55e37b3a90e53315cee976d386ffb755.png)

### Moving a Section

Besides the Visible on Card button, there's the `Move Section` button. Clicking on this one will give you the ability to move your section up or down, on the other side of your sheet or on a completely different page.

![Moving a Section](https://gyazo.com/e07f911ede7dbfa3b7d20a52a3724d7e.gif)

### Duplicating a Section

Same as with pages, you can duplicate a section so that the creation of similar section is easier to do. Simple click on the `Duplicate Section` button when the advanced mode is enabled.

![Duplicating a Section](https://gyazo.com/05f2035d7d1757f993915645e51f3f2e.gif)

## Blocks

Blocks are at the core of Fari's character sheets. They are like Legos that you can use to create something incredible.

Fari currently supports 9 different types of blocks

- Text
- Numeric
- Skill
- Dice Pool
- Point Counter
- Slot Tracker
- Image
- Link
- Separator

![Different Types of Blocks](https://gyazo.com/ede9dec5d82ae085bdf04185db66a156.png)

### Adding a new Block

To add a new block, simply scroll at the bottom of a section and look for the `Add Block` button.

From there, choose the type of block you want to add and this block will be appended at the bottom of your section.

![Adding a Block](https://gyazo.com/af540b6c631f6028dccf704a45fb488a.gif)

#### Text Block

This block can be used to keep text based information. Things like notes or character aspects and things of the sort.

- `Add Toggle`: This control will append a toggle right beside your block's label. It can be useful to track when a power is used or if an aspect of your character is corrupted, etc.

![Text Block](https://gyazo.com/f3a229e8245c4b04db68b8f97ef27df0.png)

#### Numeric Block

Numeric blocks are useful if you are looking for something similar to a Text block, but made to handle numbers instead.

- `Add Toggle`: This control will append a toggle right beside your block's label.

![Numeric Block](https://gyazo.com/77eedbbf4768e0b42949bc9946a3e1eb.png)

#### Skill Block

If there is something inside your character sheet you think should trigger a dice roll, this is kind of block you are looking for.

Skill Blocks let you add a skill or ability to the sheet.

This skill then is linked to a set of dice commands as well as a dice result modifier.

Once configured, clicking on the dice button will enable the Dice floating action button at the bottom left corner on the screen.

Once enabled, clicking on the `Roll` label will let you roll that specific skill right away.

- `Add Toggle`: This control will append a toggle right beside your block's label.
- `Set Dice`: Clicking on this control will display the dice menu so that you can select the set of dice commands that skill should roll.
- `Hide Modifier`: Skills don't always have to have a modifier that should be added to the result. For that reason, this control will hide the modifier input to keep the character sheet tidy and clean.

![Skill Block](https://gyazo.com/e48b414263349f33c6cf67e7cd5b701b.png)

#### Dice Pool Block

Similar the the skill block, Dice Pools will let you create some sort of skill that is attached to a set of dice that should be added to a dice pool.

Once configured, when a players clicks on the pool button, all the dice commands inside that block will be added to the pool.
Clicking on it again will remove the dice commands from the pool.

When the pool is complete, the player simply needs to click on the `Roll Pool` floating action button at the bottom left corner of the screen.

- `Set Dice`: Clicking on this control will display the dice menu so that you can select the set of dice that the pool should contain

![Dice Pool Block](https://gyazo.com/48b3744e6a3011076ba308cf51b35b68.png)

#### Point Counter Block

This kind of block is useful if you are looking to track any sort of point based value. Use it to track your Fate Points, health points, gold pieces, etc.

- `Set as Main Counter`: This control lets you select a **single** point counter as the main one. The main point counter is going to be the one that is displayed in the Players section when you are playing a game session.
- `With Max`: Use this value if you want to have a max value attached to your point counter.

![Point Counter Block](https://gyazo.com/b520f5e1d36a3de7f11bcf401721accd.png)

![Main Counter](https://gyazo.com/0f69f3cbf6c3710d521824a2e1275626.png)

#### Slot Tracker Block

Slot trackers let you add a block where you can have a bunch of checkboxes that will help you track things. You can use that to track your stress in Fate or trauma in Blades in the Dark.

- `Add/Remove Box`: Those buttons will let you add or remove a box to your slot tracker.
- `Box Labels`: Slot tracker block contains boxes, each one of those boxes can be checked or unchecked. You can also customize the label attached to a box. When left empty, the label will simply be hidden when the advanced mode is turned off. You can use that to attach a specific meaning to each box.

![Slot Tracker Block](https://gyazo.com/45123ed0af8ae1772788b34278300c80.png)

#### Image Block

Image block lets you add a link to an image or gif hosted somewhere on the web so that it is easily available inside Fari

![Image Block](https://gyazo.com/cc5ccee2a2aeaf389cdc216e4a186388.gif)

#### Separator Block

The Separator Block is useful to split complex sections so that they are easier to look and things a better organized.

- `Add Label`: Use this option to add a label to the separator block.

![Separator Block](https://gyazo.com/57e2b7a87d282fd5fb3353a04cf5d0f2.png)

#### Link Block

If you have a wiki, or want to have references to external resources inside your character sheets; you can use the Link block to link to achieve this.

- `Show Display Name`: Use this option to add a display name to your link instead of displaying the link itself.

![Link Block](https://gyazo.com/c942e54dd69a1f9481a9821a435e5ea0.png)

### Generic Block Controls

Blocks are all based around the same idea, for that reason all types of blocks have a similar set of actions you can use to help you create a nice character sheet.

- `Move`: Using the drag icon, you can move your blocks _inside the section_ by simply dragging and dropping them where you you
- `Duplicate`: This action will let you duplicate and append right below a block of the type type with the same values
- `Remove`: This action will remove the block from the section
- `Help Text`: Each block can have some help text attached to it. It can useful when you want to provide some useful information to the user of the sheet about what a certain block is about or how its used in the game.
  - When left empty, the help text will disappear when the advanced mode is toggled off.

![Generic Block Controls](https://gyazo.com/45af086acdaf7542f343e361a1d078d0.png)

## Printing

You can create a PDF and/or print a character sheet using `Print` option.

![Print](https://gyazo.com/6b2579f967b21f16aca3d3d0e3af05f5.png)

If you do so, don't forget to enable "Background Graphics" in your browser's print setting so that the sheet keeps its colors!

![Print Setting](https://gyazo.com/b18e60ae9aa8d964f60a0a055d8f8cc0.png)

Here's an example from the community of what it could look like:

![PDF Character Sheet](https://gyazo.com/5fe1178cc5cf8b615077cd75df439929.png)

# Tips and Tricks

## Index Card Roll Modifiers

Not every NPC needs to be a full-on character sheet, but the benefit of using character sheets in Fari is that you can easily click on a skill to roll 4dF + a skill modifier.

Well, Fari supports doing that for index cards as well!

By using the following syntax `[skill: modifier]` inside an Index Card description, Fari will automatically add a link at the bottom of the index card so that you can easily roll `4dF` a skill modifier.

![Index Card Skill Modifier](https://gyazo.com/04ddec1356bf3b25022341f40d6f3a25.gif)

# Fari in the Wild

<iframe width="560" height="315" src="https://www.youtube.com/embed/C_rHMMuYoo8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Tutorials and Overview

- [Fari: The VTT For DMs Who LOVE Custom Sheets and Index Cards! by The Dungeon Newb's Guide](https://www.youtube.com/watch?v=C_rHMMuYoo8)
- [Fari App Virtual Table Top by Dragons Are Real Podcast](https://www.youtube.com/watch?v=BNL5xXDgA3w)

## Actual Plays

Here is a list of actual plays of people playing TTRPGs using Fari.

This is a nice way to learn how people _actually_ use Fari!

### By the Fate SRD

- [Weird West, Session 2, Learn to Play the Fate RPG (Jan 2021)](https://www.youtube.com/watch?v=Yhoe7tqkf6s)
- [Weird West: Eastbound, a Fate RPG Actual Play](https://www.youtube.com/watch?v=JHM5tU2-unY)
- [Guardians of the Firefly, a Sci-fi Crime Mockumentary Fate One Shot](https://www.youtube.com/watch?v=-tE7BtY5zBc)
- [The Bane of the British Museum Fate One Shot](https://www.youtube.com/watch?v=Q3treoCi_pQ)
- [SPACE SPIES, a Fate RPG One Shot](https://www.youtube.com/watch?v=WqzL0jqmGIM)
- [Weird West, Session 4 — Learn to Play Fate](https://www.youtube.com/watch?v=BZKi9UDNG_E)
- [The Frenchman and the American Soldier — A Book of Hanz Fate RPG One Shot](https://www.youtube.com/watch?v=-aRtBe2hT1g)
- [Enchanters vs Necromancers](https://www.youtube.com/watch?v=rvQVPeI1R0s)

### Other

- In Spanish
  - [El Rastro de Cthulhu - Stele Sophie](https://www.youtube.com/watch?v=wSNv2X06_lA)
- Shout outs
  - [Savage Interludes](https://savageinterludes.com/episode-103-keepin-it-real)

## Interview

The folks over at TableTalkRPG interviewed René-Pier, the creator of Fari. Check it out here below.

<iframe width="560" height="315" src="https://www.youtube.com/embed/UudBkVzGQzQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# Creating a Character Template for the Community

Looking for a template but it's not available ?

Are you interested in contributing to Fari ? Here is what you can do

1. [Create a template](https://fari.app/fari-wiki/managing-characters)
2. Export it from the `Characters` menu using the Share button
3. Send it to `RPDeshaies#4116` [on Discord](https://discord.com/invite/vMAJFjUraA)

And that's about it!

# Internationalization and localization

Fari is available in multiple languages like English, Spanish and French but if you are interested in translating Fari in another language or update a bad translation, this document is the right place to start.

Fari's supported languages are split into multiple files where each file contains a list of keys used by the app and their translated values.

## Lokalise

Fari uses [Lokalise](https://lokalise.com/) to help with localization.

If you are interested in contributing to Fari's in a significant way, contact [RPDeshaies on Discord](https://discord.com/invite/vMAJFjUraA) to see about becoming an official Fari Translator.

Otherwise, take a look at the other options for translating Fari programmatically.

## Adding a new language to Fari

To add a new language to Fari, you can download the [english translation file](https://github.com/fariapp/fari/blob/master/locales/en.json) and update the values of each key.

Once the file is translated, [open a feature request](https://github.com/fariapp/fari/issues/new/choose) and upload the new file in the issue.

A developer will then integrate the file into the application.

## Updating a translation value

It's possible that something in the app was badly translated, in that case, you can find the proper [language file](https://github.com/fariapp/fari/tree/master/locales/en.json) and open an issue to say which key needs to be updated and what should be the new value.

Also, try to include the reason why the original value was not good.

## About Page

The About page is not translated using the translations keys like the rest of the pages, it instead uses one markdown file per language which is saved in [this folder](https://github.com/fariapp/fari/tree/master/lib/routes/About/page).

If you want to translate the app, you should also provide a translated version of the About page in markdown format.

To do so, you can [download the English About page](https://raw.githubusercontent.com/fariapp/fari/master/lib/routes/About/page/About.en.md) and translate its content in the language of your choice.

# Connection issues

It is possible that, depending on your internet service provider configuration, you might not be able to use Fari's online functionalities.

The reason for this is because Fari relies on something called peer-to-peer connections using WebRTC.

To be able to establish the connection between the GM and the players, Fari uses a server to get the IP addresses of the GM and the players and once it has them, establishes a peer to peer connection between them.

But, it might be impossible for Fari to get the IP address of certain users.

## Reason

Taken from the documentation of PeerJS, the peer-to-peer library Fari uses:

> A small percentage of users are behind symmetric NATs. When two symmetric NAT users try to connect to each other, NAT traversal is impossible and no connection can be made. A workaround is to proxy through the connection through a TURN server. - https://peerjs.com/docs.html

While PeerJS offers a free TURN server for the community, Fari cannot use it because it's linked to their free PeerJS Server which is often down because too many people use it and it reaches its concurrent user limit.

This is the reason why Fari uses it's own PeerJS Server.

## Solution

There are multiple solutions that Fari could use to fix this issue but they all come at a price, literally.

We could spin our own TURN server. Compared to the normal peer-to-peer scenario where users transfer their data between each other without any middleman, TURN servers are responsible for transferring all the data from one user to the other, which makes them very expensive to run. (min 400$ per year)

We could also use a real-time database like Google Firebase, but this could also end up being expensive (~1$ per GB transferred per month with a minimum of 10GB, so more than 100$ per year)

All of that said, we also need to consider the developer time / maintenance cost of maintaining those infrastructures.

## Other options

If someone in the community thinks there are other alternatives, I'm all ears.

For now, what I can say is that if you discover that yourself or friends can't connect to one another, you should look into using Fari's Offline Mode (for the GM) and share your screen with the rest of your friends.

http://fari.app/play-offline

## One last thing

It really saddens me to not be able to do more for this, but because Fari is free, and I'm mostly working alone on this, the money and the time investment required to be able to make Fari's online functionalities more reliable for everyone is too big.
