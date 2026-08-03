import React, { useEffect, useState, useMemo } from 'react';

const GOLD = "rgba(198,164,69,";
const DARK = "rgba(12,10,16,";

export function LargeDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="w-full flex items-center justify-center my-1" style={{ transform: flip ? "scaleY(-1)" : undefined }}>
      <svg width="340" height="56" viewBox="0 0 340 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="27" x2="88" y2="27" stroke={`${GOLD}0.30)`} strokeWidth="0.6" />
        <line x1="0" y1="29" x2="72" y2="29" stroke={`${GOLD}0.15)`} strokeWidth="0.5" />
        {[22, 40, 58, 74].map(x => (
          <line key={x} x1={x} y1="24" x2={x} y2="32" stroke={`${GOLD}0.28)`} strokeWidth="0.6" />
        ))}
        <path d="M88 28 L93 23 L98 28 L93 33 Z" fill={`${GOLD}0.50)`} />
        <path d="M90 28 L93 25 L96 28 L93 31 Z" fill={`${GOLD}0.20)`} />
        <path d="M98 28 Q112 28 118 20 L126 11" stroke={`${GOLD}0.45)`} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M118 20 Q121 17 119 14 Q117 11 120 10" stroke={`${GOLD}0.28)`} strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M124 12 L126 11 L124 10" stroke={`${GOLD}0.45)`} strokeWidth="0.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M98 28 Q112 28 118 36 L126 45" stroke={`${GOLD}0.35)`} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M118 36 Q121 39 119 42 Q117 45 120 46" stroke={`${GOLD}0.22)`} strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M124 44 L126 45 L124 46" stroke={`${GOLD}0.35)`} strokeWidth="0.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {[0, 60, 120].map(deg => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={136 + 6 * Math.cos(rad)}
              y1={28 + 6 * Math.sin(rad)}
              x2={136 - 6 * Math.cos(rad)}
              y2={28 - 6 * Math.sin(rad)}
              stroke={`${GOLD}0.45)`}
              strokeWidth="0.7"
            />
          );
        })}
        <circle cx="136" cy="28" r="2" fill={`${GOLD}0.5)`} />
        <circle cx="136" cy="28" r="4" fill="none" stroke={`${GOLD}0.25)`} strokeWidth="0.6" />
        <circle cx="170" cy="28" r="16" fill="none" stroke={`${GOLD}0.22)`} strokeWidth="0.7" strokeDasharray="2 4" />
        <circle cx="170" cy="28" r="10" fill="none" stroke={`${GOLD}0.30)`} strokeWidth="0.8" />
        {[0, 90, 180, 270].map(deg => {
          const rad = ((deg - 90) * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={170 + 10 * Math.cos(rad)}
              y1={28 + 10 * Math.sin(rad)}
              x2={170 + 13 * Math.cos(rad)}
              y2={28 + 13 * Math.sin(rad)}
              stroke={`${GOLD}0.5)`}
              strokeWidth="0.9"
            />
          );
        })}
        <text x="160" y="33" fontSize="12" fill={`${GOLD}0.72)`} fontFamily="serif" textAnchor="middle">☽</text>
        <circle cx="170" cy="28" r="2.5" fill="none" stroke={`${GOLD}0.6)`} strokeWidth="0.8" />
        <circle cx="170" cy="28" r="1" fill={`${GOLD}0.6)`} />
        <text x="180" y="33" fontSize="12" fill={`${GOLD}0.72)`} fontFamily="serif" textAnchor="middle">☾</text>
        <circle cx="204" cy="28" r="2" fill={`${GOLD}0.5)`} />
        <circle cx="204" cy="28" r="4" fill="none" stroke={`${GOLD}0.25)`} strokeWidth="0.6" />
        {[0, 60, 120].map(deg => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={204 + 6 * Math.cos(rad)}
              y1={28 + 6 * Math.sin(rad)}
              x2={204 - 6 * Math.cos(rad)}
              y2={28 - 6 * Math.sin(rad)}
              stroke={`${GOLD}0.45)`}
              strokeWidth="0.7"
            />
          );
        })}
        <path d="M242 28 Q228 28 222 20 L214 11" stroke={`${GOLD}0.45)`} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M222 20 Q219 17 221 14 Q223 11 220 10" stroke={`${GOLD}0.28)`} strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M216 12 L214 11 L216 10" stroke={`${GOLD}0.45)`} strokeWidth="0.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M242 28 Q228 28 222 36 L214 45" stroke={`${GOLD}0.35)`} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M222 36 Q219 39 221 42 Q223 45 220 46" stroke={`${GOLD}0.22)`} strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M216 44 L214 45 L216 46" stroke={`${GOLD}0.35)`} strokeWidth="0.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M242 28 L247 23 L252 28 L247 33 Z" fill={`${GOLD}0.50)`} />
        <path d="M244 28 L247 25 L250 28 L247 31 Z" fill={`${GOLD}0.20)`} />
        {[266, 282, 300, 318].map(x => (
          <line key={x} x1={x} y1="24" x2={x} y2="32" stroke={`${GOLD}0.28)`} strokeWidth="0.6" />
        ))}
        <line x1="252" y1="27" x2="340" y2="27" stroke={`${GOLD}0.30)`} strokeWidth="0.6" />
        <line x1="268" y1="29" x2="340" y2="29" stroke={`${GOLD}0.15)`} strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export function MediumDivider({ glyph = "✦" }: { glyph?: string }) {
  return (
    <div className="w-full flex items-center my-2">
      <svg width="100%" height="22" viewBox="0 0 320 22" fill="none" preserveAspectRatio="none">
        <line x1="0" y1="10" x2="130" y2="10" stroke={`${GOLD}0.30)`} strokeWidth="0.7" />
        <line x1="0" y1="12" x2="110" y2="12" stroke={`${GOLD}0.14)`} strokeWidth="0.5" />
        {[30, 60, 90].map(x => (
          <line key={x} x1={x} y1="8" x2={x} y2="14" stroke={`${GOLD}0.22)`} strokeWidth="0.6" />
        ))}
        <circle cx="135" cy="11" r="1.5" fill={`${GOLD}0.45)`} />
        <path d="M143 11 L146 8 L149 11 L146 14 Z" fill={`${GOLD}0.35)`} />
        <text x="160" y="16" fontSize="11" fill={`${GOLD}0.65)`} fontFamily="serif" textAnchor="middle">{glyph}</text>
        <path d="M171 11 L174 8 L177 11 L174 14 Z" fill={`${GOLD}0.35)`} />
        <circle cx="185" cy="11" r="1.5" fill={`${GOLD}0.45)`} />
        {[230, 260, 290].map(x => (
          <line key={x} x1={x} y1="8" x2={x} y2="14" stroke={`${GOLD}0.22)`} strokeWidth="0.6" />
        ))}
        <line x1="190" y1="10" x2="320" y2="10" stroke={`${GOLD}0.30)`} strokeWidth="0.7" />
        <line x1="210" y1="12" x2="320" y2="12" stroke={`${GOLD}0.14)`} strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export function ParchmentHeaderOrnament() {
  return (
    <div className="flex items-center justify-center mb-4">
      <svg width="160" height="26" viewBox="0 0 160 26" fill="none">
        <line x1="0" y1="12" x2="54" y2="12" stroke={`${DARK}0.22)`} strokeWidth="0.7" />
        <line x1="0" y1="14" x2="42" y2="14" stroke={`${DARK}0.12)`} strokeWidth="0.5" />
        {[14, 28].map(x => (
          <line key={x} x1={x} y1="10" x2={x} y2="16" stroke={`${DARK}0.18)`} strokeWidth="0.6" />
        ))}
        <path d="M54 13 Q62 13 66 8 L70 3" stroke={`${DARK}0.28)`} strokeWidth="0.7" fill="none" strokeLinecap="round" />
        <path d="M66 8 Q68 6 66 4 Q65 2 67 1" stroke={`${DARK}0.18)`} strokeWidth="0.5" fill="none" strokeLinecap="round" />
        <path d="M54 13 Q62 13 66 18 L70 23" stroke={`${DARK}0.20)`} strokeWidth="0.7" fill="none" strokeLinecap="round" />
        <path d="M66 18 Q68 20 66 22 Q65 24 67 25" stroke={`${DARK}0.12)`} strokeWidth="0.5" fill="none" strokeLinecap="round" />
        {[0, 45, 90, 135].map(deg => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={80 + 7 * Math.cos(rad)}
              y1={13 + 7 * Math.sin(rad)}
              x2={80 - 7 * Math.cos(rad)}
              y2={13 - 7 * Math.sin(rad)}
              stroke={`${DARK}0.35)`}
              strokeWidth="0.8"
            />
          );
        })}
        <circle cx="80" cy="13" r="3.5" fill="none" stroke={`${DARK}0.30)`} strokeWidth="0.7" />
        <circle cx="80" cy="13" r="1.5" fill={`${DARK}0.35)`} />
        {[0, 90, 180, 270].map(deg => {
          const rad = (deg * Math.PI) / 180;
          return <circle key={deg} cx={80 + 9 * Math.cos(rad)} cy={13 + 9 * Math.sin(rad)} r="1" fill={`${DARK}0.25)`} />;
        })}
        <path d="M106 13 Q98 13 94 8 L90 3" stroke={`${DARK}0.28)`} strokeWidth="0.7" fill="none" strokeLinecap="round" />
        <path d="M94 8 Q92 6 94 4 Q95 2 93 1" stroke={`${DARK}0.18)`} strokeWidth="0.5" fill="none" strokeLinecap="round" />
        <path d="M106 13 Q98 13 94 18 L90 23" stroke={`${DARK}0.20)`} strokeWidth="0.7" fill="none" strokeLinecap="round" />
        <path d="M94 18 Q92 20 94 22 Q95 24 93 25" stroke={`${DARK}0.12)`} strokeWidth="0.5" fill="none" strokeLinecap="round" />
        {[132, 146].map(x => (
          <line key={x} x1={x} y1="10" x2={x} y2="16" stroke={`${DARK}0.18)`} strokeWidth="0.6" />
        ))}
        <line x1="106" y1="12" x2="160" y2="12" stroke={`${DARK}0.22)`} strokeWidth="0.7" />
        <line x1="118" y1="14" x2="160" y2="14" stroke={`${DARK}0.12)`} strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export function CardCorners({ color = `${GOLD}0.42)` }: { color?: string }) {
  const Corner = ({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      ...(pos[0] === 't' ? { top: 7 } : { bottom: 7 }),
      ...(pos[1] === 'l' ? { left: 7 } : { right: 7 }),
    };
    const scaleX = pos[1] === 'r' ? -1 : 1;
    const scaleY = pos[0] === 'b' ? -1 : 1;

    return (
      <svg style={{ ...style, transform: `scale(${scaleX},${scaleY})` }} width="22" height="22" viewBox="0 0 22 22" fill="none">
        <line x1="3" y1="3" x2="18" y2="3" stroke={color} strokeWidth="0.8" />
        <line x1="3" y1="3" x2="3" y2="18" stroke={color} strokeWidth="0.8" />
        <line x1="6" y1="6" x2="14" y2="6" stroke={color} strokeWidth="0.6" />
        <line x1="6" y1="6" x2="6" y2="14" stroke={color} strokeWidth="0.6" />
        <circle cx="3" cy="3" r="1.5" fill={color} />
        <path d="M14 6 Q14 14 6 14" stroke={color} strokeWidth="0.5" fill="none" />
        <path d="M11 3 L12.5 4.5 L11 6 L9.5 4.5 Z" fill={color} />
        <path d="M3 11 L4.5 12.5 L3 14 L1.5 12.5 Z" fill={color} />
        <line x1="17" y1="1.5" x2="17" y2="5" stroke={color} strokeWidth="0.6" />
        <line x1="1.5" y1="17" x2="5" y2="17" stroke={color} strokeWidth="0.6" />
      </svg>
    );
  };

  return (
    <>
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />
    </>
  );
}

export function GrimoireCard({
  label,
  roman,
  children,
  style
}: {
  label: string;
  roman?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="relative flex flex-col"
      style={{
        background: "linear-gradient(160deg, #0c0a10 0%, #110e18 100%)",
        border: "1px solid rgba(198,164,69,0.28)",
        ...style
      }}
    >
      <div style={{ position: "absolute", inset: 5, border: "1px solid rgba(198,164,69,0.07)", pointerEvents: "none", zIndex: 0 }} />
      {(["tl", "tr", "bl", "br"] as const).map(p => (
        <svg
          key={p}
          style={{
            position: "absolute",
            ...(p[0] === "t" ? { top: 3 } : { bottom: 3 }),
            ...(p[1] === "l" ? { left: 3 } : { right: 3 }),
            transform: `scale(${p[1] === "r" ? -1 : 1}, ${p[0] === "b" ? -1 : 1})`
          }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <line x1="2" y1="2" x2="12" y2="2" stroke={`${GOLD}0.45)`} strokeWidth="0.8" />
          <line x1="2" y1="2" x2="2" y2="12" stroke={`${GOLD}0.45)`} strokeWidth="0.8" />
          <circle cx="2" cy="2" r="1.5" fill={`${GOLD}0.5)`} />
          <path d="M9 2 Q9 9 2 9" stroke={`${GOLD}0.22)`} strokeWidth="0.5" fill="none" />
        </svg>
      ))}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-4 pb-2 px-4">
        {roman && <span className="font-cinzel text-[10px]" style={{ color: `${GOLD}0.30)` }}>{roman}</span>}
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}0.18))` }} />
        <p className="font-cinzel tracking-[0.22em] text-[11px] uppercase shrink-0" style={{ color: `${GOLD}0.60)` }}>{label}</p>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(270deg, transparent, ${GOLD}0.18))` }} />
        {roman && <span className="font-cinzel text-[10px]" style={{ color: `${GOLD}0.30)` }}>{roman}</span>}
      </div>
      <div className="relative z-10 flex-1 flex flex-col px-4 pb-4">
        {children}
      </div>
    </div>
  );
}

