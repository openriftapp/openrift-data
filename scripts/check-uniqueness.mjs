#!/usr/bin/env node
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync("community.json", "utf8"));
const errors = [];
const seenCardIds = new Map();
const seenPrintingIds = new Map();

for (const [index, candidate] of data.candidates.entries()) {
  const cardId = candidate.card.external_id;
  if (seenCardIds.has(cardId)) {
    errors.push(
      `Duplicate card external_id "${cardId}" at candidates[${index}] and candidates[${seenCardIds.get(cardId)}]`,
    );
  } else {
    seenCardIds.set(cardId, index);
  }

  const seenWithinCard = new Set();
  for (const [printingIndex, printing] of candidate.printings.entries()) {
    const printingId = printing.external_id;
    if (seenWithinCard.has(printingId)) {
      errors.push(
        `Duplicate printing external_id "${printingId}" within card "${cardId}" at printings[${printingIndex}]`,
      );
    }
    seenWithinCard.add(printingId);

    if (seenPrintingIds.has(printingId)) {
      const prev = seenPrintingIds.get(printingId);
      errors.push(
        `Duplicate printing external_id "${printingId}" at candidates[${index}].printings[${printingIndex}] and candidates[${prev.candidateIndex}].printings[${prev.printingIndex}]`,
      );
    } else {
      seenPrintingIds.set(printingId, { candidateIndex: index, printingIndex });
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
  `Uniqueness check passed: ${seenCardIds.size} card${seenCardIds.size === 1 ? "" : "s"}, ${seenPrintingIds.size} printing${seenPrintingIds.size === 1 ? "" : "s"}.`,
);
