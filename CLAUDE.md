# La Basket 75 Shopify Theme

## Store

- Real Shopify domain: `1mryqy-em.myshopify.com`
- Do not use `labasket75.myshopify.com`; it is not the real `.myshopify.com` domain.
- If Shopify CLI returns `You are not authorized to use the CLI to develop in the provided store`, first verify that the command is using `1mryqy-em.myshopify.com`.

## Target Theme

We work on:

- Theme name: `labasket75_theme_custom_YWP`
- Theme ID: `197301862777`
- Role: live production theme

Useful verification command:

```bash
shopify theme list --store 1mryqy-em.myshopify.com
```

Expected theme entry:

```text
labasket75_theme_custom_YWP  [live]  #197301862777
```

## Auth Flow

If Shopify CLI is not authenticated, `shopify theme list --store 1mryqy-em.myshopify.com` prints a user verification code and an activation link.

The user must open the link and validate with their Shopify account. Do not try to complete that browser/account step automatically.

If a previously working session later fails with `401` or `not authorized`, run:

```bash
shopify auth logout
```

Then restart the auth flow with:

```bash
shopify theme list --store 1mryqy-em.myshopify.com
```

## Safety Rules

The theme `197301862777` is live. Never push directly to the live theme without preview validation.

Before any push, run:

```bash
shopify theme check --path .
```

For testing changes, create an unpublished preview theme:

```bash
shopify theme push --unpublished --store 1mryqy-em.myshopify.com -t "descriptive-preview-name"
```

After visual validation on the preview link, deploy only the specific changed file or files to live:

```bash
shopify theme push --store 1mryqy-em.myshopify.com --theme 197301862777 --allow-live --only <path/to/file.liquid>
```

Use `--only` to avoid overwriting unrelated files or Shopify editor changes.

Delete the preview theme when done:

```bash
shopify theme delete --store 1mryqy-em.myshopify.com --theme <preview-theme-id> -f
```

## Storefront Password

The storefront password may be needed for automated visits while the password page is active. It is stored locally at:

```text
~/Library/Preferences/shopify-cli-theme-store-password-nodejs/config.json
```
