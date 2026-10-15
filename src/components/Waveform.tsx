// src/components/Waveform.tsx
interface Props {
  active: boolean;
}

export default function Waveform({ active }: Props) {
  const heights = [4, 8, 14, 10, 18, 12, 20, 16, 20, 14, 18, 10, 14, 8, 4];
  return (
    <div className="flex items-center gap-[2px] h-6">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`bg-[#5B5BD6] rounded-full origin-center transition-transform ${active ? 'wave-bar' : ''}`}
          style={{
            width: '3px',
            height: `${active ? h : Math.max(4, h * 0.3)}px`,
            opacity: active ? 1 : 0.35,
          }}
        />
      ))}
    </div>
  );
}
