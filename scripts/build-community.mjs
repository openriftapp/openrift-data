#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONTRIBUTIONS_DIR = "contributions";
const OUTPUT_FILE = "community.json";

const files = readdirSync(CONTRIBUTIONS_DIR)
  .filter((f) => f.endsWith(".json"))
  .toSorted();

const candidates = [];
for (const file of files) {
  const raw = readFileSync(join(CONTRIBUTIONS_DIR, file), "utf8");
  const parsed = JSON.parse(raw);
  delete parsed.$schema;
  candidates.push(parsed);
}

const output = {
  provider: "community",
  candidates,
};

writeFileSync(OUTPUT_FILE, `${JSON.stringify(output, null, 2)}\n`);

console.log(
  `Built ${OUTPUT_FILE} from ${files.length} contribution${files.length === 1 ? "" : "s"}.`,
);