export function MobileGrimoireCard({
  label,
  roman,
  id,
  children
}: {
  label: string;
  roman?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="relative flex flex-col w-full"
      style={{
        background: "linear-gradient(160deg, #0c0a10 0%, #110e18 100%)",
        border: "1px solid rgba(198,164,69,0.28)"
      }}
    >
      <div style={{ position: "absolute", inset: 4, border: "1px solid rgba(198,164,69,0.07)", pointerEvents: "none", zIndex: 0 }} />
      {(["tl", "tr", "bl", "br"] as const).map(p => (
        <svg
          key={p}
          style={{
            position: "absolute",
            ...(p[0] === "t" ? { top: 3 } : { bottom: 3 }),
            ...(p[1] === "l" ? { left: 3 } : { right: 3 }),
            transform: `scale(${p[1] === "r" ? -1 : 1}, ${p[0] === "b" ? -1 : 1})`
          }}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
        >
          <line x1="2" y1="2" x2="12" y2="2" stroke={`${GOLD}0.45)`} strokeWidth="0.8" />
          <line x1="2" y1="2" x2="2" y2="12" stroke={`${GOLD}0.45)`} strokeWidth="0.8" />
          <circle cx="2" cy="2" r="1.5" fill={`${GOLD}0.5)`} />
          <path d="M9 2 Q9 9 2 9" stroke={`${GOLD}0.22)`} strokeWidth="0.5" fill="none" />
        </svg>
      ))}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-3 pb-1.5 px-4">
        <span className="font-cinzel text-[10px]" style={{ color: `${GOLD}0.28)` }}>{roman}</span>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}0.16))` }} />
        <p className="font-cinzel tracking-[0.22em] text-[10px] uppercase shrink-0" style={{ color: `${GOLD}0.58)` }}>{label}</p>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(270deg, transparent, ${GOLD}0.16))` }} />
        <span className="font-cinzel text-[10px]" style={{ color: `${GOLD}0.28)` }}>{roman}</span>
      </div>
      <div className="relative z-10 flex flex-col px-4 pb-4">
        {children}
      </div>
    </div>
  );
}

export function StarryBackground() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 3
    }));
    setStars(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white opacity-70"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            boxShadow: `0 0 ${s.size * 2}px rgba(255, 255, 255, 0.8)`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite alternate`
          }}
        />
      ))}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `
        }}
      />
    </div>
  );
}
