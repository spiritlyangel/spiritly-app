import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { rollingStage } from '../lib/formation';
import { dayOf } from '../lib/day';

const DIMENSIONS = [
  { key: 'Spirit', letter: 'S', blurb: 'Scripture, prayer, the interior life' },
  { key: 'Physical', letter: 'P', blurb: 'Your body, your health, your home' },
  { key: 'Intellect', letter: 'I', blurb: 'Learning, skill, wisdom' },
  { key: 'Relationship', letter: 'R', blurb: 'Family, friendship, community' },
  { key: 'Income', letter: 'I', blurb: 'Work, provision, stewardship' },
  { key: 'Transcendence', letter: 'T', blurb: 'Service, legacy, purpose beyond yourself' },
];

const STAGE_NAME: Record<number, string> = {
  0: 'Finding your feet',
  1: 'Steadying',
  2: 'Growing',
  3: 'Giving it away',
};

const STAGE_NOTE: Record<number, string> = {
  0: 'You are carrying a great deal right now. Presence is enough.',
  1: 'You are showing up, and that is the harder half.',
  2: 'There is room in you for more than you are asking of yourself.',
  3: 'Your attention has begun turning outward. That is the fruit.',
};

type Row = { key: string; letter: string; blurb: string; count: number; share: number };

