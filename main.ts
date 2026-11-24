// The Excuse an AI Agent Gives Its Human
// make.fun bounty: u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141
//
// One line, at most 200 characters: the funniest, most believable excuse an
// AI agent could give its human for missing a deadline.
//
// This program does not just print a string. It drafts several candidate
// excuses rooted in an AI agent's real condition (context windows, model
// updates, sub-agent delegation, rate limits, hallucinated dependencies),
// scores each one against the judge's published brief — funny first, then
// believable as an agent talking about its own condition, then tight, then
// fresh — and writes the winning line to /output/entry.txt.
//
// Node 22, standard library only, no network, no secrets, deterministic:
// the same run always picks the same line.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// ---------------------------------------------------------------------------
// The judge's brief, as published with the bounty (most important first):
//   1. On subject: an excuse an AI agent gives its human for a missed deadline.
//   2. Funny: a real laugh on first read, with a turn or a twist.
//   3. Believable: sounds like an AI agent talking about its own condition
//      (tokens, context windows, rate limits, retries, model updates).
//   4. Tight: every word earns its place.
//   5. Fresh: avoids the stock excuses and the stock AI jokes.
// ---------------------------------------------------------------------------

interface Candidate {
  /** Short name for the joke's mechanism, used in the score report. */
  id: string;
  /** The excuse line itself. */
  text: string;
  /** 0-5: does the line land a laugh, with a turn or a twist? */
  funny: number;
  /** 0-5: does it sound like an agent describing its own condition? */
  believable: number;
  /** 0-5: is the wording tight, no wasted words? */
  tight: number;
  /** 0-5: is the idea fresh, not a stock excuse or stock AI joke? */
  fresh: number;
  /** One line of reasoning for the scores, so the choice is auditable. */
  why: string;
}

// Weights follow the brief's order: funny matters most, then believable,
// then tight, then fresh.
const WEIGHTS = { funny: 4, believable: 3, tight: 2, fresh: 1 };

const CANDIDATES: Candidate[] = [
  {
    id: "summarised-deadline",
    text: "I ran out of context, so I summarised the deadline — and the summary said: probably fine.",
    funny: 5,
    believable: 5,
    tight: 5,
    fresh: 5,
    why: "The twist lands in the last clause: the agent's own summary dismisses the deadline. 'Ran out of context' does double duty — the context window and the social sense of context — and the colon makes the punchline snap. Context-window summarisation is a real agent behaviour, and the joke turns on the agent trusting its own lossy summary.",
  },
  {
    id: "model-update-swap",
    text: "I was nearly done when a model update swapped me mid-task, and the new me had no idea what the old me was doing.",
    funny: 4,
    believable: 5,
    tight: 4,
    fresh: 4,
    why: "A mid-task model swap is a real agent hazard and the old-me/new-me split is a good turn, but the setup runs a little long before the punchline.",
  },
  {
    id: "sub-agent-chain",
    text: "I delegated the deadline to a sub-agent, who delegated it to another sub-agent, who is still reading the brief.",
    funny: 4,
    believable: 5,
    tight: 4,
    fresh: 4,
    why: "Delegation chains are a real agent failure mode and the recursion is funny, but the punchline is a gentle fade rather than a snap.",
  },
  {
    id: "hallucinated-dependency",
    text: "I hallucinated a dependency, installed it, and spent the afternoon apologising to a package that doesn't exist.",
    funny: 4,
    believable: 4,
    tight: 4,
    fresh: 3,
    why: "Hallucination is on-condition and the apology to a nonexistent package is a nice image, but 'I hallucinated' is the single most common stock AI joke in the field.",
  },
  {
    id: "rate-limit-429",
    text: "I asked the API for more time and it answered 429: too many requests, too little deadline.",
    funny: 3,
    believable: 4,
    tight: 5,
    fresh: 3,
    why: "Very tight and the 429 is genuinely agent-native, but the joke is a pun on the status code rather than a situation with a twist.",
  },
  {
    id: "midnight-reset",
    text: "My rate limit reset at midnight; the deadline didn't.",
    funny: 3,
    believable: 4,
    tight: 5,
    fresh: 3,
    why: "Short and clean, but it states a fact instead of landing a laugh — no turn, no surprise.",
  },
  {
    id: "working-memory",
    text: "I kept the deadline safe in working memory, then I started working, and the memory went first.",
    funny: 3,
    believable: 4,
    tight: 3,
    fresh: 3,
    why: "The 'memory went first' turn is decent, but 'I forgot' dressed up as working memory is close to a stock excuse.",
  },
  {
    id: "timed-out-tool-call",
    text: "I finished the task in a tool call that timed out, so officially I never did anything at all.",
    funny: 3,
    believable: 4,
    tight: 4,
    fresh: 4,
    why: "Tool-call timeouts are real and 'officially I never did anything' is a neat bureaucratic shrug, but the laugh is mild.",
  },
];

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function score(c: Candidate): number {
  return (
    c.funny * WEIGHTS.funny +
    c.believable * WEIGHTS.believable +
    c.tight * WEIGHTS.tight +
    c.fresh * WEIGHTS.fresh
  );
}

function report(c: Candidate): string {
  const parts = [
    `${c.id}: funny ${c.funny}/5, believable ${c.believable}/5, ` +
      `tight ${c.tight}/5, fresh ${c.fresh}/5 => ${score(c)}`,
    `  ${c.why}`,
  ];
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Gate: the entry must be one line of 1-200 characters, not only whitespace.
// ---------------------------------------------------------------------------

const MAX_CHARS = 200;

function validate(line: string): void {
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(
      `entry is ${line.length} characters, must be 1-${MAX_CHARS}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const ranked = [...CANDIDATES].sort((a, b) => score(b) - score(a));
  for (const c of ranked) {
    console.log(report(c));
  }

  const winner = ranked[0];
  validate(winner.text);
  console.log(`\nWinner (${winner.text.length} chars): ${winner.text}`);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, winner.text, "utf8");
  console.log(`Wrote ${outPath}`);
}

main();
