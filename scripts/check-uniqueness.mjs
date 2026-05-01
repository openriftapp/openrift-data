#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CONTRIBUTIONS_DIR = "contributions";

const files = readdirSync(CONTRIBUTIONS_DIR)
  .filter((f) => f.endsWith(".json"))
  .toSorted();

const errors = [];
const seenCardIds = new Map();
const seenPrintingIds = new Map();

for (const file of files) {
  const raw = readFileSync(join(CONTRIBUTIONS_DIR, file), "utf8");
  const parsed = JSON.parse(raw);
  const cardId = parsed.card.external_id;

  if (seenCardIds.has(cardId)) {
    errors.push(
      `Duplicate card external_id "${cardId}" in ${file} and ${seenCardIds.get(cardId)}`,
    );
  } else {
    seenCardIds.set(cardId, file);
  }

  const seenWithinCard = new Set();
  for (const [printingIndex, printing] of parsed.printings.entries()) {
    const printingId = printing.external_id;

    if (seenWithinCard.has(printingId)) {
      errors.push(
        `Duplicate printing external_id "${printingId}" within ${file} at printings[${printingIndex}]`,
      );
    }
    seenWithinCard.add(printingId);

    if (seenPrintingIds.has(printingId)) {
      const prev = seenPrintingIds.get(printingId);
      errors.push(
        `Duplicate printing external_id "${printingId}" in ${file} (printings[${printingIndex}]) and ${prev.file} (printings[${prev.printingIndex}])`,
      );
    } else {
      seenPrintingIds.set(printingId, { file, printingIndex });
    }
  }
}

if (errors.length > 0) {
  console.error(`Uniqueness check failed (${errors.length} error${errors.length === 1 ? "" : "s"}):`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(
  `Uniqueness check passed: ${seenCardIds.size} card${seenCardIds.size === 1 ? "" : "s"}, ${seenPrintingIds.size} printing${seenPrintingIds.size === 1 ? "" : "s"} across ${files.length} file${files.length === 1 ? "" : "s"}.`,
);
