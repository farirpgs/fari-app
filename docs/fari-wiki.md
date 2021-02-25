# Introduction

<page-meta author="RPDeshaies" description="Everything you need to know to use Fari effectively."></page-meta>

Fari might seem like a simple application at first, but there a lot of more advanced features that you can leverage to boost your Fate online sessions to the next level.

This Wiki will go over the basic feature as well as the more advanced use cases step by step to give you the ability to use Fari at its full potential.

> Have an idea and want to contribute to this wiki ? Come chat with us on [Discord](https://discord.com/invite/vMAJFjUraA).

# Managing Scenes

🚧 👷 🚧

# Managing Characters

🚧 👷 🚧

# Playing Online

🚧 👷 🚧

# Tips and Tricks

🚧 👷 🚧

## Use Images

Fari supports adding images to Character Sheet and Index Card fields very easily.

Simply go on the internet, copy an image in your clipboard and paste it in a field inside the character sheet or an index card.

![Copy an image](https://gyazo.com/db1eede383593cfa829359358ec58c4f.png)
![Paste it in a field](https://gyazo.com/ce1a801bf9bf7362954d0a0a64571117.png)

## Index Card Roll Modifiers

Not every NPC needs to be a full-on character sheet, but the benefit of using character sheets in Fari is that you can easily click on a skill to roll 4dF + a skill modifier.

Well, Fari supports doing that for index cards as well!

By using the following syntax `[skill: modifier]` inside an Index Card description, Fari will automatically add a link at the bottom of the index card so that you can easily roll `4dF` a skill modifier.

![Index Card Skill Modifier](https://gyazo.com/04ddec1356bf3b25022341f40d6f3a25.gif)

# Internationalization and localization

Fari is available in multiple languages like English, Spanish and French but if you are interested in translating Fari in another language or update a bad translation, this document is the right place to start.

Fari's supported languages are split into multiple files where each file contains a list of keys used by the app and their translated values.

## Adding a new language to Fari

To add a new language to Fari, you can download the [english translation file](https://github.com/fariapp/fari/blob/master/lib/services/internationalization/locales/enTranslation.ts) and update the values of each key.

Once the file is translated, [open a feature request](https://github.com/fariapp/fari/issues/new/choose) and upload the new file in the issue.

A developer will then integrate the file into the application.

## Updating a translation value

It's possible that something in the app was badly translated, in that case, you can find the proper [language file](https://github.com/fariapp/fari/tree/master/lib/services/internationalization/locales) and open an issue to say which key needs to be updated and what should be the new value.

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
