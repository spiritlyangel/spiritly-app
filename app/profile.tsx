import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

function ageFrom(d: Date) {
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a;
}

// Accepts DD/MM/YYYY. Returns a Date only if the whole thing is real.
function parseBirthday(s: string): Date | null {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (
    d.getFullYear() !== Number(yyyy) ||
    d.getMonth() !== Number(mm) - 1 ||
    d.getDate() !== Number(dd)
  )
    return null;
  if (d > new Date()) return null;
  return d;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const initial = name.trim().charAt(0).toUpperCase();
  const parsed = parseBirthday(birthday);
  const canContinue = name.trim().length > 0 && parsed !== null && !busy;

  // Format as they type: 01011990 -> 01/01/1990
  const onBirthdayChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    let out = digits;
    if (digits.length > 4) out = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) out = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setBirthday(out);
    setError('');
  };

  const handleContinue = async () => {
    if (!canContinue || !parsed) return;

    if (ageFrom(parsed) < 18) {
      setError('Spiritly is for those eighteen and over. Thank you for understanding.');
      return;
    }

    setBusy(true);
    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        await updateDoc(doc(db, 'users', uid), {
          firstName: name.trim(),
          birthday: parsed.toISOString().slice(0, 10),
          age: ageFrom(parsed),
        });
      } catch (e) {
        console.log('Could not save profile', e);
      }
    }
    router.replace('/consent');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <View style={[styles.glow, styles.glow1]} />

      <Text style={styles.title}>What should we call you?</Text>

      <View style={styles.avatarWrap}>
        <View style={styles.avatarGlow} />
        <View style={styles.avatar}>
          {initial ? (
            <Text style={styles.initial}>{initial}</Text>
          ) : (
            <View style={styles.emptyDot} />
          )}
        </View>
      </View>

      <Text style={styles.label}>FIRST NAME</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your first name"
        placeholderTextColor="#5A626E"
        autoCapitalize="words"
        editable={!busy}
        style={styles.input}
      />
      <Text style={styles.hint}>
        Just your first name is enough. Spiritly is about who you&apos;re becoming, not how you
        appear.
      </Text>

      <Text style={[styles.label, { marginTop: 30 }]}>BIRTHDAY</Text>
      <TextInput
        value={birthday}
        onChangeText={onBirthdayChange}
        placeholder="DD / MM / YYYY"
        placeholderTextColor="#5A626E"
        keyboardType="number-pad"
        editable={!busy}
        style={styles.input}
      />
      <Text style={styles.hint}>
        Spiritly is for those eighteen and over. We ask once and never show it to anyone.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        onPress={handleContinue}
        disabled={!canContinue}
        style={[styles.button, !canContinue && styles.buttonOff]}
      >
        <Text style={[styles.buttonText, !canContinue && styles.buttonTextOff]}>
          {busy ? 'One moment…' : 'Continue  →'}
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
  glow1: { width: 520, height: 520, top: -270, opacity: 0.05 },

  title: { fontFamily: 'serif', fontSize: 32, color: TEXT, lineHeight: 40, marginBottom: 34 },

  avatarWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 40, height: 130 },
  avatarGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: GOLD,
    opacity: 0.09,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { fontFamily: 'serif', fontSize: 40, color: GOLD },
  emptyDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: GOLD, opacity: 0.7 },

  label: { fontSize: 10, fontWeight: '700', letterSpacing: 2.5, color: MUTED, marginBottom: 9 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(21,27,35,0.6)',
    borderRadius: 999,
    color: TEXT,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
  },
  hint: {
    fontFamily: 'serif',
    fontSize: 13.5,
    fontStyle: 'italic',
    color: MUTED,
    lineHeight: 20,
    marginTop: 12,
  },
  error: { color: '#E05C5C', fontSize: 13, lineHeight: 19, marginTop: 18 },

  button: {
    marginTop: 44,
    backgroundColor: GOLD,
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: 'center',
  },
  buttonOff: { backgroundColor: SURFACE },
  buttonText: { fontSize: 15.5, fontWeight: '600', color: BG, letterSpacing: 0.5 },
  buttonTextOff: { color: MUTED },
});