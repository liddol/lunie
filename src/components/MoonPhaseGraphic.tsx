import React, { useId, useMemo } from 'react';

const GOLD = "rgba(198,164,69,";

export function getMoonClipPath(phaseName: string, ageDays: number): string | null {
  const cx = 130;
  const top = "130 43";
  const bottom = "130 217";

  const fraction = (ageDays / 29.530588853) * 2 * Math.PI;
  const illumination = Math.max(0, Math.min(1, (1 - Math.cos(fraction)) / 2));

  switch (phaseName) {
    case "New Moon":
      return "M 43 130 a 87 87 0 1 0 174 0 a 87 87 0 1 0 -174 0";
    case "Waxing Crescent": {
      const rx = Math.max(2, Math.round(87 * (1 - 2 * illumination)));
      return `M ${top} A 87 87 0 0 0 ${bottom} A ${rx} 87 0 0 0 ${top} Z`;
    }
    case "First Quarter":
      return `M ${top} L ${bottom} A 87 87 0 0 1 ${top} Z`;
    case "Waxing Gibbous": {
      const rx = Math.max(2, Math.round(87 * (2 * illumination - 1)));
      return `M ${top} A 87 87 0 0 0 ${bottom} A ${rx} 87 0 0 1 ${top} Z`;
    }
    case "Full Moon":
      return null;
    case "Waning Gibbous": {
      const rx = Math.max(2, Math.round(87 * (2 * illumination - 1)));
      return `M ${top} A 87 87 0 0 1 ${bottom} A ${rx} 87 0 0 0 ${top} Z`;
    }
    case "Last Quarter":
      return `M ${top} L ${bottom} A 87 87 0 0 0 ${top} Z`;
    case "Waning Crescent": {
      const rx = Math.max(2, Math.round(87 * (1 - 2 * illumination)));
      return `M ${top} A 87 87 0 0 1 ${bottom} A ${rx} 87 0 0 1 ${top} Z`;
    }
    default:
      return null;
  }
}

export function getSmallMoonClipPath(phaseName: string, radius: number): string | null {
  const rx = Math.round(radius * 0.52);
  switch (phaseName) {
    case "New Moon":
      return `M -${radius} 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`;
    case "Waxing Crescent":
      return `M 0 -${radius} A ${radius} ${radius} 0 0 0 0 ${radius} A ${rx} ${radius} 0 0 0 0 -${radius} Z`;
    case "First Quarter":
      return `M 0 -${radius} L 0 ${radius} A ${radius} ${radius} 0 0 1 0 -${radius} Z`;
    case "Waxing Gibbous":
      return `M 0 -${radius} A ${radius} ${radius} 0 0 0 0 ${radius} A ${rx} ${radius} 0 0 1 0 -${radius} Z`;
    case "Full Moon":
      return null;
    case "Waning Gibbous":
      return `M 0 -${radius} A ${radius} ${radius} 0 0 1 0 ${radius} A ${rx} ${radius} 0 0 0 0 -${radius} Z`;
    case "Last Quarter":
      return `M 0 -${radius} L 0 ${radius} A ${radius} ${radius} 0 0 0 0 -${radius} Z`;
    case "Waning Crescent":
      return `M 0 -${radius} A ${radius} ${radius} 0 0 1 0 ${radius} A ${rx} ${radius} 0 0 1 0 -${radius} Z`;
    default:
      return null;
  }
}

