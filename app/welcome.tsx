import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SpiritlyLogo } from '../components/SpiritlyLogo';

export default function WelcomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string>>();

  const fadeMark = useRef(new Animated.Value(0)).current;
  const fadeOne = useRef(new Animated.Value(0)).current;
  const fadeTwo = useRef(new Animated.Value(0)).current;
  const fadeThree = useRef(new Animated.Value(0)).current;
  const fadeFour = useRef(new Animated.Value(0)).current;
  const fadeRest = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const step = (v: Animated.Value, delay: number) =>
      Animated.timing(v, { toValue: 1, duration: 700, delay, useNativeDriver: true });

    Animated.parallel([
      step(fadeMark, 200),
      step(fadeOne, 1000),
      step(fadeTwo, 1650),
      step(fadeThree, 2300),
      step(fadeFour, 2950),
      step(fadeRest, 3800),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.glow, styles.glow1]} />
      <View style={[styles.glow, styles.glow2]} />

      <View style={styles.inner}>
        <Animated.View style={{ opacity: fadeMark, alignItems: 'center' }}>
          <SpiritlyLogo size={64} />
          <Text style={styles.wordmark}>
            Spirit<Text style={styles.accent}>ly</Text>
          </Text>
          <Text style={styles.caption}>The last two letters carry the whole of it.</Text>
        </Animated.View>

        <View style={styles.lines}>
          <Animated.Text style={[styles.line, { opacity: fadeOne }]}>
            Love <Text style={styles.accent}>Yahweh</Text>.
          </Animated.Text>
          <Animated.Text style={[styles.line, { opacity: fadeTwo }]}>
            Love <Text style={styles.accent}>yourself</Text>.
          </Animated.Text>
          <Animated.Text style={[styles.line, { opacity: fadeThree }]}>
            Love your <Text style={styles.accent}>neighbour</Text>.
          </Animated.Text>
          <Animated.Text style={[styles.line, { opacity: fadeFour }]}>
            Love the one in front of <Text style={styles.accent}>you</Text>.
          </Animated.Text>
        </View>

        <Animated.View style={{ opacity: fadeRest, alignItems: 'center' }}>
          <View style={styles.rule} />
          <Text style={styles.verse}>
            &ldquo;Love the Lord your God with all your heart. Love your neighbour as
            yourself.&rdquo;
          </Text>
          <Text style={styles.ref}>Matthew 22:37&ndash;39</Text>

          <Pressable
            onPress={() => router.replace({ pathname: '/onboarding', params })}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Begin</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const GOLD = '#C9A84C';
const BG = '#0B0E14';
const MUTED = '#8A95A3';
const TEXT = '#EAE4D8';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, overflow: 'hidden' },
  glow: { position: 'absolute', alignSelf: 'center', backgroundColor: GOLD, borderRadius: 9999 },
  glow1: { width: 560, height: 560, top: -260, opacity: 0.05 },
  glow2: { width: 300, height: 300, top: -160, opacity: 0.05 },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 90,
    paddingBottom: 50,
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: 'serif',
    fontSize: 38,
    color: TEXT,
    letterSpacing: 1,
    marginTop: 22,
  },
  accent: { color: GOLD, fontStyle: 'italic' },
  caption: {
    fontSize: 13,
    color: MUTED,
    marginTop: 12,
    textAlign: 'center',
  },
  lines: { marginTop: 44, marginBottom: 38, alignSelf: 'stretch' },
  line: {
    fontFamily: 'serif',
    fontSize: 23,
    color: 'rgba(234,228,216,0.92)',
    textAlign: 'center',
    marginBottom: 13,
    lineHeight: 31,
  },
  rule: { width: 44, height: 1, backgroundColor: 'rgba(201,168,76,0.45)', marginBottom: 22 },
  verse: {
    fontFamily: 'serif',
    fontSize: 14.5,
    fontStyle: 'italic',
    color: 'rgba(234,228,216,0.72)',
    textAlign: 'center',
    lineHeight: 22,
  },
  ref: { fontSize: 12, color: MUTED, marginTop: 10, letterSpacing: 0.5 },
  button: {
    marginTop: 44,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.55)',
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 44,
  },
  buttonText: { fontFamily: 'serif', fontSize: 15, color: GOLD, letterSpacing: 3 },
});