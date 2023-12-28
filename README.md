# TODO

# [Fari](https://fari.app) - The Free and Open-Source Virtual Tabletop

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-14-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![patreon](https://img.shields.io/static/v1?style=flat-square&logo=patreon&color=FF4D42&label=donate&message=Become%20a%20Patrons!)](https://www.patreon.com/bePatron?u=43408921)
[![ko-fi](https://img.shields.io/static/v1?style=flat-square&logo=ko-fi&color=3f51b5&label=donate&message=Support%20me%20on%20Ko-Fi)](https://ko-fi.com/B0B4AHLJ)

![Continous Integration](https://github.com/fariapp/fari/workflows/CI/badge.svg)
![Integration Tests](https://github.com/fariapp/fari/workflows/Integration%20Tests/badge.svg)

This repo contains the source code that powers Fari, the open source virtual tabletop platform.

## Feature Requests

You can request new features [here](https://fari.app/feature-requests/)

## Bug Report

If you found an issue with the app, you can report the bug [here](https://fari.app/bugs)

## Development

If you want to make a contribution to Fari, you will need to fork / clone this repo and follow the following steps to run the app locally.

### Prerequisites

1. Install Node `^16.2.0` (to match engine property in `package.json`) or use the [devcontainer](https://microsoft.github.io/code-with-engineering-playbook/developer-experience/devcontainers/) provided using [VS Code](https://code.visualstudio.com/).

### Installation

Fari relies on Node and the Node Package Manager to download its dependencies and run.

If you are using the proper node and npm version, you then need to install Fari's dependencies

```sh
npm install
```

Once the dependencies are installed, Fari will also build some of it's static content (e.g. the content of the SRD) using [11ty](https://www.11ty.dev/) which will convert the markdown files to HTML files insides a `_site` directory.

### Running the application

<!--  -->

If you want to run Fari on your machine, simply run:

```sh
npm run start
```

This will start and bundle the app using [ViteJS](https://vitejs.dev/) and make it available on http://localhost:1234

ViteJS will also update your browser's content (using React Refresh) anytime you do save a file on the disk.

This will run the normal server, but also rebuild the markdown files everytime you modify them.

## Special Thanks

<a href="https://www.netlify.com">
  <img width="100px" src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"  />
</a>
<a href="https://lokalise.com/">
  <img width="200px" style="margin-left:16px;" src="./images/services/lokalise.png"  />
</a>
<a href="https://liveblocks.io/">
  <img  height="100px" style="margin-left:16px;" src="https://gyazo.com/195675f9a76d92c013c6cd33330e6e6b.png"  />
</a>

- [Netlify](https://netlify.com/) for hosting Fari.
- [Lokalise](https://lokalise.com/) for providing internalization feature for Fari.
- [Canny](https://canny.io/) for providing user feedback features for Fari.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/RPDeshaies"><img src="https://avatars0.githubusercontent.com/u/6224111?v=4?s=100" width="100px;" alt=""/><br /><sub><b>rpdeshaies</b></sub></a><br /><a href="https://github.com/fariapp/fari/commits?author=RPDeshaies" title="Code">💻</a> <a href="https://github.com/fariapp/fari/commits?author=RPDeshaies" title="Documentation">📖</a> <a href="#translation-RPDeshaies" title="Translation">🌍</a> <a href="https://github.com/fariapp/fari/pulls?q=is%3Apr+reviewed-by%3ARPDeshaies" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/Redjaw"><img src="https://avatars1.githubusercontent.com/u/4438516?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Davide Vernassa</b></sub></a><br /><a href="#translation-Redjaw" title="Translation">🌍</a></td>
    <td align="center"><a href="http://corrinachow.com"><img src="https://avatars1.githubusercontent.com/u/35117708?v=4?s=100" width="100px;" alt=""/><br /><sub><b>corrina</b></sub></a><br /><a href="#translation-corrinachow" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/Erynus"><img src="https://avatars0.githubusercontent.com/u/65954558?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Erynus</b></sub></a><br /><a href="#translation-Erynus" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/hattivatt"><img src="https://avatars1.githubusercontent.com/u/58445227?v=4?s=100" width="100px;" alt=""/><br /><sub><b>hattivatt</b></sub></a><br /><a href="#translation-hattivatt" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/pedrogsribeiro"><img src="https://avatars1.githubusercontent.com/u/70762456?v=4?s=100" width="100px;" alt=""/><br /><sub><b>pedrogsribeiro</b></sub></a><br /><a href="#translation-pedrogsribeiro" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/nfregoso"><img src="https://avatars1.githubusercontent.com/u/2292312?v=4?s=100" width="100px;" alt=""/><br /><sub><b>nfregoso</b></sub></a><br /><a href="https://github.com/fariapp/fari/commits?author=nfregoso" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/ConDar15"><img src="https://avatars3.githubusercontent.com/u/5701626?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ConDar15</b></sub></a><br /><a href="https://github.com/fariapp/fari/commits?author=ConDar15" title="Code">💻</a></td>
    <td align="center"><a href="http://xurxodiz.eu/"><img src="https://avatars3.githubusercontent.com/u/391584?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jorge Diz Pico</b></sub></a><br /><a href="#translation-xurxodiz" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/tjbearse"><img src="https://avatars.githubusercontent.com/u/5686806?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Thomas Bearse</b></sub></a><br /><a href="https://github.com/fariapp/fari/commits?author=tjbearse" title="Code">💻</a></td>
    <td align="center"><a href="https://1d12monos.com/"><img src="https://avatars.githubusercontent.com/u/82345656?v=4?s=100" width="100px;" alt=""/><br /><sub><b>1d12monos</b></sub></a><br /><a href="#translation-1d12monos" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/chocoporto"><img src="https://avatars.githubusercontent.com/u/18116598?v=4?s=100" width="100px;" alt=""/><br /><sub><b>chocoporto</b></sub></a><br /><a href="#translation-chocoporto" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/Gpoitras"><img src="https://avatars.githubusercontent.com/u/59977641?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gpoitras</b></sub></a><br /><a href="https://github.com/fariapp/fari/commits?author=Gpoitras" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/christiefelker"><img src="https://avatars.githubusercontent.com/u/28272166?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Christie Kennedy</b></sub></a><br /><a href="https://github.com/fariapp/fari/commits?author=christiefelker" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
