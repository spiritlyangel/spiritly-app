import { SpiritlyLogo } from '@/components/SpiritlyLogo';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Ambient sacred glow — layered circles create the radial falloff */}
      <View style={[styles.glow, styles.glow1]} />
      <View style={[styles.glow, styles.glow2]} />
      <View style={[styles.glow, styles.glow3]} />

      <View style={styles.content}>
        <View style={styles.spacer} />
        <View style={styles.center}>
          {/* Logo placeholder — we'll swap in your real SpiritlyLogo next */}
          <View style={styles.logoMark}>
            <SpiritlyLogo size={96} />
          </View>
          <Text style={styles.wordmark}>
            Spirit<Text style={styles.wordmarkAccent}>ly</Text>
          </Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>You were never meant to journey alone.</Text>
          <Pressable style={styles.beginButton} onPress={() => router.push('/register')}>
            <Text style={styles.beginText}>BEGIN</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/login')} style={styles.signInLink}>
            <Text style={styles.signInText}>Already have an account? Sign in</Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
}

const GOLD = '#C9A84C';
const BG = '#0B0E14';
const TEXT = '#EAE4D8';
const MUTED = '#7A828E';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: GOLD,
    borderRadius: 9999,
  },
  glow1: {
    width: 620,
    height: 620,
    top: '10%',
    opacity: 0.045,
  },
  glow2: {
    width: 420,
    height: 420,
    top: '18%',
    opacity: 0.05,
  },
  glow3: {
    width: 240,
    height: 240,
    top: '26%',
    opacity: 0.06,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  spacer: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
  },
  logoMark: {
    marginBottom: 40,
  },
  wordmark: {
    fontFamily: 'serif',
    fontSize: 46,
    color: TEXT,
    letterSpacing: 2,
    textAlign: 'center',
  },
  wordmarkAccent: {
    color: GOLD,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    width: 64,
    backgroundColor: 'rgba(201,168,76,0.5)',
    marginTop: 22,
  },
  tagline: {
    fontFamily: 'serif',
    fontSize: 15,
    fontStyle: 'italic',
    color: 'rgba(234,228,216,0.8)',
    marginTop: 22,
  },
  beginButton: {
    marginTop: 48,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.6)',
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderRadius: 999,
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  beginText: {
    fontFamily: 'serif',
    fontSize: 13,
    color: GOLD,
    letterSpacing: 4,
  },
  signInLink: { 
    marginTop: 22 
  },
  signInText: { 
    fontSize: 12.5, 
    color: 'rgba(138,149,163,0.9)' 
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
  },
  footerText: {
    fontSize: 11,
    color: MUTED,
    letterSpacing: 4,
  },
});