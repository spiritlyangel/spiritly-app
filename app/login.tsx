import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = email.trim() && password && !busy;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError('');

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      const data = snap.data();

      if (data?.semLevel != null) {
        router.replace({
          pathname: '/home',
          params: {
            sem: String(data.semLevel),
            life: data.lifeSeason ?? '',
            days: data.days ?? '',
          },
        });
      } else {
        router.replace('/onboarding');
      }
    } catch (e: any) {
      const code = e?.code ?? '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password')
        setError('That email and password do not match.');
      else if (code === 'auth/user-not-found') setError('No account found for that email.');
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
        <Text style={styles.title}>Welcome back.</Text>
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
        secureTextEntry
        autoCapitalize="none"
        editable={!busy}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        onPress={handleLogin}
        disabled={!canSubmit}
        style={[styles.button, !canSubmit && styles.buttonOff]}
      >
        <Text style={[styles.buttonText, !canSubmit && styles.buttonTextOff]}>
          {busy ? 'Signing in…' : 'Sign in'}
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
  backArrow: { color: MUTED, fontSize: 18 },
  header: { marginTop: 40, marginBottom: 36 },
  title: { fontFamily: 'serif', fontSize: 30, color: TEXT, lineHeight: 36 },
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
  button: { backgroundColor: GOLD, borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  buttonOff: { backgroundColor: SURFACE },
  buttonText: { fontSize: 15, fontWeight: '600', color: BG, letterSpacing: 0.5 },
  buttonTextOff: { color: MUTED },
  error: { color: '#E05C5C', fontSize: 13, lineHeight: 19, marginBottom: 16 },
});