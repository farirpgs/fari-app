# Deployment

## Fari

Fari is deployed to a preview Netlify site using Azure Devops with

```sh
yarn run deploy:preview --auth $(NETLIFY_AUTH_TOKEN) --message "$(Build.SourceBranch)"
```

and to a production Netlify with:

```sh
yarn run deploy:prod --auth $(NETLIFY_AUTH_TOKEN) --message "$(Build.SourceBranch)"
```

The NETLIFY_AUTH_TOKEN was created via the netlify UI

## Fari Peer Server