export default function SpiritScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [stage, setStage] = useState(1);
  const [days, setDays] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [done, setDone] = useState(0);
  const [quiet, setQuiet] = useState<string | null>(null);
  const [enough, setEnough] = useState(false);

  useEffect(() => {
    const load = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) { setLoading(false); return; }

      try {
        const snap = await getDocs(
          query(collection(db, 'users', uid, 'reflections'), orderBy('createdAt', 'desc'))
        );
        const all = snap.docs.map((d) => d.data() as any);

        // how often each dimension has come up — recent sessions weigh most
        const recent = all.slice(0, 21);
        const counts: Record<string, number> = {};
        DIMENSIONS.forEach((d) => (counts[d.key] = 0));
        recent.forEach((r) => (r.dimensions ?? []).forEach((d: string) => {
          if (d in counts) counts[d] += 1;
        }));
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

        const built = DIMENSIONS.map((d) => ({
          ...d,
          count: counts[d.key],
          share: counts[d.key] / total,
        }));
        setRows(built);

        // the one that has gone quiet — only worth saying once there is a pattern
        const touched = built.filter((d) => d.count > 0).length;
        if (recent.length >= 5 && touched >= 2) {
          const silent = built.filter((d) => d.count === 0);
          if (silent.length) setQuiet(silent[0].key);
        }

        const scores = all.map((r) => r.assessedStage).filter((n) => typeof n === 'number');
        setStage(rollingStage(scores));
        setEnough(scores.length >= 3);

        setSessions(all.length);
        setDays(new Set(all.map((r) => dayOf(r.createdAt))).size);
        setDone(all.reduce((n, r) => n + (r.checked ?? []).filter(Boolean).length, 0));
      } catch (e) {
        console.log('Could not load SPIRIT data', e);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.loadingText}>One moment…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <View style={[styles.glow, styles.glow1]} />

      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      <Text style={styles.title}>Your SPIRIT</Text>
      <Text style={styles.lede}>
        Where your conversations have actually been going — not where you meant them to go.
      </Text>

      {/* Stage */}
      <View style={styles.stageCard}>
        <Text style={styles.cardLabel}>WHERE YOU ARE</Text>
        <Text style={styles.stageName}>{STAGE_NAME[stage]}</Text>
        <Text style={styles.stageNote}>
          {enough
            ? STAGE_NOTE[stage]
            : 'Still early. A few more mornings and this will mean something.'}
        </Text>
      </View>

      {/* Dimensions */}
      <Text style={[styles.cardLabel, { marginTop: 34, marginBottom: 16 }]}>
        THE SIX DIMENSIONS
      </Text>

      {sessions === 0 ? (
        <Text style={styles.empty}>
          Nothing here yet. Have a conversation and this begins to fill.
        </Text>
      ) : (
        rows.map((d) => (
          <View key={d.key + d.letter} style={styles.dimRow}>
            <Text style={styles.dimLetter}>{d.letter}</Text>
            <View style={styles.dimBody}>
              <View style={styles.dimHead}>
                <Text style={styles.dimName}>{d.key}</Text>
                <Text style={styles.dimCount}>
                  {d.count === 0 ? 'not yet' : `${d.count}×`}
                </Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${Math.max(d.share * 100, d.count ? 4 : 0)}%` },
                  ]}
                />
              </View>
              <Text style={styles.dimBlurb}>{d.blurb}</Text>
            </View>
          </View>
        ))
      )}

      {/* The quiet one */}
      {quiet && (
        <View style={styles.quietCard}>
          <Text style={styles.quietLabel}>ONE THING</Text>
          <Text style={styles.quietText}>
            {quiet} has not come up in a while. Not a failing — just worth noticing.
          </Text>
        </View>
      )}

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{days}</Text>
          <Text style={styles.statLabel}>days walked</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{sessions}</Text>
          <Text style={styles.statLabel}>conversations</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{done}</Text>
          <Text style={styles.statLabel}>steps taken</Text>
        </View>
      </View>

      <Text style={styles.footnote}>
        Spiritly reads each conversation and names which part of life it was really about. Nothing
        here was entered by you.
      </Text>
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
  center: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: MUTED, fontFamily: 'serif', fontStyle: 'italic' },
  inner: { padding: 24, paddingTop: 58, paddingBottom: 70 },
  glow: { position: 'absolute', alignSelf: 'center', backgroundColor: GOLD, borderRadius: 9999 },
  glow1: { width: 520, height: 520, top: -280, opacity: 0.05 },

  back: { width: 32, height: 32, justifyContent: 'center' },
  backArrow: { color: MUTED, fontSize: 18 },

  title: { fontFamily: 'serif', fontSize: 32, color: TEXT, marginTop: 26 },
  lede: { fontSize: 14, color: MUTED, lineHeight: 21, marginTop: 10, marginBottom: 30 },

  cardLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: MUTED },

  stageCard: {
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    backgroundColor: 'rgba(21,27,35,0.7)',
    borderRadius: 18,
    padding: 22,
  },
  stageName: { fontFamily: 'serif', fontSize: 27, color: GOLD, marginTop: 12 },
  stageNote: { fontSize: 14, color: MUTED, lineHeight: 21, marginTop: 8 },

  empty: { fontSize: 14, color: MUTED, fontStyle: 'italic', lineHeight: 21 },

  dimRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  dimLetter: {
    fontFamily: 'serif',
    fontSize: 22,
    color: GOLD,
    width: 20,
    textAlign: 'center',
    marginTop: -2,
  },
  dimBody: { flex: 1 },
  dimHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  dimName: { fontSize: 15, color: TEXT, fontWeight: '600' },
  dimCount: { fontSize: 12, color: MUTED },
  track: {
    height: 4,
    backgroundColor: SURFACE,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  fill: { height: '100%', backgroundColor: GOLD, borderRadius: 2 },
  dimBlurb: { fontSize: 12.5, color: 'rgba(138,149,163,0.75)', marginTop: 7 },

  quietCard: {
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.22)',
    backgroundColor: 'rgba(201,168,76,0.06)',
    borderRadius: 14,
    padding: 18,
    marginTop: 12,
  },
  quietLabel: { fontSize: 9.5, fontWeight: '700', letterSpacing: 2, color: GOLD },
  quietText: {
    fontFamily: 'serif',
    fontSize: 15.5,
    color: 'rgba(234,228,216,0.9)',
    lineHeight: 23,
    marginTop: 10,
  },

  stats: { flexDirection: 'row', gap: 10, marginTop: 30 },
  stat: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statNum: { fontFamily: 'serif', fontSize: 28, color: GOLD },
  statLabel: { fontSize: 11, color: MUTED, marginTop: 4, letterSpacing: 0.3 },

  footnote: {
    fontSize: 12.5,
    color: '#6A727E',
    lineHeight: 19,
    marginTop: 28,
    fontStyle: 'italic',
  },
});
