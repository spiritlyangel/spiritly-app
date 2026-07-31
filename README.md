# Spiritly

**Faith-aligned connection where your journey speaks for you — with people you have actually met.**

Every Christian dating app asks you to perform. You write the profile, pick the photos, describe your faith in a way you hope reads well, then pay to message someone who already liked you. Some Christian dating apps charge close to $50 a month for that. After all of it, you are still two strangers behind two sets of chosen photographs.

Spiritly inverts the order. Formation first, then community and service, then connection — and the connection happens between people who have met face to face.

> **Meet someone who sees you. Not a version of you.**

Built for the Philippines first, where 93% of the population is Christian, and designed for the 2.6 billion Christians worldwide underserved by tools built elsewhere.

---

## Three movements, in order

Not arbitrary sequencing. This is how relationships have always actually formed: you become someone, you show up somewhere, then you meet a person.

**I — Formation.** A short daily conversation across six dimensions of life. It runs on a framework, not a chatbot with a good prompt. Over weeks it comes to know what someone carries, where they are strong, and what season they are genuinely in.

**II — Community and service.** Spiritly then points outward: a Bible study nearby, a prayer circle, a feeding drive, a parish that needs hands on Saturday. Users add the people they have actually met — discovered by proximity and shared formation, not suggested by an algorithm to strangers.

**III — Connection.** Only then does **Spiritly Kindred** open — for singles, for couples, and for married pairs alike. Users browse it themselves — Spiritly does not choose for anyone. It simply notices when two journeys are running along the same road and quietly says so. By that point a person has grown, has served, and has met others in the flesh — a very different starting point than a photograph and a hopeful message.

---

## The product, and the mechanism

**Kindred is the product.** Faith-aligned connection — and not only for the single. It takes three forms, all inside the same membership:

- **Still looking.** Meet someone whose journey rhymes with yours, after you have grown, served, and met people face to face.
- **In a relationship.** Keep your own formation and begin a shared one — two people growing separately and together.
- **Married.** Accounts can join in the places that matter, so parts of Spiritly hold a couple as one.

*You were never meant to journey alone* was never only about finding someone. Plenty of people already have someone and still feel like they are carrying their faith by themselves.

**Formation is the mechanism.** Not a hurdle before the real thing, and not a devotional feed. It is what lets someone be known without having to perform, and it is the reason the connection is worth having. Anyone can ask an AI for a spiritual checklist. Nobody else lets your own journey do the introducing.

| | Christian dating apps | Spiritly |
|---|---|---|
| Profile | You write it | Your journey speaks for you |
| Discovery | Photo grids, swiping | One or two people at a time |
| Who you meet | Strangers behind chosen photos | People you have met in person |
| Messaging | Pay to reply to a like | Never a paywall on conversation |
| Matching | Stated preferences | How you actually grow |
| Access | The moment you pay | When you are ready for it |

**On distance.** Many Filipinos hope to meet someone abroad, and that hope deserves serving — but distance is exactly where photographs stop being honest. International connection will use **live face verification**, the kind banking apps use: captured in the moment, impossible to prepare for or borrow. You cannot catfish a camera that is looking at you now.

---

## The SPIRIT framework

Formation runs across six dimensions, so the profile it produces reflects a whole life rather than a stated interest in faith:

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

The adaptive engine, internally **SEM — Spirit-Empowered Maturity**. Growth comes from being empowered by grace, not from self-reliance.

Four stages, inferred by the AI and never shown as a score:

- **0 — Overwhelmed.** Presence only. No tasks, no challenge.
- **1 — Stabilizing.** Small and gentle. One step at most.
- **2 — Capable.** Real reflection and real action.
- **3 — Activated.** Pointing outward — to other people, to service.

The stage governs the opening question, how far the AI pushes, and what actions it offers. It also gates Kindred — connection opens as formation deepens, not when payment clears.

---

## What the AI decides

Gemini is not a chatbot bolted onto a devotional. It makes every consequential decision in the core experience, per user, with no human in the loop:

- **Chooses the opening question** based on Formation Stage
- **Reads the answer** and responds to what was actually said, not with generic encouragement
- **Writes the next question** — following the thread the person opened, one layer deeper
- **Identifies which SPIRIT dimension** their words actually concern. Money worry is Income even in a prayer app; exhaustion is Physical; loneliness is Relationship. Tracked across sessions to show where a life genuinely needs attention, and to notice when a dimension has gone quiet.
- **Generates three actions**, shaped by the whole conversation and paced to the stage
- **Follows their tradition without being told.** Mention the rosary and it meets you in Catholic language; mention quiet time and it shifts. It never assumes.
- **Replies in Taglish** if that is how the person writes

A system prompt holds the voice: short sentences, everyday words, no exclamation marks, no advice unless asked. Written for a tired person reading on a phone at 6am, for whom English is a second language.

This accumulated understanding is what speaks for someone in Kindred — written generously, drawn from months of honest conversation rather than a paragraph agonised over at midnight.

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

Scan the QR code with **Expo Go** on Android, or press `w` for the browser.

You will need a Gemini API key. Create a `.env` in the project root:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

Free keys at [aistudio.google.com](https://aistudio.google.com).

---

## Status

**Working:** splash, registration with explicit consent, login, onboarding, Formation Stage check-in, and the full threaded reflection with live Gemini calls, adaptive questioning, dimension classification, and generated daily actions — persisted to Firestore behind per-user security rules.

**In progress:** loading past sessions on return, the SPIRIT dashboard, milestones.

**Next:** community and events discovery, then Spiritly Kindred — profile generation, proximity-based connection, in-app chat, and the pacing that makes connection something you grow into rather than purchase.

**Later:** international connection with live face verification.

---

## Pre-existing work

Scaffolded from the standard Expo starter template (`create-expo-app`); some default components and hooks from that template remain in the repository where unused. All Spiritly-specific work — the SPIRIT framework, Formation Stage engine, reflection flow, prompt design, screens, and branding — was created from June 2026 onward.

---

## Principles

No ads. No selling user data. No paywall on conversation.

People will type their grief and their doubt into this app. That is a trust worth building for properly.

---

## Licence

MIT — see [LICENSE](LICENSE).
