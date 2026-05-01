# Contributing to OpenRift Data

## Adding or correcting a card

1. Fork the repo and create a branch from `main`.
2. **Adding a new card:** create `contributions/<card-slug>.json`. Use a lowercase, hyphenated slug (e.g. `ahri-alluring.json`).
3. **Correcting an existing card:** edit the existing `contributions/<card-slug>.json` directly.
4. Mirror the shape of `contributions/ahri-alluring.json`. Each file is `{ "card": {...}, "printings": [...] }`.
5. Validate locally: `bun install && bun run check` (runs schema + uniqueness checks).
6. Open a pull request. CI re-runs everything plus a build smoke test.

## Conventions

- **`external_id`** must start with `community:` and be unique across the whole repo. Recommended: `community:<card-slug>` for cards, `community:<short-code>:<finish>:<lang>` for printings.
- **Image URLs** must be `https://`. Use stable hosting (your own, GitHub user-content, Imgur). Don't hotlink riftbound.leagueoflegends.com.
- **Languages** use lowercase ISO codes: `en`, `zh`, etc.
- **Fields you don't have data for** can be omitted; they default to `null` or `[]`.
- **One card per PR** keeps reviews fast. Bulk additions are fine if they're a coherent set (e.g. all cards from a new release); call that out in the PR description.
- The top-level `$schema` field in each contribution file points to `../card.schema.json` so editors with JSON Schema support give you live autocomplete.

## Reporting cards instead of editing

If you don't want to edit JSON, open a [Card Missing](https://github.com/openriftapp/openrift-data/issues/new?template=card-missing.yml) or [Card Incorrect](https://github.com/openriftapp/openrift-data/issues/new?template=card-incorrect.yml) issue and a maintainer will pick it up.

## How releases work

`community.json` (the artifact uploaded to openrift.app) is **never committed**. On every tagged release, CI builds it from `contributions/*.json` and attaches it to the GitHub Release. To reproduce locally: `bun run build` writes `community.json` (gitignored).

## Contributor License Agreement

By submitting a pull request, you agree to the terms of our [CLA](CLA.md).
