# OpenRift Data

Community-contributed card data for [OpenRift](https://openrift.app), the open-source collection tracker for [Riftbound](https://riftbound.leagueoflegends.com/).

_Open source. Open data. Open everything._

> Cards added here flow into openrift.app via the existing candidate-review pipeline. Each release builds a `community.json` artifact, which a maintainer uploads to the admin panel. From there, contributions go through the same review flow as data from TCGplayer, Cardmarket, and CardTrader.

**[openrift.app](https://openrift.app)** · [Main repo](https://github.com/openriftapp/openrift) · [Discord](https://discord.gg/Qb6RcjXq6z)

## What's here

- `contributions/<card-slug>.json` — one file per card. The source of truth.
- `card.schema.json` — JSON Schema for each contribution file. Validated on every PR.
- `community.schema.json` — JSON Schema for the built release artifact.
- `scripts/build-community.mjs` — merges all `contributions/*.json` into a single `community.json`.
- `scripts/validate-contributions.mjs` — validates each contribution file against `card.schema.json`.
- `scripts/check-uniqueness.mjs` — asserts no two cards or printings share an `external_id`.
- `scripts/consolidate-contributions.mjs` — renames `contributions/<slug>--<date>.json` files to `<slug>.json` and strips the `--<date>` segment from `external_id` values. Runs automatically on push to `main` (see `.github/workflows/consolidate.yml`); the openrift.app contribute form submits dated files so its prefilled GitHub URL doesn't collide with existing paths, and this script reverts that workaround once the PR merges.

`community.json` itself is **not committed**. It's built on release and attached to the [GitHub Release](https://github.com/openriftapp/openrift-data/releases) as a download.

## How to contribute

The smoothest path is the [contribute form on openrift.app](https://openrift.app/contribute). It walks you through the fields, validates as you type, and opens a prefilled PR for you.

If you'd rather edit files directly:

1. Fork this repo.
2. Add a new file under `contributions/<card-slug>.json` (or edit an existing one if you're correcting a card).
3. Mirror the shape of the existing example (`contributions/ahri-alluring.json`).
4. Use `external_id: "community:<slug>"` for cards and `community:<short-code>:<finish>:<lang>` for printings (or any unique string starting with `community:`).
5. Image links must be `https://` and should point somewhere stable (your own hosting, GitHub user-content, Imgur). Don't hotlink the official Riftbound site.
6. Run `bun install && bun run check` to validate locally, then open a PR.

For details and edge cases see [CONTRIBUTING.md](CONTRIBUTING.md).

## How the data flows

```text
Contributor PR  ──►  CI validation  ──►  Maintainer review  ──►  Merge to main
                                                                      │
                                                                      ▼
                                                              Maintainer tags
                                                              a release (vX.Y.Z)
                                                                      │
                                                                      ▼
                                                       CI builds community.json
                                                       and attaches to the
                                                       GitHub Release
                                                                      │
                                                                      ▼
                                                       Maintainer downloads it,
                                                       uploads to openrift.app's
                                                       admin candidate page
                                                                      │
                                                                      ▼
                                                       Goes through the existing
                                                       candidate-review flow
                                                       alongside TCGplayer,
                                                       Cardmarket, CardTrader
```

The `community` provider in OpenRift is reuploaded in full on each release; it's never patched. The release artifact is always the complete current state.

## Legal

OpenRift is an unofficial fan project, not affiliated with or endorsed by Riot Games. Created under Riot's "Legal Jibber Jabber" policy using assets owned by Riot Games.

## License

[AGPL-3.0](LICENSE). See [CLA.md](CLA.md) for the contributor license agreement.
