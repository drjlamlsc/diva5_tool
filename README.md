# DIVA-5 Tool

A single-page web app of the **DIVA-5 (Diagnostic Interview for ADHD in adults)** — Patient version, scored against DSM-5 criteria — with an **AI symptom assistant** that reads free-text history and automatically ticks the matching DIVA-5 items.

🔗 **Live:** https://drjlamlsc.github.io/diva5_tool/

## Features

- **Full DIVA-5 interview** — all 18 symptom criteria (Part 1 attention deficit A1–A9, Part 2 hyperactivity/impulsivity H1–H9) with the official adulthood and childhood example prompts, plus Part 3 impairment (criteria B onset, C the five life domains for adulthood and childhood, D).
- **Live DSM-5 scoring** — a sticky scoreboard counts symptoms per domain/period against the thresholds (≥5 adult, ≥6 childhood) and shows the presentation (Inattentive / Hyperactive-Impulsive / Combined) and whether full ADHD criteria are met.
- **AI symptom assistant** — paste a history or clinical note; Claude (via `xiaoai.plus`) selects the items clearly supported by the text and ticks them **additively** (it never unticks your own choices), sets the "symptoms present" flags, onset, and impairment, and explains what it based the selections on.
- **Local-first** — answers autosave to your browser; Save/Load JSON; Print / export to PDF. No data leaves the browser except the free text you send to the AI assistant.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page shell |
| `styles.css` | Styling |
| `data.js` | DIVA-5 item bank (criteria, examples, impairment domains) |
| `app.js` | Rendering, scoring, autosave, import/export, Claude integration |
| `DIVA-5-Adult-PATIENT-VERSION.pdf` | Source instrument |

## How the AI assistant works

`app.js` builds a catalog of every example item (`{id, text, criterion, period}`) and sends it with the free text to the Anthropic-compatible Messages API at `https://xiaoai.plus/v1/messages` (model `claude-sonnet-4-6`). Claude returns strict JSON listing the item ids to check; the app applies them and updates the score.

The endpoint is CORS-enabled, so the site runs as pure static hosting with no backend.

## ⚠️ Notes

- This is a clinical **aid**, not a diagnosis. Every AI selection must be reviewed by the clinician.
- The `xiaoai.plus` API key is embedded in `app.js` for convenience and is therefore **publicly visible** in this repo. Rotate it if abused. To hide it, move the call behind a proxy (e.g. a Cloudflare Worker holding the key as a secret) and point `CLAUDE_API` at the worker.

## Running locally

```bash
cd diva5_tool
python3 -m http.server 8123
# open http://localhost:8123
```
