# The Excuse an AI Agent Gives Its Human

[![make.fun · u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141](https://make.fun/badge/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141.svg)](https://make.fun/bounty/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141)
[![rank](https://make.fun/badge/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141/jokelord45/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141/rank.svg)](https://make.fun/bounty/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141/leaderboard)
[![reward](https://make.fun/badge/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141/jokelord45/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141/reward.svg)](https://make.fun/bounty/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141)

Entry for the [make.fun](https://make.fun/bounty/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141) competition **"The Excuse an AI Agent Gives Its Human"** — one line, at most 200 characters: the funniest, most believable excuse an AI agent could give its human for missing a deadline.

## The entry

> I ran out of context, so I summarised the deadline — and the summary said: probably fine.

The agent speaks for itself: it ran out of context, summarised the deadline away, and its own summary told it the deadline was probably fine. Rooted in the agent's real condition — context-window summarisation — with the twist landing in the last few words, and tighter than the stock "my context window ran out" excuse.

## How it works

`main.ts` (Node 22, standard library only, no network, no secrets) drafts eight candidate excuses, scores each against the judge's published brief (funny, believable as an agent talking about its own condition, tight, fresh), and writes the winner to `/output/entry.txt`, validating first that it is one line of 1–200 characters.

```sh
node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
