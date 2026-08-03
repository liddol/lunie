import React from 'react';
import { LUNAR_MONTH_DAYS } from '../utils/moonCalc';
import { getSmallMoonClipPath } from './MoonPhaseGraphic';

const GOLD = "rgba(198,164,69,";

export function LunationCycleBar({
  lunarAge,
  phaseName
}: {
  lunarAge: number;
  phaseName: string;
}) {
  const phases = [
    { name: "New Moon", short: "New Moon", day: 0 },
    { name: "Waxing Crescent", short: "Wax. Cres.", day: 3.69 },
    { name: "First Quarter", short: "1st Qtr", day: 7.38 },
    { name: "Waxing Gibbous", short: "Wax. Gib.", day: 11.07 },
    { name: "Full Moon", short: "Full Moon", day: 14.77 },
    { name: "Waning Gibbous", short: "Wan. Gib.", day: 18.46 },
    { name: "Last Quarter", short: "Last Qtr", day: 22.15 },
    { name: "Waning Crescent", short: "Wan. Cres.", day: 25.84 }
  ];

  function bezierPoint(tRatio: number) {
    const p0 = { x: 30, y: 68 };
    const p1 = { x: 480, y: 8 };
    const p2 = { x: 930, y: 68 };

    const inv = 1 - tRatio;
    return {
      x: inv * inv * p0.x + 2 * inv * tRatio * p1.x + tRatio * tRatio * p2.x,
      y: inv * inv * p0.y + 2 * inv * tRatio * p1.y + tRatio * tRatio * p2.y
    };
  }

  const ageRatio = lunarAge / LUNAR_MONTH_DAYS;
  const currentPos = bezierPoint(ageRatio);
  const baselineY = 68;

  return (
    <div
      style={{
        borderTop: "1px solid rgba(198,164,69,0.15)",
        borderBottom: "1px solid rgba(198,164,69,0.15)",
        padding: "8px 0",
        position: "relative"
      }}
    >
      <p
        className="font-cinzel tracking-[0.22em] text-[11px] uppercase text-center mb-1"
        style={{ color: `${GOLD}0.60)` }}
      >
        ✦   Lunation Cycle   ✦
      </p>

      <svg width="100%" viewBox="0 0 960 118" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
        <line x1="20" y1={baselineY} x2="940" y2={baselineY} stroke={`${GOLD}0.22)`} strokeWidth="0.7" />
        <line x1="20" y1={baselineY + 2} x2="940" y2={baselineY + 2} stroke={`${GOLD}0.09)`} strokeWidth="0.5" />

        {[
          { x: 20, flip: 1 },
          { x: 940, flip: -1 }
        ].map(({ x, flip }) => (
          <g key={x} transform={`translate(${x},${baselineY}) scale(${flip},1)`}>
            <path d="M0 0 L-6 -4 L-12 0 L-6 4 Z" fill={`${GOLD}0.40)`} />
            <line x1="-12" y1="0" x2="-24" y2="0" stroke={`${GOLD}0.22)`} strokeWidth="0.6" />
          </g>
        ))}

        <path d="M 30 68 Q 480 8 930 68" fill="none" stroke={`${GOLD}0.22)`} strokeWidth="0.8" strokeDasharray="5 7" />

        {Array.from({ length: 30 }).map((_, i) => {
          const ratio = i / 29.5;
          const pos = bezierPoint(ratio);
          const isMajor = i % 7 === 0;
          return (
            <line
              key={i}
              x1={pos.x}
              y1={baselineY - (isMajor ? 5 : 3)}
              x2={pos.x}
              y2={baselineY + (isMajor ? 5 : 3)}
              stroke={`${GOLD}${isMajor ? "0.35" : "0.14"})`}
              strokeWidth={isMajor ? "0.8" : "0.5"}
            />
          );
        })}

        <line
          x1={currentPos.x}
          y1={currentPos.y}
          x2={currentPos.x}
          y2={baselineY}
          stroke={`${GOLD}0.30)`}
          strokeWidth="0.6"
          strokeDasharray="2 3"
        />

        <circle cx={currentPos.x} cy={currentPos.y} r="9" fill={`${GOLD}0.10)`} />
        <circle cx={currentPos.x} cy={currentPos.y} r="6" fill={`${GOLD}0.22)`} />
        <circle cx={currentPos.x} cy={currentPos.y} r="3" fill="#c6a445" />
        <circle cx={currentPos.x} cy={currentPos.y} r="1.2" fill="#f0e2c4" />

        {phases.map(({ name, short, day }) => {
          const ratio = day / LUNAR_MONTH_DAYS;
          const pos = bezierPoint(ratio);
          const isActive = name === phaseName;
          const radius = isActive ? 9 : 7;
          const clipPath = getSmallMoonClipPath(name, radius);

          return (
            <g key={name}>
              <line
                x1={pos.x}
                y1={pos.y + radius + 1}
                x2={pos.x}
                y2={baselineY}
                stroke={`${GOLD}${isActive ? "0.25" : "0.12"})`}
                strokeWidth="0.5"
                strokeDasharray="2 3"
              />

              {isActive && (
                <circle cx={pos.x} cy={pos.y} r={radius + 5} fill="none" stroke={`${GOLD}0.30)`} strokeWidth="0.6" />
              )}

              <g transform={`translate(${pos.x},${pos.y})`}>
                <circle r={radius} fill={isActive ? "#e8d5a8" : "#c8b07a"} opacity={isActive ? 1 : 0.72} />
                {clipPath && <path d={clipPath} fill="#0c0a10" />}
                <circle r={radius} fill="none" stroke="rgba(12,10,16,0.55)" strokeWidth="0.6" />
              </g>

              <text
                x={pos.x}
                y={pos.y - radius - 4}
                textAnchor="middle"
                fontSize="6"
                fill={`${GOLD}${isActive ? "0.55" : "0.28"})`}
                fontFamily="'Amarante',serif"
              >
                {`d.${Math.round(day)}`}
              </text>

              <text
                x={pos.x}
                y={baselineY + 12}
                textAnchor="middle"
                fontSize={isActive ? "7.5" : "6.5"}
                fill={`${GOLD}${isActive ? "0.65" : "0.30"})`}
                fontFamily="'Amarante',serif"
                fontWeight={isActive ? "bold" : "normal"}
              >
                {short}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
