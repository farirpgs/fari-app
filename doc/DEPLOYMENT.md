# Deployment

Netlify: https://app.netlify.com/sites/fari/overview
Azure Devops: https://dev.azure.com/fariapp/fari

## Fari

Fari is deployed to a preview Netlify site using Azure Devops with

```sh
yarn run deploy:preview --auth $(NETLIFY_AUTH_TOKEN) --message "$(Build.SourceBranch)"
```

and to a production Netlify with:

```sh
yarn run deploy:prod --auth $(NETLIFY_AUTH_TOKEN) --message "$(Build.SourceBranch)"
```
