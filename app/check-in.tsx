import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Mood = {
  label: string;
  color: string;
  emoji: string;
  sem: number;
};

const MOODS: Mood[] = [
  {
    label: "I'm overwhelmed. I don't know where to start.",
    color: '#C15A4C',
    emoji: '🔴',
    sem: 0,
  },
  {
    label: "I'm okay, but I feel like I'm just going through the motions.",
    color: '#C9925E',
    emoji: '🟠',
    sem: 1,
  },
  {
    label: "I'm doing well — I'm ready to grow intentionally.",
    color: '#4CAF7D',
    emoji: '🟢',
    sem: 2,
  },
  {
    label: 'I feel strong in my faith and want to go deeper.',
    color: '#5B8FBF',
    emoji: '🔵',
    sem: 3,
  },
];

export default function CheckInScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const params = useLocalSearchParams<{ faith?: string; life?: string }>();

  const handleSelect = (mood: Mood) => {
    if (selected) return;
    setSelected(mood.label);
    console.log('Starting Formation Stage:', mood.sem);
    setTimeout(() => {
      router.push({ pathname: '/home', params: { ...params, sem: String(mood.sem) } });
    }, 900);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.glow, styles.glow1]} />
      <View style={[styles.glow, styles.glow2]} />

      <View style={styles.inner}>
        <Text style={styles.header}>Before we begin...</Text>

        {/* AI message */}
        <View style={styles.messageRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>✦</Text>
          </View>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              Hello. I&apos;m glad you&apos;re here. Before anything else — how are you doing today,
              honestly?
            </Text>
          </View>
        </View>

        {/* Mood cards */}
        <View style={styles.moodList}>
          {MOODS.map((mood) => {
            const isSelected = selected === mood.label;
            const isDimmed = selected !== null && !isSelected;
            return (
              <Pressable
                key={mood.label}
                onPress={() => handleSelect(mood)}
                style={[
                  styles.moodCard,
                  isSelected && styles.moodCardSelected,
                  isDimmed && styles.moodCardDimmed,
                ]}
              >
                <View style={[styles.moodStripe, { backgroundColor: mood.color }]} />
                <View style={styles.moodContent}>
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.footerNote}>
          There are no wrong answers. This helps us walk with you.
        </Text>
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
  glow1: { width: 560, height: 560, top: -280, opacity: 0.05 },
  glow2: { width: 320, height: 320, top: -180, opacity: 0.05 },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 },
  header: {
    fontFamily: 'serif',
    fontSize: 20,
    fontStyle: 'italic',
    color: GOLD,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 32,
  },
  messageRow: { flexDirection: 'row', gap: 12, marginBottom: 36 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,168,76,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  avatarIcon: { color: GOLD, fontSize: 14 },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(21,27,35,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(42,50,61,0.4)',
    borderRadius: 18,
    borderTopLeftRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  bubbleText: { fontSize: 15, lineHeight: 22, color: 'rgba(234,228,216,0.9)' },
  moodList: { gap: 12 },
  moodCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(42,50,61,0.4)',
    backgroundColor: 'rgba(21,27,35,0.5)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  moodCardSelected: {
    borderColor: 'rgba(201,168,76,0.5)',
    backgroundColor: SURFACE,
  },
  moodCardDimmed: { opacity: 0.4 },
  moodStripe: { width: 6 },
  moodContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  moodEmoji: { fontSize: 18, marginRight: 14 },
  moodLabel: { flex: 1, fontSize: 14, lineHeight: 19, color: 'rgba(234,228,216,0.85)' },
  footerNote: {
    marginTop: 'auto',
    paddingTop: 32,
    textAlign: 'center',
    fontFamily: 'serif',
    fontSize: 12,
    fontStyle: 'italic',
    color: MUTED,
  },
});