export function MainMoonGraphic({ phaseName, lunarAge }: { phaseName: string; lunarAge: number }) {
  const rawId = useId();
  const shadowId = rawId.replace(/:/g, "");
  const cx = 130;
  const cy = 130;

  const shadowPath = getMoonClipPath(phaseName, lunarAge);

  const ticks = Array.from({ length: 24 }).map((_, i) => {
    const deg = i * 15;
    const rad = ((deg - 90) * Math.PI) / 180;
    const isMajor = deg % 90 === 0;
    const isSemi = deg % 45 === 0;
    return {
      rad,
      r1: 118,
      r2: isMajor ? 108 : isSemi ? 111 : 113,
      opacity: isMajor ? 0.55 : isSemi ? 0.4 : 0.25,
      sw: isMajor ? 0.9 : 0.6
    };
  });

  const compassTicks = Array.from({ length: 8 }).map((_, i) => {
    const deg = i * 45;
    const rad = ((deg - 90) * Math.PI) / 180;
    const isMajor = deg % 90 === 0;
    return {
      rad,
      r1: isMajor ? 93 : 95,
      r2: isMajor ? 115 : 107,
      isMajor
    };
  });

  const cardinalDiamonds = [0, 90, 180, 270].map(deg => {
    const rad = ((deg - 90) * Math.PI) / 180;
    const dist = 122;
    return {
      px: cx + dist * Math.cos(rad),
      py: cy + dist * Math.sin(rad),
      rad
    };
  });

  const ordinalDiamonds = [45, 135, 225, 315].map(deg => {
    const rad = ((deg - 90) * Math.PI) / 180;
    const dist = 108;
    return {
      x: cx + dist * Math.cos(rad),
      y: cy + dist * Math.sin(rad),
      rad
    };
  });

  return (
    <svg width="264" height="264" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`shadow-clip-${shadowId}`}>
          {shadowPath && <path d={shadowPath} />}
        </clipPath>
        <radialGradient id={`moon-lit-${shadowId}`} cx="35%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#f8eedb" />
          <stop offset="60%" stopColor="#f0e2c4" />
          <stop offset="100%" stopColor="#ddc99e" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r="128" fill="none" stroke={`${GOLD}0.05)`} strokeWidth="1" />

      {ticks.map(({ rad, r1, r2, opacity, sw }, i) => (
        <line
          key={i}
          x1={cx + r1 * Math.cos(rad)}
          y1={cy + r1 * Math.sin(rad)}
          x2={cx + r2 * Math.cos(rad)}
          y2={cy + r2 * Math.sin(rad)}
          stroke={`${GOLD}${opacity})`}
          strokeWidth={sw}
        />
      ))}

      <circle cx={cx} cy={cy} r="118" fill="none" stroke={`${GOLD}0.10)`} strokeWidth="0.6" strokeDasharray="2 10" />

      {cardinalDiamonds.map(({ px, py, rad }, i) => {
        const perp = rad + Math.PI / 2;
        return (
          <g key={i}>
            <path d={`M${px},${py - 4} L${px + 3},${py} L${px},${py + 4} L${px - 3},${py} Z`} fill={`${GOLD}0.55)`} />
            <line x1={px + 4 * Math.cos(perp)} y1={py + 4 * Math.sin(perp)} x2={px - 4 * Math.cos(perp)} y2={py - 4 * Math.sin(perp)} stroke={`${GOLD}0.40)`} strokeWidth="0.7" />
            <circle cx={px + 4.5 * Math.cos(perp)} cy={py + 4.5 * Math.sin(perp)} r="0.9" fill={`${GOLD}0.4)`} />
            <circle cx={px - 4.5 * Math.cos(perp)} cy={py - 4.5 * Math.sin(perp)} r="0.9" fill={`${GOLD}0.4)`} />
          </g>
        );
      })}

      {[
        { label: "N", x: cx, y: cy - 131 },
        { label: "E", x: cx + 133, y: cy + 1 },
        { label: "S", x: cx, y: cy + 137 },
        { label: "W", x: cx - 133, y: cy + 1 }
      ].map(({ label, x, y }) => (
        <text key={label} x={x} y={y} fontSize="7.5" fill={`${GOLD}0.38)`} fontFamily="'Amarante',serif" textAnchor="middle" dominantBaseline="middle">
          {label}
        </text>
      ))}

      <circle cx={cx} cy={cy} r="102" fill="none" stroke={`${GOLD}0.13)`} strokeWidth="1" strokeDasharray="3 7" />

      {compassTicks.map(({ rad, r1, r2, isMajor }, i) => (
        <line
          key={i}
          x1={cx + r1 * Math.cos(rad)}
          y1={cy + r1 * Math.sin(rad)}
          x2={cx + r2 * Math.cos(rad)}
          y2={cy + r2 * Math.sin(rad)}
          stroke={`${GOLD}${isMajor ? "0.52" : "0.30"})`}
          strokeWidth={isMajor ? "0.9" : "0.6"}
        />
      ))}

      {ordinalDiamonds.map(({ x, y, rad }, i) => {
        const perp = rad + Math.PI / 2;
        return (
          <path
            key={i}
            d={`M${x},${y} L${x + 3 * Math.cos(perp) + 2 * Math.cos(rad)},${y + 3 * Math.sin(perp) + 2 * Math.sin(rad)} L${x + 4 * Math.cos(rad)},${y + 4 * Math.sin(rad)} L${x - 3 * Math.cos(perp) + 2 * Math.cos(rad)},${y - 3 * Math.sin(perp) + 2 * Math.sin(rad)} Z`}
            fill={`${GOLD}0.35)`}
          />
        );
      })}

      <circle cx={cx} cy={cy} r="93" fill="none" stroke={`${GOLD}0.20)`} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="87" fill={`url(#moon-lit-${shadowId})`} />

      <circle cx="103" cy="96" r="8" fill="none" stroke="rgba(160,130,80,0.17)" strokeWidth="1" />
      <circle cx="103" cy="96" r="3.5" fill="none" stroke="rgba(160,130,80,0.08)" strokeWidth="0.6" />
      <circle cx="150" cy="112" r="4.5" fill="none" stroke="rgba(160,130,80,0.13)" strokeWidth="0.8" />
      <circle cx="116" cy="155" r="5.5" fill="none" stroke="rgba(160,130,80,0.11)" strokeWidth="0.8" />
      <circle cx="155" cy="148" r="3.2" fill="none" stroke="rgba(160,130,80,0.09)" strokeWidth="0.7" />
      <circle cx="138" cy="80" r="2.5" fill="none" stroke="rgba(160,130,80,0.09)" strokeWidth="0.6" />
      <ellipse cx="118" cy="108" rx="18" ry="14" fill="rgba(160,130,80,0.06)" />

      {shadowPath && <path d={shadowPath} fill="#0c0a10" />}

      {shadowPath && (
        <g clipPath={`url(#shadow-clip-${shadowId})`}>
          {Array.from({ length: 40 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1="36"
              y1={43 + i * 4.5}
              x2="200"
              y2={35 + i * 4.5}
              className="ink-hatch"
              style={{ opacity: 0.5 + (i % 3) * 0.09 }}
            />
          ))}
          {Array.from({ length: 28 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={55 + i * 5}
              y1="43"
              x2={45 + i * 5}
              y2="217"
              className="ink-hatch"
              style={{ opacity: 0.28 + (i % 2) * 0.1 }}
            />
          ))}
        </g>
      )}

      {shadowPath && <path d={shadowPath} fill="none" stroke="rgba(240,210,160,0.22)" strokeWidth="2.5" />}
      <circle cx={cx} cy={cy} r="87" fill="none" stroke="rgba(12,10,16,0.5)" strokeWidth="1.5" />
    </svg>
  );
}

