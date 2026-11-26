// One Line, One Laugh — make.fun bounty
// Writes a single funny line to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// The line: a life coach takes one look at the browser tabs and gives up
// on coaching entirely — the escalation to an exorcist is the twist.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I hired a life coach; he took one look at my browser tabs and referred me to an exorcist.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function validate(line: string): void {
  if (line.length < 1 || line.length > 140) {
    fail(`line must be 1-140 characters, got ${line.length}`);
  }
  if (line !== line.trim()) {
    fail("line must not have leading or trailing whitespace");
  }
  if (/[\r\n]/.test(line)) {
    fail("line must be a single line");
  }
  for (const ch of line) {
    if (ch.codePointAt(0)! < 0x20 || ch.codePointAt(0) === 0x7f) {
      fail("line must not contain control characters");
    }
  }
}

function main(): void {
  validate(LINE);
  const outDir = (process.env.MAKEFUN_OUTPUT_DIR || "").trim() || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== LINE) {
    fail("read-back mismatch: entry.txt bytes differ from the line");
  }
  // Re-run the same gate on what actually landed on disk, so a
  // write that silently altered the text cannot slip through.
  validate(readBack);
  if (Buffer.byteLength(readBack, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
    fail("read-back byte length differs from the line");
  }
  console.log(`wrote ${LINE.length} characters to ${outPath}`);
  console.log(LINE);
}

main();
