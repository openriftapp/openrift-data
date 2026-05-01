#!/usr/bin/env node
/**
 * Consolidates dated contribution files (e.g. `ahri-alluring--20260501-1200.json`)
 * into their canonical slug-only form (`ahri-alluring.json`), overwriting any
 * existing canonical file. Strips the `--<date>` segment from every
 * `external_id` so the consolidated file is reviewable as a normal correction.
 *
 * The contribute form on openrift.app submits dated files because GitHub's
 * `?value=` URL would otherwise refuse to commit on top of an existing path.
 * This script reverts that workaround once the PR is merged into main.
 *
 * Idempotent: a second run finds no dated files and exits 0 with no changes.
 */
import { readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONTRIBUTIONS_DIR = "contributions";
const FILENAME_SUFFIX_PATTERN = /^(.+)--\d{8}-\d{4}$/;
const ID_SUFFIX_PATTERN = /--\d{8}-\d{4}/g;

function stripSuffix(externalId) {
  return externalId.replaceAll(ID_SUFFIX_PATTERN, "");
}

const files = readdirSync(CONTRIBUTIONS_DIR)
  .filter((f) => f.endsWith(".json"))
  .toSorted();

const consolidated = [];
for (const file of files) {
  const base = file.slice(0, -".json".length);
  const match = base.match(FILENAME_SUFFIX_PATTERN);
  if (!match) {
    continue;
  }
  const slug = match[1];
  const datedPath = join(CONTRIBUTIONS_DIR, file);
  const cleanPath = join(CONTRIBUTIONS_DIR, `${slug}.json`);

  const json = JSON.parse(readFileSync(datedPath, "utf8"));
  if (json.card?.external_id) {
    json.card.external_id = stripSuffix(json.card.external_id);
  }
  for (const printing of json.printings ?? []) {
    if (printing.external_id) {
      printing.external_id = stripSuffix(printing.external_id);
    }
  }

  writeFileSync(cleanPath, `${JSON.stringify(json, null, 2)}\n`);
  unlinkSync(datedPath);
  consolidated.push({ from: file, to: `${slug}.json` });
}

if (consolidated.length === 0) {
  console.log("No dated contribution files to consolidate.");
  process.exit(0);
}

console.log(`Consolidated ${consolidated.length} file${consolidated.length === 1 ? "" : "s"}:`);
for (const { from, to } of consolidated) {
  console.log(`  ${from} -> ${to}`);
}
