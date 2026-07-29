# Spiritly

**A Christ-centered formation companion. You were never meant to journey alone.**

Spiritly is a mobile app for Christians who want to grow, not just consume content. Most faith apps hand you a devotional and hope for the best. Spiritly holds a conversation — one that adapts to where you actually are, and ends with small, real steps for the day in front of you.

Built for the Philippines first, where 93% of the population is Christian, and designed for the 2.6 billion Christians worldwide who are underserved by tools built elsewhere.

---

## The problem

Faith apps are content libraries. Social media optimises for attention. Christian dating apps charge you to speak to someone who already liked you. None of them help a person actually *grow* — and none of them notice when someone is struggling.

Spiritly is built the other way round: formation first, connection second, and nothing sold by extracting attention.

---

## The SPIRIT framework

Whole-life formation across six dimensions, rather than the spiritual life treated as a separate compartment:

| | Dimension | Covers |
|---|---|---|
| **S** | Spirit | Scripture, prayer, the interior life |
| **P** | Physical | Body, health, home and environment |
| **I** | Intellect | Learning, skill, wisdom |
| **R** | Relationship | Family, friendship, community |
| **I** | Income | Work, provision, stewardship |
| **T** | Transcendence | Service, legacy, purpose beyond the self |

Adapted from Dr. Tal Ben-Shahar's SPIRE model of wellbeing, reworked through a Christian lens. Where SPIRE includes *Emotional*, SPIRIT includes **Income** and **Transcendence** — because work and provision are where faith is tested daily, and because the Christian life does not end with the self.

---

## Formation Stage

Spiritly's adaptive engine, internally called **SEM — Spirit-Empowered Maturity**. The name is deliberate: growth comes from being empowered by grace, not from self-reliance.

Four stages, inferred by the AI and never shown to the user as a score:

- **0 — Overwhelmed.** Presence only. No tasks, no challenge.
- **1 — Stabilizing.** Small and gentle. One step at most.
- **2 — Capable.** Real reflection and real action.
- **3 — Activated.** Pointing outward — to other people, to service.

The stage changes everything downstream: the opening question, how far the AI pushes, what kind of actions it offers.

---

## How the AI actually works

Gemini is not a chatbot bolted onto a devotional app. It makes every consequential decision in the core experience, per user, with no human in the loop:

- **Chooses the opening question** based on Formation Stage
- **Reads the answer** and responds to what was actually said, not with generic encouragement
- **Writes the next question** — following the thread the person opened, going one layer deeper rather than changing subject
- **Generates three actions** at the end, shaped by the whole conversation and paced to the person's stage
- **Identifies which SPIRIT dimension** the person's words actually concern — money worry is Income even in a prayer app, exhaustion is Physical, loneliness is Relationship. Tracked across sessions to show where a life genuinely needs attention, and to notice when a dimension has gone quiet.
- **Follows their tradition without being told.** If someone mentions the rosary, it meets them in Catholic language. If they mention quiet time, it shifts. It never assumes.
- **Replies in Taglish** if that is how the person writes

A system prompt holds the voice: short sentences, everyday words, no exclamation marks, no advice unless asked. Written for a tired person reading on a phone at 6am, for whom English is a second language.

---

## Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo (SDK 54) |
| AI | **Google Gemini API** (`gemini-3.6-flash`) |
| Backend | **Firebase / Google Cloud** — Auth, Firestore |
| Payments | GCash / Maya |
| Language | TypeScript |

---

## Running it locally

```bash
npm install
npx expo start
```

Then scan the QR code with **Expo Go** on Android, or press `w` for the browser.

You will need a Gemini API key. Create a `.env` file in the project root:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

Free keys are available at [aistudio.google.com](https://aistudio.google.com).

---

## Status

**Working:** splash, onboarding, initial Formation Stage check-in, and the full threaded reflection flow with live Gemini calls, adaptive questioning, and generated daily actions.

**In progress:** registration and Firebase Auth, Firestore persistence.

**Planned:** SPIRIT dashboard, milestones, community, and SPIRITLY RELATE™ — formation-gated connection for singles and couples, which unlocks only as a person grows rather than the moment they pay.

---

## Pre-existing work

This project was scaffolded from the standard Expo starter template (`create-expo-app`), and the default tab navigation, themed components, and hooks from that template remain in the repository where unused. All Spiritly-specific work — the SPIRIT framework, Formation Stage engine, reflection flow, prompt design, screens, and branding — was created from June 2026 onward.

---

## Principles

No ads. No selling user data. No attention extraction.

People will type their grief and their doubt into this app. That is a trust worth building for properly.

---

## Licence

MIT — see [LICENSE](LICENSE).