export function SmallPhaseStrip() {
  const phases = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent"
  ];

  return (
    <div className="flex items-center justify-center gap-3 my-1">
      {phases.map((name, i) => {
        const isFull = i === 4;
        const r = isFull ? 7 : 5;
        const clipPath = getSmallMoonClipPath(name, r);
        return (
          <svg key={i} width={r * 2 + 2} height={r * 2 + 2} viewBox={`${-(r + 1)} ${-(r + 1)} ${(r + 1) * 2} ${(r + 1) * 2}`} fill="none" style={{ opacity: isFull ? 0.85 : 0.5 }}>
            <circle r={r} fill={isFull ? "#e8d5a8" : "#c8b07a"} />
            {clipPath && <path d={clipPath} fill="#0c0a10" />}
            <circle r={r} fill="none" stroke="rgba(12,10,16,0.55)" strokeWidth="0.6" />
          </svg>
        );
      })}
    </div>
  );
}

export function HandDrawnMoon({ phaseName, size = 200 }: { phaseName: string; size?: number }) {
  const phaseData = useMemo(() => {
    switch (phaseName) {
      case "New Moon": return { illuminated: 0, rightToLeft: true };
      case "Waxing Crescent": return { illuminated: 0.25, rightToLeft: true };
      case "First Quarter": return { illuminated: 0.5, rightToLeft: true };
      case "Waxing Gibbous": return { illuminated: 0.75, rightToLeft: true };
      case "Full Moon": return { illuminated: 1, rightToLeft: false };
      case "Waning Gibbous": return { illuminated: 0.75, rightToLeft: false };
      case "Last Quarter": return { illuminated: 0.5, rightToLeft: false };
      case "Waning Crescent": return { illuminated: 0.25, rightToLeft: false };
      default: return { illuminated: 1, rightToLeft: false };
    }
  }, [phaseName]);

  const r = 48;
  const cx = 50;
  const cy = 50;
  const darkColor = "rgba(10, 15, 35, 0.9)";
  const lightColor = "#e6d5b8";

  const craters = Array.from({ length: 8 }).map((_, i) => (
    <circle
      key={i}
      cx={30 + Math.random() * 40}
      cy={30 + Math.random() * 40}
      r={2 + Math.random() * 6}
      fill="rgba(0,0,0,0.08)"
      className="mix-blend-multiply"
    />
  ));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_15px_rgba(230,213,184,0.3)] transition-all duration-1000 ease-in-out"
    >
      <defs>
        <filter id="handDrawn" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <clipPath id="moonClip">
          <circle cx={cx} cy={cy} r={r} filter="url(#handDrawn)" />
        </clipPath>
        <mask id="phaseMask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          {phaseData.illuminated < 1 && (
            phaseData.rightToLeft ? (
              <path
                d={`M ${cx} ${cy - r} A ${r * (1 - phaseData.illuminated * 2)} ${r} 0 0 0 ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx} ${cy - r} Z`}
                fill="black"
              />
            ) : (
              <path
                d={`M ${cx} ${cy - r} A ${r * (1 - (1 - phaseData.illuminated) * 2)} ${r} 0 0 1 ${cx} ${cy + r} A ${r} ${r} 0 0 0 ${cx} ${cy - r} Z`}
                fill="black"
              />
            )
          )}
        </mask>
      </defs>

      <circle cx={cx} cy={cy} r={r} fill={darkColor} filter="url(#handDrawn)" />
      {phaseData.illuminated > 0 && (
        <g mask="url(#phaseMask)">
          <circle cx={cx} cy={cy} r={r} fill={lightColor} filter="url(#handDrawn)" />
          {craters}
        </g>
      )}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(230,213,184,0.4)" strokeWidth="1.5" filter="url(#handDrawn)" />
    </svg>
  );
}
