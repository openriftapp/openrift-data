# OpenRift Data

Community-contributed card data for [OpenRift](https://openrift.app), the open-source collection tracker for [Riftbound](https://riftbound.leagueoflegends.com/).

_Open source. Open data. Open everything._

> Cards added here flow into openrift.app via the existing candidate-review pipeline. Maintainers tag a release, upload `community.json` to the admin panel, and the cards go through the same review flow as data from TCGplayer, Cardmarket, and CardTrader.

**[openrift.app](https://openrift.app)** · [Main repo](https://github.com/openriftapp/openrift) · [Discord](https://discord.gg/Qb6RcjXq6z)

## What's here

- `community.json` — the live community-contributed card catalog, in the same shape OpenRift's admin candidate uploader accepts.
- `community.schema.json` — JSON Schema for `community.json`. Validated on every PR.
- `scripts/check-uniqueness.mjs` — checks that no two cards or printings share an `external_id`.

## How to contribute

The smoothest path is the contribute form on openrift.app (coming soon). It walks you through the fields, validates as you type, and generates a PR for you.

If you'd rather edit the file directly:

1. Fork this repo.
2. Add your card to `community.json` under `candidates`. Mirror the shape of the existing example.
3. Use `external_id: "community:<slug>"` for cards and `community:<short-code>:<finish>:<lang>` for printings (or any unique string starting with `community:`).
4. Image links must be `https://` and should point somewhere stable (your own hosting, GitHub user-content, Imgur). Don't hotlink the official Riftbound site.
5. Open a PR. CI runs schema validation and uniqueness checks. A maintainer reviews and merges.

For details and edge cases see [CONTRIBUTING.md](CONTRIBUTING.md).

## How the data flows

```text
Contributor PR  ──►  CI validation  ──►  Maintainer review  ──►  Merge to main
                                                                      │
                                                                      ▼
                                                              Tagged release
                                                                      │
                                                                      ▼
                                                       Maintainer uploads to
                                                       openrift.app admin panel
                                                                      │
                                                                      ▼
                                                       Goes through the existing
                                                       candidate-review flow
                                                       alongside TCGplayer,
                                                       Cardmarket, CardTrader
```

The `community` provider in OpenRift is reuploaded in full on each release; it's never patched. The file in `main` is always the complete current state.

## Legal

OpenRift is an unofficial fan project, not affiliated with or endorsed by Riot Games. Created under Riot's "Legal Jibber Jabber" policy using assets owned by Riot Games.

## License

[AGPL-3.0](LICENSE). See [CLA.md](CLA.md) for the contributor license agreement.
