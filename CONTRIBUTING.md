# Contributing to OpenRift Data

## Adding or correcting a card

1. Fork the repo and create a branch from `main`.
2. Edit `community.json`. Each card lives under `candidates` as `{ "card": {...}, "printings": [...] }`.
3. Validate locally: `bun install && bun run validate`.
4. Open a pull request. CI re-runs validation and uniqueness checks.

## Conventions

- **`external_id`** must start with `community:` and be unique across the file. Recommended: `community:<card-slug>` for cards, `community:<short-code>:<finish>:<lang>` for printings.
- **Image URLs** must be `https://`. Use stable hosting (your own, GitHub user-content, Imgur). Don't hotlink riftbound.leagueoflegends.com.
- **Languages** use lowercase ISO codes: `en`, `zh`, etc.
- **Fields you don't have data for** can be omitted; they default to `null` or `[]`.
- **One card per PR** keeps reviews fast. Bulk additions are fine if they're a coherent set (e.g. all cards from a new release), call that out in the PR description.

## Reporting cards instead of editing

If you don't want to edit JSON, open a [Card Missing](https://github.com/openriftapp/openrift-data/issues/new?template=card-missing.yml) or [Card Incorrect](https://github.com/openriftapp/openrift-data/issues/new?template=card-incorrect.yml) issue with the details and a maintainer will pick it up.

## Contributor License Agreement

By submitting a pull request, you agree to the terms of our [CLA](CLA.md).
