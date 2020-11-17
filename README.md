<style>
  hr {
    margin-bottom: 16px;
  }

  .badges {
    display:flex;
    align-items:center;
    justify-content:center;
    margin-bottom: 16px
  }

  .badges > * {
    margin: 0 8px;
  }

  .donations {
    display:flex;
    align-items:center;
    justify-content:center;
    margin-bottom: 16px
  }

  .donations > * {
    margin: 0 8px;
    text-decoration: none !important;
    color:rgb(255, 255, 255) !important;
    padding: 4px 16px;
  }

  .patreon {
    background-color:rgb(255, 66, 77);
    border-radius:9999px;
    display:flex;
    align-items:center;
  }

  .patreon img {
    width:16px;
    margin-right:4px;
  }

  .kofi {
    background-color: #3f51b5;
    border-radius: 7px;
    display:flex;
    align-items:center;
  }

  .kofi img {
    width:22px ;
    height:15px;
    margin-right:4px;
  }

</style>

# [Fari](https://fari.app) - The best Fate RPG companion application

<div class="donations">
  <a class="patreon" href="https://www.patreon.com/bePatron?u=43408921" >
    <img src="./images/services/patreon.png" >
    Become a Patron!
  </a>
  <a  class="kofi" href="https://ko-fi.com/B0B4AHLJ">
    <img src="https://storage.ko-fi.com/cdn/cup-border.png" >
    Support me on Ko-Fi
  </a>
</div>

<hr />

<div class="badges">
  <img title="Continous Integration" src="https://github.com/fariapp/fari/workflows/CI/badge.svg">
  <img title="Integration Tests" src="https://github.com/fariapp/fari/workflows/Integration%20Tests/badge.svg">
</div>

This repo contains the source code that powers Fari.

If you are here because

1. you have encountered issue with Fari
2. you want to ask a question
3. you have a feature suggestion

you can fill an issue by [clicking here](https://github.com/fariapp/fari/issues/new/choose) and choosing the appriopriate type of issue.

Please take the time to add as much details to your issues as possible.

## Development

If you want to make a contribution to Fari, you will need to clone this repo and follow the following steps to run the app locally.

### Prerequisites

- Install Node `^12.16.3` (to match engine property in `package.json`)
- Install Yarn by running `npm install -g yarn`

### Installation

- Run `yarn install`

### Running the application

Run `yarn start` and then the app should be running on http://localhost:1234

## Special Thanks

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
</a>

[Netlify](https://netlify.com/) for providing hosting for Fari.
