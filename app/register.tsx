import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = email.trim() && password.length >= 6 && !busy;

  const handleRegister = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError('');

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

      await setDoc(doc(db, 'users', cred.user.uid), {
        email: email.trim(),
        createdAt: new Date().toISOString(),
        firstName: null,
        birthday: null,
        semLevel: null,
        lifeSeason: null,
        days: null,
      });

      router.replace('/profile');
    } catch (e: any) {
      const code = e?.code ?? '';
      if (code === 'auth/email-already-in-use') setError('That email is already registered.');
      else if (code === 'auth/invalid-email') setError('That email address does not look right.');
      else if (code === 'auth/weak-password') setError('Please use at least 6 characters.');
      else setError(e.message ?? 'Something went wrong. Please try again.');
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <View style={[styles.glow, styles.glow1]} />

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Let&apos;s begin.</Text>
        <Text style={styles.subtitle}>
          Your reflections are yours. We will never sell them or show you ads.
        </Text>
      </View>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor="#5A626E"
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!busy}
        style={styles.input}
      />

      <Text style={styles.label}>PASSWORD</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="At least 6 characters"
        placeholderTextColor="#5A626E"
        secureTextEntry
        autoCapitalize="none"
        editable={!busy}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        onPress={handleRegister}
        disabled={!canSubmit}
        style={[styles.button, !canSubmit && styles.buttonOff]}
      >
        <Text style={[styles.buttonText, !canSubmit && styles.buttonTextOff]}>
          {busy ? 'Creating your account…' : 'Create account'}
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
  inner: { padding: 24, paddingTop: 56, paddingBottom: 60 },
  glow: { position: 'absolute', alignSelf: 'center', backgroundColor: GOLD, borderRadius: 9999 },
  glow1: { width: 520, height: 520, top: -260, opacity: 0.05 },
  backButton: { width: 32, height: 32, justifyContent: 'center' },
  header: { marginTop: 40, marginBottom: 36 },
  title: { fontFamily: 'serif', fontSize: 30, color: TEXT, lineHeight: 36 },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 12, lineHeight: 21 },
  backArrow: { color: MUTED, fontSize: 18 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: MUTED, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(21,27,35,0.6)',
    borderRadius: 10,
    color: TEXT,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 22,
  },
  consentRow: { flexDirection: 'row', gap: 12, marginTop: 4, marginBottom: 24 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(42,50,61,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxOn: { borderColor: GOLD, backgroundColor: GOLD },
  checkmark: { color: BG, fontSize: 13, fontWeight: '700' },
  consentText: { flex: 1, fontSize: 12.5, color: MUTED, lineHeight: 19 },
  button: { backgroundColor: GOLD, borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  buttonOff: { backgroundColor: SURFACE },
  buttonText: { fontSize: 15, fontWeight: '600', color: BG, letterSpacing: 0.5 },
  buttonTextOff: { color: MUTED },
  error: { color: '#E05C5C', fontSize: 13, lineHeight: 19, marginBottom: 16 },
});