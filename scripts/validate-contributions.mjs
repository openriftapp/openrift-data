#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import Ajv from "ajv/dist/2020.js";

const CONTRIBUTIONS_DIR = "contributions";
const SCHEMA_FILE = "card.schema.json";

const ajv = new Ajv({ allErrors: true, strict: true });
const schema = JSON.parse(readFileSync(SCHEMA_FILE, "utf8"));
const validate = ajv.compile(schema);

const files = readdirSync(CONTRIBUTIONS_DIR)
  .filter((f) => f.endsWith(".json"))
  .toSorted();

let failed = 0;
for (const file of files) {
  const raw = readFileSync(join(CONTRIBUTIONS_DIR, file), "utf8");
  const parsed = JSON.parse(raw);
  if (!validate(parsed)) {
    failed += 1;
    console.error(`✗ ${file}`);
    for (const error of validate.errors ?? []) {
      console.error(`    ${error.instancePath} ${error.message}`);
    }
  }
}

if (failed > 0) {
  console.error(`\n${failed} of ${files.length} contribution file${files.length === 1 ? "" : "s"} failed validation.`);
  process.exit(1);
}

console.log(
  `All ${files.length} contribution file${files.length === 1 ? "" : "s"} valid.`,
);
