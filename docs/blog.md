# Welcome

<page-meta description="Blog from the Fari Team"></page-meta>

> Have an idea and want to contribute to this blog ? Come chat with us on [Discord](https://discord.com/invite/vMAJFjUraA).

# Fari v5.0.0

<page-meta author="René-Pier Deshaies-Gélinas" date="2021-05-20" description="Better Index Cards and New Building Blocks" image="https://gyazo.com/9d6ea69d4a12009d07576baefef9955f.png"></page-meta>

## New Features 🌟

### Use Building Blocks Inside Index Cards

Fari's Index Cards just got a revamped!

After all the work that had been done on the character sheet in the previous release, we leveraged all of that power to be able to use building blocks inside index cards directly!

You can now build complex cards made of text, images, skills tracks and all of the other blocks that were previously only available inside character sheets.

![Blocks in Index Cards](https://gyazo.com/c4f376d229a08c0a97f8abb9c6badf80.gif)

### New Index Card Controls

While we worked on those features, we also took the time to add a couple of nice enhancements to the index cards. Things like the ability to collapse/expand them, add sub cards, use more color options new color picker, and more.

I'm personally already using the sub cards and new color options a ton in my games !

![Sub Cards](https://gyazo.com/9f3b60f27fb544d6cfc5d0765db0b65f.png)
![Color Picker](https://gyazo.com/3d04bd6d92a4529d86e92dc27e909b37.gif)

### New Building Blocks

3 new building blocks were also added to both the character sheets and index cards:

- An `Image Block`: use this to display nice photos or gifs!
- A `Separator Block`: pretty useful to make busy sections more organized.
- A `Link Block`: link to your external documents or wikis directly from inside a character sheet!

![Image Block](https://gyazo.com/b7380a776c232f73a85fd8b7df209ff3.gif)
![Separator Block](https://gyazo.com/ebce18a4bfb0479b02a98471e82eb230.png)
![Link Block](https://gyazo.com/09bb558199bde6e93e848f9fc36ac0e8.png)

### Curious about your storage ?

Fari now displays exactly how much space it uses on your browser!

We are able to display how much space is used in general or even drill down the character/scene level.

Just hop on the [Data Page](/data) and see for yourself!

![Storage](https://gyazo.com/2709c8cf86d8b95f2141fb35a4359449.png)

### Character Sheet Print Mode

The Character Sheet Print mode as been enhanced so you can export your sheet as nice PDFs.

Use this to print your sheets physically, or simply to share you amazing looking sheets to your friends!

![PDF Character Sheet](https://gyazo.com/5fe1178cc5cf8b615077cd75df439929.png)

### Fari in the Wild

Perhaps you are not sure where to start with Fari. It's quite a big application so I understand there might be a lot to learn.

Perhaps you would like to see someone use the app to learn a bit more about how to use it yourself ?

We've got your covered then. Checkout our new [Fari in the Wild](/fari-wiki/fari-in-the-wild) page where we include links to videos of people using Fari!

### Miscellaneous

This release also brings a couple of other enhancements, things like:

- New index card sort options
- New buttons to duplicate a page or a section in a character sheet
- New Deck of 52 cards dice command
- The ability to set a character sheet in "wide mode" and also use "two columns" per section
- German translation updates by TecnoSmurf :D
- Fari is also now 100% available in Esperanto! Thanks Sorcho :D
- and more...

## Thank You ❤️

I want to thank my patrons for helping to make this update possible.

If you also want to support Fari, go over Fari's [Patreon](https://www.patreon.com/fariapp) page.

There, you can support the development of the Fate RPG Companion App on a monthly basis for as low as the price of one ☕ or 🍪 per month!

If you have any questions or want to talk about Fari, come chat on [Discord](https://discord.com/invite/vMAJFjUraA) and if you encounter any issues with the release, don't hesitate to create a new [bug report](https://github.com/fariapp/fari/issues/new/choose).

# Fari v4.0.0

<page-meta author="René-Pier Deshaies-Gélinas" date="2021-04-06" description="New Character Sheet Framework, Data Management and Collaboration with Seelie Squire" image="https://gyazo.com/713e2fd2dd9c9a83c58e4fd00b8224ed.png"></page-meta>

This release has been in the making since November of 2020 so it's a big one.

It contains a lot of quality of life enhancement, but also tons of great new features I think you are going to love.

So lets get started.

## New Features 🌟

### New Character Sheet

Lets talk about the elephant in the room: **Character Sheets**!

When Fari was initially released in December 2019, managing character wasn't even something that you could do with the app.

Then, you all have been very vocal (in a good way) about the fact that managing characters should be part of the core experience of playing table-top RPGs online.

Since then, I released two different iteration of the character sheet framework and now is the time for a third take on this.

Third time's the charm!

#### Control

Fate is a very generic and hackable TTRPG. For that reason, character sheets should be generic and hackable as well.

This new framework gives you 100% control over:

- Splitting your sheet into multiple `Pages` and organizing them
- Adding `Sections` inside your pages and deciding where to place them
- Each section can then contain building `Blocks` that you can use to manage all the fields in your sheets

#### Building Blocks

You build your character sheets with blocks and Fari supports the following block types:

- `Text`: Save your aspects, consequences or other text based content.
- `Numeric`: Similar to the Text block, but made specifically to keep number information attached to a specific label.
- `Skill`: This block lets you add a modifier and a set of dice commands attached to a specific skill or action.
- `PointCounter`: Track your Fate Points, Health Points or any other count based field.
- `SlotTracker`: This is useful for stress tracks or anything that you would track with checkboxes.
- `DicePool`: Similar to the Skill block, this block lets you create dice pools with a set of dice commands to use during gameplay.

![New Character Sheet Framework](https://gyazo.com/9aeba8fad4079cec0e0ba3d0fda294e9.png)

#### Getting Started

If you want to get started, checkout our new [Managing Character | Fari Wiki](/fari-wiki/managing-characters) and learn how to get the most out of this new framework.

#### Templates

This new framework is powerful enough to support any Fate hack you can imagine, but it can also be used to play other Table Top RPG systems like Cortex Prime or simple one page RPGs like The Witch is Dead by Grant Howitt.

If you toggle the `Advanced Mode` inside a character sheet, you will have the ability to load one of the many new templates Fari supports.

From Dresdend Files Accelerated or Venture City to Heartbreaker by A.C. Luke, we've got you covered.

> Looking for a template but it's not available ?
>
> Are you interested in contributing to Fari ?
>
> **Create the template** yourself, **export it** and **send it** to us to make it available to the whole Fari community!

![New Templates](https://gyazo.com/34c71ce708382cc6be561041eb61c2ce.png)

### Manage Your Data

Fari doesn't _really_ have servers or databases so all your data is stored inside your browser's localstorage.

You own your data and you should be able to do what ever you want it.

For this reason, Fari now as a new [Data Management](https://fari.app/data) feature which lets you export and import in bulk all the data stored in this application.

You can use this feature to backup your data or use it to copy your data from one computer to another.

This can also be useful for game creators. Creators could use this feature to create pre-made scenes and characters to give with their game when they buy it on itch.io or drivethrurpg.

![Data Manager](https://gyazo.com/06d36544539d5eee2cbe220a3631858f.png)

### Seelie Squire's Book of Creatures

This release includes also a little surprise :)

If you hang out on /r/FateRPG, you might know about `Seelie Squire`. If you don't, you [should check this out](https://www.reddit.com/r/seeliesquire/).

He often publishes really cool things like Fate settings, stories or his great `Monster Monday` posts.

The work that Seelie has done is incredible, so we partnered up to put all of that great content available to everyone directly inside Fari.

This effort could not have been possible without the awesome work `Christie Kennedy` has done in developing a custom tool to convert all the content into a format that Fari could understand.

Thank you so much to both of you from myself and the entire Fate community!

[Read the book now](/seeliesquire)

![Book of Monsters by Seelie Squire](https://gyazo.com/ac5e3b017c69ced12a220c84ebe28843.png)

### Syncing Character Sheets

Since all the data Fari manages is stored in your browser. Which meant that your characters could not be accessed by the other players at your table when you are not playing.

I use the past tense here because times have changed.

This releases introduces a new feature which lets your **Sync** character sheets while you are playing.

During a game session, simply open a character sheet and click on the `Sync` button. This button is going to copy the character sheet inside your storage and sync it every time it is modified by anybody.

You can view this as if Fari was your assistant and made sure that every time someone modified their sheets, Fari will also modify your copy as well.

![Sync Character Sheets](https://gyazo.com/1b22f6da0aa42c97106a1735d820c54b.png)

### New Look

I also worked on a brand new landing page which I think is going to be useful for new users to explain better what Fari does, while also keeping the most useful features accessible to returning users.

![New Look](https://gyazo.com/c1ea6b639575a5027b0746b71f76e6af.png)

### Miscellaneous

This release also brings a couple of other enhancements, things like:

- the ability to reorganize your index card by simply dragging and dropping them wherever you like
- the ability for GMs to set a player's character sheet
- more space available during game sessions since the drawing area has been moved to a seperate tab.
- a brand new [Dice Pool](http://fari.app/dice-pool) roller
- a print mode for the character sheet
- the ability to duplicate scenes or character sheet
- and even more!

## Thank You ❤️

I want to thank my patrons for helping to make this update possible.

If you also want to support Fari, go over Fari's [Patreon](https://www.patreon.com/fariapp) page.

There, you can support the development of the Fate RPG Companion App on a monthly basis for as low as the price of one ☕ or 🍪 per month!

If you have any questions or want to talk about Fari, come chat on [Discord](https://discord.com/invite/vMAJFjUraA) and if you encounter any issues with the release, don't hesitate to create a new [bug report](https://github.com/fariapp/fari/issues/new/choose).

# Fari v3.7.0

<page-meta author="René-Pier Deshaies-Gélinas" date="2021-02-23" image="https://gyazo.com/3c74eda84cdedca471890460339b4fa0.png" description="Fari Wiki, Success With Style Blog, New Dice Options, and more..."></page-meta>

## New Features 🌟

### Content

Fari now has two brand new content sections:

- [Success With Style](/success-with-style): A searchable supply of ideas; these Fate pointers help you succeed with style!
- [The Fari Wiki](/fari-wiki): Everything you need to know to use Fari effectively.

So if you are looking for something new to read, I recommend you check out the new [Tips and Tricks for Fari](/fari-wiki/tips-and-tricks) article or this new **Fate Pointer** by Jeremy Price about [Problematic PC Aspects](/success-with-style/problematic-pc-aspects)

> If you are interested in contributing to either of these, come and talk to the team on [Discord](https://discord.com/invite/vMAJFjUraA) 👋

<!-- ![Fari Wiki](https://gyazo.com/51214d0224b7b1e2b858279b3db07f2a.png) -->

### Index Card Skill Modifiers

Fari Index Cards are pretty versatile, but can feel restrictive if you want to create a relatively complex NPC that is still not complex enough so that it would need its own character sheet.

So to try to help with that, I've added a new functionality to the index cards that let you add skill modifiers that can trigger dice rolls on the GM.

To use this feature, simply use following syntax `[Skill: Number]` inside an index card description and this will tell Fari that your Index Card has a skill that can be rolled. Pretty cool, no ?

![Index Card Roll Modifier](https://gyazo.com/04ddec1356bf3b25022341f40d6f3a25.gif)

### Image Preview Modal

For those who didn't know, Fari has this feature where you can copy an image on the web and add it inside index cards or character sheet fields.

While it is a nice feature, its current implementation wasn't ideal since big images would be scaled down which made them hard to look at.

For that reason, I added a new image preview functionality which opens a full-screen modal if you click on those images.

Here what it looks like 👇

![Image Preview Modal](https://gyazo.com/71931e7030cfaf23ef11916fd72290d6.gif)

### New Dice Options

I recently came across [The Witch is Dead](https://gshowitt.itch.io/the-witch-is-dead), a really cool one page RPG, and wanted to use Fari to play this game with some friends.

This game uses `d10s` which Fari didn't support at the time.

This made me think about making Fari more flexible for simple RPGs like this.

Fari now has a brand new dice menu and to be honest, I'm pretty proud of the end result 💪

Check it out [here](/dice) or look at the gif below for a quick preview 👇

![Dice Roller](https://gyazo.com/72c3eda69be9983538ef1ae7414073c4.gif)

## Thank You ❤️

I want to thank my patrons for helping to make this update possible.

If you also want to support Fari, go over Fari's [Patreon](https://www.patreon.com/fariapp) page.

There, you can support the development of the Fate RPG Companion App on a monthly basis for as low as the price of one ☕ or 🍪 per month!

If you have any questions or want to talk about Fari, come chat on [Discord](https://discord.com/invite/vMAJFjUraA) and if you encounter any issues with the release, don't hesitate to create a new [bug report](https://github.com/fariapp/fari/issues/new/choose).

# Fari v3.6.0

<page-meta author="René-Pier Deshaies-Gélinas" date="2021-02-10" image="https://gyazo.com/987c44f98577c6f8576ffb9a80c54fdf.png" description="Better document navigation and new dice options."></page-meta>

## New Features 🌟

### Documents

Fari uses a custom made `Document` feature to display the content of the [Fate SRDs](/srds/condensed), the [Cheat Sheet](/cheat-sheet), the [Stunts List](/fate-stunts), and even this blog post!

`Fari Documents` now have better navigation (on the left) as well as a dynamic table of contents (on the right).

This will help with navigating complex documents like the SRDs as well as other types of the documents the community might create in the future.

### More Dice Options

With this update, I added a brand new dice selector to give you the ability to pick a dice group from the following list:

- `4dF`
- `1dF`
- `Coin Toss`
- `1d100`
- `2d6`

This is currently available in [game sessions](/play) as well as on the [dice page](/dice)

<img width="200px" src="https://gyazo.com/f7266177f86471fb7f4a816b87265e38.png"/>

On top of that, I took a bit of time and made the dice result tooltip easier on the eye. I'm pretty happy with the end result and hope you are going to like it too.

<img width="400px" src="https://gyazo.com/987c44f98577c6f8576ffb9a80c54fdf.png"/>

## Thank You ❤️

I want to thank my patrons for helping to make this update possible.

If you also want to support Fari, go over Fari's [Patreon](https://www.patreon.com/fariapp) page.

There, you can support the development of the Fate RPG Companion App on a monthly basis for as low as the price of one ☕ per month!

If you have any questions or want to talk about Fari, come chat on [Discord](https://discord.com/invite/vMAJFjUraA) and if you encounter any issues with the release, don't hesitate to create a new [bug report](https://github.com/fariapp/fari/issues/new/choose).

# Moments in Fate

<page-meta author="René-Pier Deshaies-Gélinas" date="2021-02-05" image="https://images.unsplash.com/photo-1501618669935-18b6ecb13d6d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2064&q=80" description="A Powered by the Apocalypse inspired mechanic for the Fate role-playing game."></page-meta>

## Context

In Fate, characters can do anything, but in terms of rules and meta, there are only [4 actions](/srds/condensed/taking-action-rolling-the-dice/?goTo=actions) a character can do. They can **Attack** someone or something, **Defend** themselves or someone else's, **Create an Advantage** or **Overcome** an obstacle.

Lets compare this quickly to the [Powered By The Apocalypse](http://apocalypse-world.com/pbta/) System where the players have a set of **Moves**. Those moves are basically actions that a character can do and each **Move** has a game mechanic attached to it.

For example, in [Monster of the Week](https://www.evilhat.com/home/monster-of-the-week/) you have: `Kick Some Ass`, `Act Under Pressure`, `Help Out`, `Investigate a Mystery`, `Manipulate Someone`, `Protect Someone`, `Read a Bad Situation` and `Use Magic`.

In PBTA games, **Moves** vehicle something that Fate Actions have a hard time doing: they clearly layout multiple examples of how the rules can be bent to match what a player wants to do.

But **Moves** have a big downside to them. Since there is no general underlying mechanic for them, it is harder to know what to do when a player character does something that doesn't match any premade **Move**.

Fate Actions, on the contrary, shine in this situation since they are generic on purpose. That is in part because Fate's Golden Rule:

> _Decide what you’re trying to accomplish first, then consult the rules to help you do it._
>
> \- [Running the Game | Fate Core](/srds/core/running-the-game?goTo=the-golden-rule)

That being said, since Actions are so far on the other side of the game mechanic spectrum, they can be daunting to work with.

For example, they make it harder for new or _temporarily indecisive_ players to know what they can do during a session.

Also, because they are very broad and generic, you need to stretch the original definition of the words to make them match certain situations. (e.g. You can use the **Defend** action to oppose someone else's **Create An Advantage** action.)

While it's very useful to have generic terms that empower our characters to do basically anything, imposing restrictions or _initial_ guidelines can actually boost creativity.

Which is why I want to try to create a generic list of what I will refer to as **Moments**, or "Fate Moves" if you will, using the 4 Fate Actions as a base structure.

## Creating a Moment

To create a **Moment**, you can follow the following recipe.

| Quantity | Ingredients   |
| -------- | ------------- |
| 1 cup    | `Player Goal` |
| 1 tbsp   | `Action`      |
| 1 tsp    | `Skill`       |

For example, if a player wants to be on someone's tail in a space battle, you could create a moment called `Getting on Someone's Tail` that would look something like.

> #### Getting on Someone's Tail
>
> Use `Create an Advantage` <fate>C</fate> and `Drive` to be on someone's tail and gain the upper hand in a space battle.

While there is more than one way to bake a pie, this recipe will get you started so that you can create your own list of **Moments** that is best for your setting.

## Moments are not set in stone

Even if use **Moments** as a starting point for your Fate campaign, the GM and the Players should always be aware that this is _only a guide_ and if a player wants to do something that isn't on the list, nothing should be stopping them from going for it.

Fiction First!

As a GM, if one of your players is trying to do something that is not part of the your pre-made **Moments**, it is part of your job to **create a Moment on the spot** by matching a `Skill` with one of the 4 `Actions` and describing the possible outcomes.

## Getting Started

If you are looking for more concrete examples of how this can be applied, here's a list of **10 Moments** I think are relatively generic and outline the general idea behind all of this.

The following examples are based off the default Skill List which you can [read more about here](/srds/condensed/getting-started?goTo=skill-list).

Enjoy!

> ### Harm Someone
>
> Use `Attack` <fate>A</fate> and `Fight / Shoot / Provoke` to deal damage to another character.
>
> [Attack | Fate Condensed](/srds/condensed/taking-action-rolling-the-dice/?goTo=attack)

> ### Defend Yourself
>
> Use `Defend` <fate>D</fate> and `Athletics / Fight / Will` to protect yourself from immediate danger.
>
> [Defend | Fate Condensed](/srds/condensed/taking-action-rolling-the-dice/?goTo=defend)

> ### Brace Yourself
>
> Skip your turn and gain a `+2` to all your `Defend` <fate>D</fate> rolls until the end of the turn
>
> [Full Defense | Fate Condensed](/srds/condensed/optional-rules?goTo=full-defense)

> ### Protect Someone from Danger
>
> Use `Defend` <fate>D</fate> and `Athletics / Fight` to place yourself between immediate danger and someone in order to try to protect them.
>
> When doing this you expose yourself to possibly suffering the effects of any failed rolls.
>
> [Defend | Fate Condensed](/srds/condensed/taking-action-rolling-the-dice/?goTo=defend)
>
> [Exchange | Fate Condensed](/srds/core/challenges-contests-and-conflicts?goTo=the-exchange)

> ### Stop Someone
>
> Use `Defend` <fate>D</fate> to oppose someone from trying to `Create an Advantage` against you.
>
> [Defend | Fate Condensed](/srds/condensed/taking-action-rolling-the-dice/?goTo=defend)

> ### Act Under Pressure
>
> Use `Overcome` <fate>O</fate> to see if you can succeed the challenge.
>
> [Overcome | Fate Condensed](/srds/condensed/taking-action-rolling-the-dice/?goTo=overcome)

> ### Provide Support
>
> Figure out who has the highest level in the skill among the participants. Each other participant who has at least Average (+1) in that skill adds a +1 to the > highest person’s skill level. Supporters face the same costs and consequences as the person making the roll.
>
> [Teamwork | Fate Condensed](/srds/condensed/challenges-conflicts-and-contests?goTo=teamwork)

> ### Investigate a Situation
>
> Use `Create an Advantage` <fate>C</fate> and `Investigate` to try to find something to help move the story forward.
>
> [Create an Advantage | Fate Condensed](/srds/condensed/taking-action-rolling-the-dice/?goTo=create-an-advantage)

> ### Find Something Useful
>
> Use `Create an Advantage` <fate>C</fate> and `Notice` to try to find something you can use to your advantage.
>
> [Create an Advantage | Fate Condensed](/srds/condensed/taking-action-rolling-the-dice/?goTo=create-an-advantage)

> ### Manipulate Someone
>
> Use `Create an Advantage` <fate>C</fate> and `Deceive / Rapport` to convince someone to do what you tell them to do.
>
> [Create an Advantage | Fate Condensed](/srds/condensed/taking-action-rolling-the-dice/?goTo=create-an-advantage)

## Thanks

Thanks to Jeremy Price and Seelie Squire for letting me bounce ideas with them during my thought process. You are awesome.

---

> #### Quick Action Reference Sheet
>
> [The 4 Actions | Fate Condensed](/srds/condensed/taking-action-rolling-the-dice/?goTo=actions)
>
> ##### Overcome
>
> - **If you fail,** discuss with the GM (and the defending player, if any) whether it’s a failure or success at a major cost.
> - **If you tie,** it’s success at a minor cost—you’re in a tough spot, the enemy gets a boost, or you may take a hit. Alternatively, you fail but gain a boost.
> - **If you succeed,** you meet your goal and the story moves on without hiccups.
> - **If you succeed with style,** it’s a success and you also get a boost.
>
> ##### Create An Advantage
>
> Your outcomes when creating a new aspect are:
>
> - **If you fail,** you either don’t create the aspect (failure) or you create it but the enemy gets the free invoke (success at a cost). If you succeed at a cost, the final aspect may need to be rewritten to benefit the enemy. This may still be worth it because aspects are true.
> - **If you tie,** you don’t create an aspect, but you do get a boost.
> - **If you succeed,** you create a situation aspect with one free invoke on it.
> - **If you succeed with style,** you create a situation aspect with _two_ free invokes on it.
>
> With an existing known or unknown aspect the outcomes are:
>
> - **If you fail,** and the aspect was known, the enemy gets a free invoke. If it was unknown, they may choose to reveal it to get a free invoke.
> - **If you tie,** you gain a boost if the aspect was unknown; it stays unknown. If the aspect is known, you get a free invoke on it instead.
> - **If you succeed,** gain a free invoke on the aspect, revealing it if unknown.
> - **If you succeed with style,** gain two free invokes, revealing it if unknown.
>
> ##### Attack
>
> - **If you fail,** you fail to connect—the attack is parried, dodged, or maybe just absorbed by armor.
> - **If you tie,** maybe you barely connect, maybe you cause the defender to flinch. Either way, you get a boost.
> - **If you succeed,** you deal a hit equal to the difference between your attack’s total and the defense’s effort. The defender must absorb this hit with stress or consequences, or else be taken out.
> - **If you succeed with style,** you deal a hit just like a success, but you may reduce the shifts of the hit by one to get a boost.
>
> ##### Overcome
>
> - **If you fail** against an attack, you take a hit, which you must absorb with stress or consequences. Regardless, the enemy succeeds as described for their action.
> - **If you tie,** proceed according to the tie result for the opposed action.
> - **If you succeed,** you don’t take a hit or you deny the enemy’s action.
> - **If you succeed with style,** you don’t take a hit, you deny the enemy’s action, and you even get a boost as you gain the upper hand for a moment.
