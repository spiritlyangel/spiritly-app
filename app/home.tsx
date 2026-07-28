import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getReflection, refineActions, OPENING_QUESTIONS, type Turn } from '../lib/gemini';
const TOTAL_TURNS = 3;
const VERSE = {
  text: 'For I know the plans I have for you, declares the Lord — plans to prosper you.',
  ref: 'Jeremiah 29:11',
};
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
function today() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
export default function HomeScreen() {
  const params = useLocalSearchParams<{ sem?: string; life?: string; days?: string }>();
  const SEM_LEVEL = Number(params.sem ?? 1);
  const [phase, setPhase] = useState<'asking' | 'suggest' | 'confirmed'>('asking');
  const [history, setHistory] = useState<Turn[]>([]);
  const [question, setQuestion] = useState(OPENING_QUESTIONS[SEM_LEVEL]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [actions, setActions] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [error, setError] = useState('');
  const [refining, setRefining] = useState(false);
  const [refineCount, setRefineCount] = useState(0);
  const isFinalTurn = history.length === TOTAL_TURNS - 1;
  const submit = async () => {
    const answer = input.trim();
    if (!answer || thinking) return;
    setThinking(true);
    setError('');
    setInput('');
    try {
      const r = await getReflection({
        semLevel: SEM_LEVEL,
        life: params.life,
        days: params.days,
        history,
        currentQuestion: question,
        answer,
        isFinalTurn,
      });
      setHistory((h) => [...h, { question, answer, reflection: r.reflection }]);
      if (r.actions) {
        setActions(r.actions);
        setPhase('suggest');
      } else if (r.nextQuestion) {
        setQuestion(r.nextQuestion);
      }
    } catch (e: any) {
      setError(e.message);
      setInput(answer);
    }
    setThinking(false);
  };
  const acceptActions = () => {
    setChecked(new Array(actions.length).fill(false));
    setPhase('confirmed');
  };

  const handleRefine = async () => {
    if (refining) return;
    setRefining(true);
    setError('');
    try {
      const next = await refineActions({
        semLevel: SEM_LEVEL,
        life: params.life,
        days: params.days,
        history,
        previousActions: actions,
      });
      setActions(next);
      setRefineCount((c) => c + 1);
    } catch (e: any) {
      setError(e.message);
    }
    setRefining(false);
  };

  const toggleAction = (i: number) => {
    setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));
  };
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <View style={[styles.glow, styles.glow1]} />
      <View style={[styles.glow, styles.glow2]} />
      {/* Greeting */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting()}</Text>
          <Text style={styles.date}>{today()}</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>Day 1</Text>
        </View>
      </View>
      {/* Daily verse */}
      <View style={styles.verseCard}>
        <Text style={styles.cardLabel}>DAILY VERSE</Text>
        <Text style={styles.verseText}>“{VERSE.text}”</Text>
        <Text style={styles.verseRef}>— {VERSE.ref}</Text>
      </View>
      {/* Reflection */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>
            {phase === 'confirmed' ? 'YOUR REFLECTION' : "TODAY'S REFLECTION"}
          </Text>
          {phase === 'asking' && (
            <Text style={styles.cardMeta}>
              {history.length + 1} of {TOTAL_TURNS}
            </Text>
          )}
        </View>
        {/* Thread */}
        {history.length > 0 && (
          <View style={styles.thread}>
            {history.map((t, i) => (
              <View key={i} style={styles.pastTurn}>
                <Text style={styles.pastQuestion}>{t.question}</Text>
                <Text style={styles.pastAnswer}>“{t.answer}”</Text>
                <Text style={styles.pastReflection}>{t.reflection}</Text>
              </View>
            ))}
          </View>
        )}
        {/* Active turn */}
        {phase === 'asking' && (
          <>
            <Text style={styles.question}>{question}</Text>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Write freely..."
              placeholderTextColor="#5A626E"
              multiline
              editable={!thinking}
              style={[styles.input, thinking && styles.inputDisabled]}
            />
            <View style={styles.buttonRow}>
              <Pressable
                onPress={submit}
                disabled={!input.trim() || thinking}
                style={[styles.pillButton, (!input.trim() || thinking) && styles.pillButtonOff]}
              >
                <Text
                  style={[
                    styles.pillButtonText,
                    (!input.trim() || thinking) && styles.pillButtonTextOff,
                  ]}
                >
                  {thinking ? 'Listening…' : isFinalTurn ? 'Continue  →' : 'Submit  →'}
                </Text>
              </Pressable>
            </View>
          </>
        )}
        {/* Suggest phase */}
        {phase === 'suggest' && (
          <View>
            <Text style={styles.suggestIntro}>
              Based on what you&apos;ve shared, here are three small actions for today. Does this feel
              right?
            </Text>
            {actions.map((a, i) => (
              <View key={i} style={styles.suggestCard}>
                <Text style={styles.suggestText}>{a}</Text>
              </View>
            ))}
            <View style={styles.suggestButtons}>
              <Pressable onPress={acceptActions} disabled={refining} style={styles.confirmButton}>
                <Text style={styles.confirmText}>✓  Yes, this feels right</Text>
              </Pressable>
              {refineCount < 2 && (
                <Pressable onPress={handleRefine} disabled={refining} style={styles.refineButton}>
                  <Text style={styles.refineText}>{refining ? 'Thinking…' : 'Not quite'}</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        {phase === 'confirmed' && (
          <Text style={styles.confirmedNote}>Your actions are below. Walk gently into the day.</Text>
        )}
      </View>
      {/* Actions */}
      {phase === 'confirmed' && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TODAY&apos;S ACTIONS</Text>
          <View style={styles.actionList}>
            {actions.map((a, i) => (
              <Pressable key={i} onPress={() => toggleAction(i)} style={styles.actionRow}>
                <View style={[styles.checkbox, checked[i] && styles.checkboxOn]}>
                  {checked[i] && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.actionText, checked[i] && styles.actionTextDone]}>{a}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
}
const GOLD = '#C9A84C';
const BG = '#0B0E14';
const SURFACE = '#151B23';
const BORDER = '#2A323D';
const MUTED = '#8A95A3';
const TEXT = '#EAE4D8';
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  inner: { padding: 24, paddingTop: 60, paddingBottom: 60 },
  glow: { position: 'absolute', alignSelf: 'center', backgroundColor: GOLD, borderRadius: 9999 },
  glow1: { width: 560, height: 560, top: -300, opacity: 0.045 },
  glow2: { width: 320, height: 320, top: -190, opacity: 0.05 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 26 },
  greeting: { fontFamily: 'serif', fontSize: 28, fontStyle: 'italic', color: TEXT, lineHeight: 34 },
  date: { fontSize: 13, color: MUTED, marginTop: 4 },
  streakPill: {
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakText: { color: GOLD, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  verseCard: {
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    backgroundColor: 'rgba(21,27,35,0.7)',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
  },
  verseText: {
    fontFamily: 'serif',
    fontSize: 19,
    fontStyle: 'italic',
    color: 'rgba(234,228,216,0.95)',
    lineHeight: 28,
    marginTop: 12,
  },
  verseRef: { fontSize: 13, color: MUTED, marginTop: 14 },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(42,50,61,0.6)',
    backgroundColor: 'rgba(21,27,35,0.5)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: MUTED },
  cardMeta: { fontSize: 10, letterSpacing: 1.5, color: 'rgba(138,149,163,0.7)' },
  thread: { marginTop: 18, borderLeftWidth: 2, borderLeftColor: 'rgba(201,168,76,0.2)', paddingLeft: 14 },
  pastTurn: { marginBottom: 16, gap: 5 },
  pastQuestion: { fontSize: 12.5, fontStyle: 'italic', color: 'rgba(138,149,163,0.85)', lineHeight: 18 },
  pastAnswer: { fontSize: 13, color: 'rgba(234,228,216,0.75)', lineHeight: 19 },
  pastReflection: {
    fontFamily: 'serif',
    fontSize: 13.5,
    fontStyle: 'italic',
    color: 'rgba(201,168,76,0.85)',
    lineHeight: 20,
  },
  question: { fontFamily: 'serif', fontSize: 17, color: 'rgba(234,228,216,0.95)', lineHeight: 25, marginTop: 18, marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(42,50,61,0.8)',
    backgroundColor: 'rgba(11,14,20,0.6)',
    borderRadius: 10,
    color: TEXT,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 88,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  inputDisabled: { opacity: 0.5 },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 },
  pillButton: {
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.5)',
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  pillButtonOff: { borderColor: 'rgba(42,50,61,0.6)', backgroundColor: 'transparent' },
  pillButtonText: { color: GOLD, fontSize: 12.5, fontWeight: '500' },
  pillButtonTextOff: { color: 'rgba(138,149,163,0.5)' },
  suggestIntro: {
    fontFamily: 'serif',
    fontSize: 15,
    fontStyle: 'italic',
    color: 'rgba(234,228,216,0.9)',
    lineHeight: 22,
    marginTop: 18,
    marginBottom: 14,
  },
  suggestCard: {
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    backgroundColor: 'rgba(11,14,20,0.4)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  suggestText: { fontSize: 14, color: 'rgba(234,228,216,0.9)', lineHeight: 20 },
  confirmButton: {
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.6)',
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 18,
  },
  confirmText: { color: GOLD, fontSize: 12.5, fontWeight: '500' },
    suggestButtons: { flexDirection: 'row', gap: 8, marginTop: 14, justifyContent: 'flex-end' },
    refineButton: {
      borderWidth: 1,
      borderColor: 'rgba(42,50,61,0.8)',
      borderRadius: 999,
      paddingVertical: 9,
      paddingHorizontal: 18,
    },
  refineText: { color: MUTED, fontSize: 12.5, fontWeight: '500' },
  confirmedNote: {
    fontFamily: 'serif',
    fontSize: 14.5,
    fontStyle: 'italic',
    color: 'rgba(201,168,76,0.9)',
    lineHeight: 21,
    marginTop: 16,
  },
  actionList: { marginTop: 16, gap: 14 },
  actionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(42,50,61,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: { borderColor: GOLD, backgroundColor: GOLD },
  checkmark: { color: BG, fontSize: 13, fontWeight: '700' },
  actionText: { flex: 1, fontSize: 14.5, color: 'rgba(234,228,216,0.9)', lineHeight: 21 },
  actionTextDone: { color: MUTED, textDecorationLine: 'line-through' },
  error: { color: '#E05C5C', marginTop: 20, fontSize: 13, lineHeight: 19 },
});
