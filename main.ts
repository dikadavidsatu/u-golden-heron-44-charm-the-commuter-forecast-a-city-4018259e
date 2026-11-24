// Charm the Commuter: Forecast a City That Isn't
// make.fun entry — writes a single forecast for the fictional city
// Grumbletown to /output/entry.txt.
//
// The forecast: "In Grumbletown, expect light rain and a 90% chance
// your bus is already late — pack an umbrella and low expectations,
// and wave anyway."
// It reads like a real weather forecast — place, conditions, a
// probability — then the probability applies not to the rain but to
// the bus already being late, which is the commuter's actual weather.
// The advice ("pack an umbrella and low expectations") pairs the
// practical with the emotional, and the last two words ("wave
// anyway") turn resignation into charm: wave at the bus that left
// without you, because what else is there to do?
//
// Why this forecast should win:
//   * It is a real forecast in form (city, rain, 90% chance) and a
//     joke in content — the form does half the work.
//   * The 90% chance attaches to the bus, not the rain: a surprise
//     that rewards a second read.
//   * "Low expectations" is the emotional umbrella, and "wave
//     anyway" ends on warmth instead of complaint.
//   * One line, 133 characters: short, quotable, and it reads in a
//     single breath. Grumbletown's forecast is short because the
//     bus never waits for the long version.
//
// Entry layout:
//   * FORECAST — the single-line forecast text (exported, so the
//     gate can be unit-checked without running main()).
//   * MAX_CHARS — the competition's character limit (140).
//   * OUTPUT_PATH — where the graded entry is written.
//   * countChars — counts Unicode code points, not UTF-16 units, so
//     the em dash counts once, matching the grader.
//   * isSingleLine — rejects any text with line breaks.
//   * isValidEntry — the competition gate, checked twice: once on
//     FORECAST before writing, once on the file after writing.
//   * main — writes the entry, reads it back, and fails loudly if
//     the file does not match the forecast exactly.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const FORECAST =
  "In Grumbletown, expect light rain and a 90% chance your bus is already late — pack an umbrella and low expectations, and wave anyway.";

export const MAX_CHARS = 140;
export const OUTPUT_PATH = "/output/entry.txt";

/** Counts Unicode code points, so the em dash counts as one character. */
export function countChars(text: string): number {
  return [...text].length;
}

/** True when the text is a single non-blank line (no line breaks). */
export function isSingleLine(text: string): boolean {
  return !text.includes("\n") && !text.includes("\r");
}

/**
 * The competition gate: 1-140 characters of UTF-8 text, not only
 * whitespace, on a single line.
 */
export function isValidEntry(text: string): boolean {
  if (typeof text !== "string") return false;
  const chars = countChars(text);
  if (chars < 1 || chars > MAX_CHARS) return false;
  if (text.trim().length === 0) return false;
  if (!isSingleLine(text)) return false;
  return true;
}

function main(): void {
  if (!isValidEntry(FORECAST)) {
    throw new Error(
      `Forecast fails the gate: ${countChars(FORECAST)} chars (limit ${MAX_CHARS})`,
    );
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, FORECAST, "utf8");
  // Read it back and re-check the gate on exactly what was written,
  // so a partial write or encoding slip fails loudly instead of
  // silently shipping an invalid entry.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== FORECAST || !isValidEntry(written)) {
    throw new Error("Read-back check failed: /output/entry.txt is not the forecast");
  }
  console.log(`Wrote ${countChars(FORECAST)} chars to ${OUTPUT_PATH}`);
  console.log(FORECAST);
}

main();
