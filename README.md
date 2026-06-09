# DIVA-5 Tool

A single-page web app of the **DIVA-5 Diagnostic Interview for ADHD**, scored against DSM-5, with a header toggle between two instruments:

- **Adult · 17+** — the standard DIVA-5 (Patient version): current adulthood + retrospective childhood (5–12), adult threshold (≥5).
- **Young · 5–17** — a Young DIVA-5–style interview for children & adolescents: *current* symptoms across **Home** and **School/College** settings, youth threshold (≥6), DSM-5 cross-setting (≥2 settings) and onset-before-12 checks, and the five Young DIVA impairment areas.

Each question has a free-text box where **Claude** reads a description and ticks the matching items across the whole form.

🔗 **Live:** https://drjlamlsc.github.io/diva5_tool/

> ⚕️ The **Young** instrument is built on the canonical DSM-5 criteria with age-appropriate Home/School examples adapted for ages 5–17 (the official Young DIVA-5 is registration-gated at the DIVA Foundation). Obtain the official Young DIVA-5 for the validated example wording. Use the **Adult** instrument only for ages 17+.

## Features

- **Full DIVA-5 interview** — all 18 symptom criteria (Part 1 attention deficit A1–A9, Part 2 hyperactivity/impulsivity H1–H9) with the official adulthood and childhood example prompts, plus Part 3 impairment (criteria B onset, C the five life domains for adulthood and childhood, D).
- **Live DSM-5 scoring** — the sticky scoreboard updates in real time as you tick boxes. A criterion counts as "present" for a period when ≥1 of its example boxes in that column is ticked; counts are compared against the thresholds (≥5 adult, ≥6 childhood) and the presentation (Inattentive / Hyperactive-Impulsive / Combined) plus full-criteria status are shown. Each card also shows live Adult/Child "present" indicators, and impairment areas are counted live (≥2 needed).
- **Per-criterion AI helper** — under every question there's a free-text box. Type a description (history, clinical note, the patient's own words) and Claude (via `xiaoai.plus`) ticks the matching items **across the whole form** — not just that criterion — **additively** (it never unticks your own choices), and can set the onset flag.
- **Local-first** — answers autosave to your browser; Save/Load JSON; Print / export to PDF. No data leaves the browser except the free text you send to the AI assistant.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page shell |
| `styles.css` | Styling |
| `data.js` | DIVA-5 item bank (criteria, examples, impairment domains) |
| `app.js` | Rendering, scoring, autosave, import/export, Claude integration |
| `DIVA-5-Adult-PATIENT-VERSION.pdf` | Source instrument |

## How the AI helper works

Each per-criterion text box sends its text plus a catalog of **every** example item (`{id, text, criterion, period}`) to the Anthropic-compatible Messages API at `https://xiaoai.plus/v1/messages` (model `claude-sonnet-4-6`). Claude returns strict JSON listing the item ids to check anywhere in the form; the app ticks them and the score recomputes live.

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
