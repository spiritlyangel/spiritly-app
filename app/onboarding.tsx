import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

type Step = { key: string; title: string; subtitle: string; options: string[] };

const STEPS: Step[] = [
  {
    key: 'life',
    title: 'Where are you in life?',
    subtitle: "However you answer, you're welcome here.",
    options: ['Single', 'In a relationship', 'Married', 'Widowed', 'Separated'],
  },
  {
    key: 'days',
    title: 'What fills your days right now?',
    subtitle: 'This helps us meet you where you are.',
    options: [
      'Studying',
      'Working',
      'Raising a family',
      'Caring for someone',
      'Building something',
      'Serving in ministry',
      'Between things',
    ],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const step = STEPS[stepIdx];
  const selected = answers[step.key];
  const isLast = stepIdx === STEPS.length - 1;

  const handleNext = () => {
    if (!selected) return;
    if (isLast) {
      router.push({ pathname: '/check-in', params: answers });
    } else {
      setStepIdx(stepIdx + 1);
    }
  };

  const handleBack = () => {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
    else router.back();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.glow, styles.glow1]} />
      <View style={[styles.glow, styles.glow2]} />

      <View style={styles.inner}>
        {/* Progress */}
        <View style={styles.progressHeader}>
          <View style={styles.progressTopRow}>
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.stepCounter}>
              {String(stepIdx + 1).padStart(2, '0')}
              <Text style={styles.stepSlash}>  /  </Text>
              {String(STEPS.length).padStart(2, '0')}
            </Text>
            <View style={styles.backButton} />
          </View>

          <View style={styles.progressBarRow}>
            {STEPS.map((s, i) => (
              <View key={s.key} style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: i <= stepIdx ? '100%' : '0%', opacity: i <= stepIdx ? 1 : 0.3 },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Question */}
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.subtitle}>{step.subtitle}</Text>

        {/* Options */}
        <View style={styles.optionsWrap}>
          {step.options.map((opt) => {
            const active = selected === opt;
            return (
              <Pressable
                key={opt}
                onPress={() => setAnswers({ ...answers, [step.key]: opt })}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerNote}>You can always change this later.</Text>
          <Pressable
            onPress={handleNext}
            disabled={!selected}
            style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
          >
            <Text style={[styles.nextText, !selected && styles.nextTextDisabled]}>
              {isLast ? 'Continue' : 'Next'}  →
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const GOLD = '#C9A84C';
const BG = '#0B0E14';
const SURFACE = '#151B23';
const BORDER = '#2A323D';
const MUTED = '#8A95A3';
const TEXT = '#EAE4D8';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, overflow: 'hidden' },
  glow: { position: 'absolute', alignSelf: 'center', backgroundColor: GOLD, borderRadius: 9999 },
  glow1: { width: 520, height: 520, top: -220, opacity: 0.05 },
  glow2: { width: 300, height: 300, top: -140, opacity: 0.05 },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 },
  progressHeader: { marginBottom: 48 },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: MUTED, fontSize: 18 },
  stepCounter: { color: MUTED, fontSize: 13, letterSpacing: 2 },
  stepSlash: { color: 'rgba(201,168,76,0.6)' },
  progressBarRow: { flexDirection: 'row', gap: 8 },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: SURFACE,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: GOLD },
  title: { fontFamily: 'serif', fontSize: 30, color: TEXT, lineHeight: 36 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 12, lineHeight: 20 },
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 40 },
  pill: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(21,27,35,0.6)',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  pillActive: { borderColor: GOLD, backgroundColor: 'rgba(201,168,76,0.1)' },
  pillText: { fontSize: 14, color: 'rgba(234,228,216,0.85)' },
  pillTextActive: { color: GOLD },
  footer: { marginTop: 'auto', paddingTop: 48 },
  footerNote: {
    textAlign: 'center',
    fontFamily: 'serif',
    fontSize: 12,
    fontStyle: 'italic',
    color: MUTED,
    marginBottom: 20,
  },
  nextButton: { backgroundColor: GOLD, borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  nextButtonDisabled: { backgroundColor: SURFACE },
  nextText: { fontSize: 15, fontWeight: '600', color: BG, letterSpacing: 1 },
  nextTextDisabled: { color: MUTED },
});