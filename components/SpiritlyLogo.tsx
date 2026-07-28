import Svg, { Path, Circle, G } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export function SpiritlyLogo({ size = 96, color = '#C9A84C' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* upward sacred arc */}
      <Path
        d="M14 86 Q60 24 106 86"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        opacity={0.55}
      />

      {/* halo */}
      <Circle cx={60} cy={54} r={30} stroke={color} strokeWidth={0.6} opacity={0.25} />

      {/* dove body — cross silhouette */}
      <G stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <Path d="M60 28 V78" />
        <Path d="M32 56 Q46 44 60 52 Q74 44 88 56" />
        <Path d="M40 64 Q60 76 80 64" opacity={0.75} />
        <Path d="M54 82 L60 78 L66 82" opacity={0.9} />
      </G>

      {/* head */}
      <Circle cx={60} cy={30} r={3.4} fill={color} />
    </Svg>
  );
}