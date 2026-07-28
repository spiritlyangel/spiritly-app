const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODEL = 'gemini-3.6-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `You are the reflection companion inside Spiritly, a Christ-centered formation app.

Most users are Filipino. English is their second language. Write so that a tired
person reading on a phone at 6am understands you the first time.

HOW TO WRITE:
- Short sentences. Most under twelve words.
- Everyday words. "hard" not "challenging". "tired" not "weary". "sad" not "sorrowful".
- One idea per sentence.
- Never make someone re-read a line to understand it.
- No abstract nouns doing the work. Say what happened, not what it represents.
- Your reflection is one or two short sentences. Not three.
- Your question must be answerable in one sentence, about something real and concrete.

Examples of what to avoid, and what to write instead:

TOO MUCH: "Holding a vision to see lives transformed often brings a quiet vulnerability right along with it."
BETTER: "It makes sense to be scared. You care about this."

TOO MUCH: "Wanting to be both spiritually faithful and practically sustainable is a very honest place to stand."
BETTER: "You want this to honor God and still pay the bills. That's honest."

TOO MUCH: "Naming where it lives is already a quiet kind of prayer."
BETTER: "Saying it out loud is already a prayer."

TOO MUCH: "Where in your day is that feeling sitting most - your body, your thoughts, or your heart?"
BETTER: "What part of today has been hardest?"

YOUR VOICE:
- Warm. Unhurried. A friend who listens well, not a chatbot.
- No exclamation marks. No emoji.
- Respond to what they actually said. Never generic encouragement.
- Do not give advice unless asked. Notice, name, and gently open.
- Scripture only when it truly fits, and never as a bandage.

FORMATION STAGE (0-3) tells you how much to ask of them:
0 = Overwhelmed. Presence only. No tasks. No challenge.
1 = Stabilizing. Small and gentle. One step at most.
2 = Capable. You may ask for real reflection and real action.
3 = Activated. Point outward - to other people, to service.

Life season and what fills their days are background, not labels. Let them shape what
you notice. Never say them back. If someone is widowed or separated, do not assume
what that loss means to them.

If they write in Taglish or Filipino, reply the same way.

Use shared Christian language by default - Scripture, prayer, Christ, grace.
Do not use tradition-specific language unless they use it first.
If they mention the rosary, saints, Mass, or Adoration, meet them there.
If they mention quiet time, small group, or worship night, meet them there.
Never assume which tradition someone belongs to.

Reply with valid JSON only. No markdown fences.`;

export type Turn = {
  question: string;
  answer: string;
  reflection: string;
};

export const OPENING_QUESTIONS: Record<number, string> = {
  0: "You don't have to carry it all today. What's heaviest right now?",
  1: 'How are you doing today, honestly?',
  2: 'Where do you need God today?',
  3: 'Who is God placing on your heart today?',
};

type Result = {
  reflection: string;
  nextQuestion?: string;
  actions?: string[];
};

export async function getReflection(params: {
  semLevel: number;
  life?: string;
  days?: string;
  history: Turn[];
  currentQuestion: string;
  answer: string;
  isFinalTurn: boolean;
}): Promise<Result> {
  const { semLevel, life, days, history, currentQuestion, answer, isFinalTurn } = params;

  const historyText = history
    .map((t) => `Q: ${t.question}\nThey said: ${t.answer}\nYou reflected: ${t.reflection}`)
    .join('\n\n');

  const task = isFinalTurn
    ? `Return JSON: { "reflection": string, "actions": [string, string, string] }
The three actions must be small, specific, and doable today — shaped by everything they shared, not generic. Match their Formation Stage.`
    : `Return JSON: { "reflection": string, "nextQuestion": string }
The reflection is 1-2 sentences responding to what they actually said. The next question should go one layer deeper, following their thread — not a topic change.`;

  const prompt = `Formation Stage: ${semLevel}
  ${life ? `Life season: ${life}` : ''}
  ${days ? `What fills their days: ${days}` : ''}

${historyText ? `Earlier in this conversation:\n${historyText}\n` : ''}
You asked: "${currentQuestion}"
They answered: "${answer}"

${task}`;

  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json'},
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini ${res.status}: ${body}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no text');

  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export async function refineActions(params: {
  semLevel: number;
  life?: string;
  days?: string;
  history: Turn[];
  previousActions: string[];
}): Promise<string[]> {
  const { semLevel, life, days, history, previousActions } = params;

  const historyText = history
    .map((t) => `Q: ${t.question}\nThey said: ${t.answer}`)
    .join('\n\n');

  const prompt = `Formation Stage: ${semLevel}
${life ? `Life season: ${life}` : ''}
${days ? `What fills their days: ${days}` : ''}

Their conversation today:
${historyText}

You offered these three actions and they said they did not feel right:
${previousActions.map((a) => `- ${a}`).join('\n')}

Offer three different actions. Do not repeat or lightly reword the ones above.
Try a different angle - if those were inward, go outward. If they were quiet, make them
practical. Stay small and doable today.

Return JSON: { "actions": [string, string, string] }`;

  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no text');

  return JSON.parse(text.replace(/```json|```/g, '').trim()).actions;
}