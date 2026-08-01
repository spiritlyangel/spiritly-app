import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function ConsentScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [busy, setBusy] = useState(false);

  const handleEnter = async () => {
    if (!agreed || busy) return;
    setBusy(true);

    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        await updateDoc(doc(db, 'users', uid), {
          consentGivenAt: new Date().toISOString(),
          consentVersion: '1.0',
          dailyReminders: reminders,
        });
      } catch (e) {
        console.log('Could not save consent', e);
      }
    }
    router.replace('/welcome');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <View style={[styles.glow, styles.glow1]} />

      <Text style={styles.title}>Before we begin</Text>
      <Text style={styles.lede}>
        Spiritly will never sell your data, show you ads, or share your reflections. What you share
        here stays sacred.
      </Text>

      <Pressable onPress={() => setAgreed(!agreed)} style={styles.row}>
        <View style={[styles.check, agreed && styles.checkOn]}>
          {agreed && <Text style={styles.tick}>✓</Text>}
        </View>
        <Text style={styles.rowText}>
          I agree to the{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://livespiritly.com/terms.html')}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://livespiritly.com/privacy.html')}
          >
            Privacy Policy
          </Text>
        </Text>
      </Pressable>

      <Pressable onPress={() => setReminders(!reminders)} style={styles.row}>
        <View style={[styles.check, reminders && styles.checkOn]}>
          {reminders && <Text style={styles.tick}>✓</Text>}
        </View>
        <Text style={styles.rowText}>I&apos;d like gentle daily reminders</Text>
      </Pressable>

      <Text style={styles.footnote}>
        Your reflections and formation journey are stored so Spiritly can walk with you over time.
        Your information may be shared with competition organisers and judges as part of the Build
        with Gemini XPRIZE.
      </Text>

      <Pressable
        onPress={handleEnter}
        disabled={!agreed || busy}
        style={[styles.button, (!agreed || busy) && styles.buttonOff]}
      >
        <Text style={[styles.buttonText, (!agreed || busy) && styles.buttonTextOff]}>
          {busy ? 'One moment…' : 'Enter Spiritly  →'}
        </Text>
      </Pressable>
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
  inner: { padding: 26, paddingTop: 66, paddingBottom: 70 },
  glow: { position: 'absolute', alignSelf: 'center', backgroundColor: GOLD, borderRadius: 9999 },
  glow1: { width: 520, height: 520, top: -280, opacity: 0.05 },

  title: { fontFamily: 'serif', fontSize: 32, color: TEXT, lineHeight: 40, marginBottom: 18 },
  lede: {
    fontFamily: 'serif',
    fontSize: 15.5,
    fontStyle: 'italic',
    color: MUTED,
    lineHeight: 24,
    marginBottom: 36,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(21,27,35,0.5)',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 12,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(138,149,163,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { borderColor: GOLD },
  tick: { color: GOLD, fontSize: 13, fontWeight: '700' },
  rowText: { flex: 1, fontSize: 15, color: TEXT, lineHeight: 22 },
  link: { color: GOLD },

  footnote: { fontSize: 12, color: 'rgba(138,149,163,0.75)', lineHeight: 19, marginTop: 20 },

  button: {
    marginTop: 40,
    backgroundColor: GOLD,
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: 'center',
  },
  buttonOff: { backgroundColor: SURFACE },
  buttonText: { fontSize: 15.5, fontWeight: '600', color: BG, letterSpacing: 0.5 },
  buttonTextOff: { color: MUTED },
});