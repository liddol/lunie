import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { motion } from 'motion/react';
import { FULL_MOONS_2026, MOON_PHASE_DESCRIPTIONS } from '../data/moons';
import { ANCIENT_LORE } from '../data/lore';
import { getAllFullMoonDates, getCurrentMoonInfo, generateFullMoonsForYear } from '../utils/moonCalc';
import {
  LargeDivider,
  MediumDivider,
  ParchmentHeaderOrnament,
  CardCorners,
  GrimoireCard,
  MobileGrimoireCard
} from '../components/Ornaments';
import { MainMoonGraphic, SmallPhaseStrip } from '../components/MoonPhaseGraphic';
import { MoonInSkyWidget } from '../components/MoonInSky';
import { LunationCycleBar } from '../components/LunationCycle';

const GOLD = "rgba(198,164,69,";

export function HomePage() {
  const now = new Date();
  const allMoonDates = useMemo(
    () => getAllFullMoonDates(FULL_MOONS_2026.map(m => m.date)),
    []
  );
  const { phaseName, lunarAge } = getCurrentMoonInfo(allMoonDates, now);

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekIndex = Math.floor((now.getTime() - startOfYear.getTime()) / (168 * 3600 * 1000));
  const currentLore = ANCIENT_LORE[weekIndex % ANCIENT_LORE.length];

  const phaseDescription = MOON_PHASE_DESCRIPTIONS[phaseName] || {
    description: "The moon moves through her cycle.",
    energy: "Change, cycles, flow"
  };

  const nextFullMoon = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedMoons = [...FULL_MOONS_2026].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const foundIn2026 = sortedMoons.find(
      m => new Date(m.date + "T12:00:00Z") > today
    );
    if (foundIn2026) {
      return { id: foundIn2026.id, name: foundIn2026.name, date: foundIn2026.date };
    }

    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y <= currentYear + 2; y++) {
      const generated = generateFullMoonsForYear(y);
      const found = generated.find(m => new Date(m.date + "T12:00:00Z") > today);
      if (found) return found;
    }

    const fallback = sortedMoons[sortedMoons.length - 1];
    return fallback ? { id: fallback.id, name: fallback.name, date: fallback.date } : null;
  }, []);

  const daysRemaining = nextFullMoon
    ? Math.max(0, Math.ceil((new Date(nextFullMoon.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const formattedDate = now
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();

  const formattedNextMoonDate = nextFullMoon
    ? new Date(nextFullMoon.date + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "";

  const energyTags = phaseDescription.energy.split(",").map(s => s.trim());

  const motes = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        left: `${(i * 37 + 11) % 100}%`,
        top: `${20 + (i * 53 + 7) % 75}%`,
        size: `${(i % 3) * 0.8 + 0.8}px`,
        delay: `${(i * 7) % 25}s`,
        duration: `${18 + ((i * 3) % 18)}s`,
        drift: `${((i % 7) - 3) * 8}px`
      })),
    []
  );

  const wisps = useMemo(
    () => [
      { left: "20%", delay: "0s", duration: "14s" },
      { left: "50%", delay: "5s", duration: "18s" },
      { left: "78%", delay: "9s", duration: "12s" }
    ],
    []
  );

  const LibraryLink = () => (
    <Link
      href="/library"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        textDecoration: "none",
        color: "rgba(198,164,69,0.7)",
        fontFamily: "var(--app-font-serif)",
        fontSize: "1rem",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        transition: "color 0.2s"
      }}
      className="library-link"
    >
      {[0, 1].map(idx => (
        <svg key={idx} width="18" height="18" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="rgba(198,164,69,0.7)" strokeWidth="0.8" />
          <circle cx="6" cy="6" r="1.5" fill="rgba(198,164,69,0.7)" />
          <line x1="6" y1="0" x2="6" y2="2.5" stroke="rgba(198,164,69,0.7)" strokeWidth="0.8" />
          <line x1="6" y1="9.5" x2="6" y2="12" stroke="rgba(198,164,69,0.7)" strokeWidth="0.8" />
          <line x1="0" y1="6" x2="2.5" y2="6" stroke="rgba(198,164,69,0.7)" strokeWidth="0.8" />
          <line x1="9.5" y1="6" x2="12" y2="6" stroke="rgba(198,164,69,0.7)" strokeWidth="0.8" />
        </svg>
      )).flatMap((elem, i) => (i === 0 ? [elem, <span key="txt">Lunar Library</span>] : [elem]))}
    </Link>
  );

  const CountdownCard = ({ compact = false }: { compact?: boolean }) => {
    if (!nextFullMoon) return null;
    return (
      <Link href={`/moon/${nextFullMoon.id}`} style={{ display: "block", width: "100%" }}>
        <div
          className="countdown-card w-full px-6 py-5 items-center justify-between"
          style={{ minHeight: compact ? 0 : undefined }}
          data-testid={`link-next-moon-${nextFullMoon.id}`}
        >
          <CardCorners />
          <div className="flex items-center justify-between w-full">
            <div>
              <p
                className="font-cinzel text-[10px] tracking-[0.25em] uppercase mb-2"
                style={{ color: "rgba(198,164,69,0.55)" }}
              >
                Next Full Moon
              </p>
              <p
                className="font-cinzel font-bold text-[1.35rem]"
                style={{ color: "#e8d4a8", letterSpacing: "0.05em" }}
              >
                {nextFullMoon.name}
              </p>
              <p className="italic text-sm mt-0.5" style={{ color: "rgba(232,212,168,0.45)" }}>
                {formattedNextMoonDate}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span
                className="count-number font-cinzel font-black"
                data-testid="text-days-remaining"
                style={{ fontSize: "3.5rem", lineHeight: 1, color: "#c6a445" }}
              >
                {daysRemaining}
              </span>
              <span
                className="font-cinzel text-[9px] tracking-[0.3em] uppercase"
                style={{ color: "rgba(198,164,69,0.5)", marginTop: 2 }}
              >
                {daysRemaining === 1 ? "Day" : "Days"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const OracleCard = () => (
    <div className="parchment-card w-full px-7 py-6">
      <ParchmentHeaderOrnament />
      <p className="drop-cap leading-relaxed text-[1.05rem]" style={{ color: "#1a1318" }}>
        {phaseDescription.description}
      </p>
      <div
        className="mt-4 pt-4 flex items-center justify-center gap-2 flex-wrap"
        style={{ borderTop: "1px solid rgba(12,10,16,0.15)" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1 L8.5 5.5 L13 5.5 L9.5 8.5 L11 13 L7 10 L3 13 L4.5 8.5 L1 5.5 L5.5 5.5 Z"
            stroke="#5a6b40"
            strokeWidth="0.8"
            fill="rgba(90,107,64,0.12)"
          />
        </svg>
        <span
          className="text-[0.72rem] tracking-widest uppercase font-bold"
          style={{ color: "#5a6b40", letterSpacing: "0.12em" }}
        >
          {energyTags.join(" · ")}
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1 L8.5 5.5 L13 5.5 L9.5 8.5 L11 13 L7 10 L3 13 L4.5 8.5 L1 5.5 L5.5 5.5 Z"
            stroke="#5a6b40"
            strokeWidth="0.8"
            fill="rgba(90,107,64,0.12)"
          />
        </svg>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      data-testid="page-home"
    >
      <div className="grimoire-container w-full min-h-screen">
        <div className="candle-left" />
        <div className="candle-right" />
        <div className="candle-top-left" />
        <div className="candle-top-right" />
        <div className="candle-mid-left" />
        <div className="candle-mid-right" />

        {wisps.map((w, i) => (
          <svg
            key={i}
            className="wisp"
            style={{ left: w.left, animationDelay: w.delay, animationDuration: w.duration }}
            viewBox="0 0 60 200"
            fill="none"
          >
            <path
              d="M30 200 Q 45 160, 25 120 Q 10 80, 35 40 Q 50 10, 30 0"
              stroke="rgba(200,170,90,0.6)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        ))}

        {motes.map(m => (
          <div
            key={m.id}
            className="mote"
            style={{
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              animationDelay: m.delay,
              animationDuration: m.duration,
              '--drift-x': m.drift
            } as React.CSSProperties}
          />
        ))}

        {/* Mobile View */}
        <div className="lg:hidden flex flex-col items-center py-10 px-5">
          <div
            style={{
              position: "absolute",
              top: "8%",
              bottom: "8%",
              left: 12,
              width: 1,
              background: `linear-gradient(180deg, transparent, ${GOLD}0.18) 20%, ${GOLD}0.18) 80%, transparent)`,
              pointerEvents: "none",
              zIndex: 2
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "8%",
              bottom: "8%",
              right: 12,
              width: 1,
              background: `linear-gradient(180deg, transparent, ${GOLD}0.18) 20%, ${GOLD}0.18) 80%, transparent)`,
              pointerEvents: "none",
              zIndex: 2
            }}
          />

          <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
            <div className="text-center mb-3">
              <p className="font-cinzel tracking-[0.4em] text-[10px] uppercase mb-2" style={{ color: "rgba(198,164,69,0.55)" }}>
                {formattedDate}
              </p>
              <div className="flex items-center justify-center gap-2 mb-2" style={{ color: `${GOLD}0.4)` }}>
                <svg width="44" height="8" viewBox="0 0 44 8" fill="none">
                  <line x1="0" y1="4" x2="16" y2="4" stroke="currentColor" strokeWidth="0.7" />
                  <line x1="0" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
                  <path d="M16 4 Q20 4 21 2 L22 0" stroke="currentColor" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                  <path d="M16 4 Q20 4 21 6 L22 8" stroke="currentColor" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: "8px", letterSpacing: "0.3em" }}>✦</span>
                <svg width="44" height="8" viewBox="0 0 44 8" fill="none" style={{ transform: "scaleX(-1)" }}>
                  <line x1="0" y1="4" x2="16" y2="4" stroke="currentColor" strokeWidth="0.7" />
                  <line x1="0" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
                  <path d="M16 4 Q20 4 21 2 L22 0" stroke="currentColor" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                  <path d="M16 4 Q20 4 21 6 L22 8" stroke="currentColor" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <h1
                className="font-cinzel font-black tracking-[0.25em] mb-1"
                style={{ fontSize: "3.8rem", color: "#e8d4a8", textShadow: "0 2px 40px rgba(198,164,69,0.25)", lineHeight: 1 }}
              >
                LUNIE
              </h1>
              <div className="ornament-rule mt-3">
                <span className="font-cinzel text-[11px] tracking-[0.3em] uppercase" style={{ color: "rgba(198,164,69,0.5)" }}>
                  Lunar Almanac
                </span>
              </div>
            </div>

            <LargeDivider />

            <div className="relative flex items-center justify-center my-4">
              <div className="moon-halo" />
              <div className="moon-wrap">
                <MainMoonGraphic phaseName={phaseName} lunarAge={lunarAge} />
              </div>
            </div>

            <div className="text-center mb-3" data-testid="text-current-phase">
              <h2 className="font-cinzel font-bold mb-1" style={{ fontSize: "1.9rem", color: "#c6a445", letterSpacing: "0.08em" }}>
                {phaseName}
              </h2>
              <p className="italic" style={{ color: "rgba(232,212,168,0.65)", fontSize: "1rem" }} data-testid="text-lunar-age">
                Day {Math.floor(lunarAge)}  ·  Lunar Cycle
              </p>
            </div>

            <MediumDivider glyph="◈" />
            <SmallPhaseStrip />
            <MediumDivider glyph="◈" />

            <MediumDivider glyph="✦" />
            <div className="w-full">
              <CountdownCard />
            </div>

            <MediumDivider glyph="✦" />
            <MobileGrimoireCard label="Ancient Lore" roman="II" id="mob-lore">
              <div className="flex flex-col items-center text-center gap-3 py-2">
                <div className="flex flex-col items-center gap-1">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      border: `1px solid ${GOLD}0.22)`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 12px ${GOLD}0.06) inset`,
                      position: "relative"
                    }}
                  >
                    <div style={{ position: "absolute", inset: 4, border: `1px solid ${GOLD}0.10)`, borderRadius: "50%" }} />
                    <span
                      style={{
                        fontFamily: "'Amarante', serif",
                        fontSize: currentLore.glyph.length > 2 ? "0.55rem" : "1rem",
                        color: `${GOLD}0.65)`,
                        letterSpacing: currentLore.glyph.length > 2 ? "0.06em" : 0,
                        lineHeight: 1
                      }}
                    >
                      {currentLore.glyph}
                    </span>
                  </div>
                  <p className="font-cinzel uppercase tracking-[0.16em]" style={{ fontSize: "0.52rem", color: `${GOLD}0.38)`, marginTop: 2 }}>
                    {currentLore.culture}
                  </p>
                </div>
                <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}0.16), transparent)` }} />
                <p style={{ fontFamily: "Lato, sans-serif", fontSize: "0.82rem", lineHeight: 1.65, color: "rgba(232,212,168,0.72)", fontStyle: "italic", textAlign: "center" }}>
                  {currentLore.fact}
                </p>
                <p className="font-cinzel uppercase tracking-[0.22em]" style={{ fontSize: "0.48rem", color: `${GOLD}0.22)` }}>
                  Changes weekly
                </p>
              </div>
            </MobileGrimoireCard>

            <MediumDivider glyph="✦" />
            <MobileGrimoireCard label="Moon in the Sky" roman="I" id="mob-sky">
              <MoonInSkyWidget />
            </MobileGrimoireCard>

            <MediumDivider glyph="✦" />
            <div className="w-full">
              <OracleCard />
            </div>

            <LargeDivider flip />

            <div className="mt-4 mb-1 w-full text-center">
              <LibraryLink />
            </div>

            <div className="mt-3 mb-6 flex items-center gap-3" style={{ color: "rgba(198,164,69,0.3)" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", fontFamily: "'Amarante',serif" }}>
                ☽   ○   ☾
              </span>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex flex-col relative z-10 w-full max-w-[1340px] mx-auto px-8 py-8" style={{ gap: 14 }}>
          <div className="flex flex-col items-center text-center">
            <p className="font-cinzel tracking-[0.4em] text-[10px] uppercase mb-2" style={{ color: "rgba(198,164,69,0.50)" }}>
              {formattedDate}
            </p>
            <div className="flex items-center justify-center gap-3 mb-1" style={{ color: `${GOLD}0.38)` }}>
              {[false, true].map(isFlipped => (
                <svg
                  key={String(isFlipped)}
                  width="90"
                  height="8"
                  viewBox="0 0 90 8"
                  fill="none"
                  style={{ transform: isFlipped ? "scaleX(-1)" : undefined }}
                >
                  <line x1="0" y1="4" x2="64" y2="4" stroke="currentColor" strokeWidth="0.7" />
                  <line x1="0" y1="6" x2="48" y2="6" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
                  <path d="M64 4 Q68 4 69 2 L70 0" stroke="currentColor" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                  <path d="M64 4 Q68 4 69 6 L70 8" stroke="currentColor" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                </svg>
              ))}
            </div>
            <h1
              className="font-cinzel font-black tracking-[0.22em]"
              style={{ fontSize: "4.2rem", color: "#e8d4a8", textShadow: "0 2px 60px rgba(198,164,69,0.28)", lineHeight: 1 }}
            >
              LUNIE
            </h1>
            <div className="ornament-rule mt-2">
              <span className="font-cinzel text-[11px] tracking-[0.3em] uppercase" style={{ color: "rgba(198,164,69,0.45)" }}>
                Lunar Almanac
              </span>
            </div>
          </div>

          <LargeDivider />

          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 260px", gap: 14, alignItems: "stretch" }}>
            <GrimoireCard label="Moon in the Sky" roman="I">
              <MoonInSkyWidget />
            </GrimoireCard>

            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative flex items-center justify-center">
                <div className="moon-halo" />
                <div className="moon-wrap">
                  <MainMoonGraphic phaseName={phaseName} lunarAge={lunarAge} />
                </div>
              </div>
              <div className="text-center mt-3" data-testid="text-current-phase">
                <h2 className="font-cinzel font-bold" style={{ fontSize: "2.2rem", color: "#c6a445", letterSpacing: "0.08em" }}>
                  {phaseName}
                </h2>
                <p className="italic mt-1" style={{ color: "rgba(232,212,168,0.60)", fontSize: "1rem" }} data-testid="text-lunar-age">
                  Day {Math.floor(lunarAge)}  ·  Lunar Cycle
                </p>
              </div>
              <div className="mt-4 w-full max-w-xs">
                <SmallPhaseStrip />
              </div>
            </div>

            <GrimoireCard label="Ancient Lore" roman="II">
              <div className="flex-1 flex flex-col items-center justify-between text-center px-3 py-3 gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      border: `1px solid ${GOLD}0.22)`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 14px ${GOLD}0.08) inset`,
                      position: "relative"
                    }}
                  >
                    <div style={{ position: "absolute", inset: 5, border: `1px solid ${GOLD}0.12)`, borderRadius: "50%" }} />
                    <span
                      style={{
                        fontFamily: "'Amarante', serif",
                        fontSize: currentLore.glyph.length > 2 ? "0.6rem" : "1.1rem",
                        color: `${GOLD}0.65)`,
                        letterSpacing: currentLore.glyph.length > 2 ? "0.08em" : 0,
                        lineHeight: 1
                      }}
                    >
                      {currentLore.glyph}
                    </span>
                  </div>
                  <p className="font-cinzel uppercase tracking-[0.18em]" style={{ fontSize: "0.55rem", color: `${GOLD}0.38)`, marginTop: 4 }}>
                    {currentLore.culture}
                  </p>
                </div>
                <svg width="100%" height="8" viewBox="0 0 200 8" preserveAspectRatio="none" fill="none">
                  <line x1="0" y1="4" x2="82" y2="4" stroke={`${GOLD}0.18)`} strokeWidth="0.7" />
                  <path d="M86 4 L89 2 L92 4 L89 6 Z" fill={`${GOLD}0.30)`} />
                  <circle cx="100" cy="4" r="1.5" fill={`${GOLD}0.40)`} />
                  <path d="M108 4 L111 2 L114 4 L111 6 Z" fill={`${GOLD}0.30)`} />
                  <line x1="118" y1="4" x2="200" y2="4" stroke={`${GOLD}0.18)`} strokeWidth="0.7" />
                </svg>
                <p style={{ fontFamily: "Lato, sans-serif", fontSize: "0.78rem", lineHeight: 1.65, color: "rgba(232,212,168,0.72)", fontStyle: "italic", textAlign: "center", flex: 1 }}>
                  {currentLore.fact}
                </p>
                <svg width="100%" height="8" viewBox="0 0 200 8" preserveAspectRatio="none" fill="none">
                  <line x1="0" y1="4" x2="200" y2="4" stroke={`${GOLD}0.12)`} strokeWidth="0.5" />
                </svg>
                <p className="font-cinzel uppercase tracking-[0.25em]" style={{ fontSize: "0.5rem", color: `${GOLD}0.22)` }}>
                  Changes weekly
                </p>
              </div>
            </GrimoireCard>
          </div>

          <LunationCycleBar lunarAge={lunarAge} phaseName={phaseName} />

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14, alignItems: "stretch" }}>
            <GrimoireCard label="Phase Oracle" roman="III">
              <div className="parchment-card w-full px-6 py-5" style={{ height: "100%" }}>
                <ParchmentHeaderOrnament />
                <p className="drop-cap leading-relaxed text-[1.05rem]" style={{ color: "#1a1318" }}>
                  {phaseDescription.description}
                </p>
                <div
                  className="mt-4 pt-4 flex items-center justify-center gap-2 flex-wrap"
                  style={{ borderTop: "1px solid rgba(12,10,16,0.15)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 1 L8.5 5.5 L13 5.5 L9.5 8.5 L11 13 L7 10 L3 13 L4.5 8.5 L1 5.5 L5.5 5.5 Z"
                      stroke="#5a6b40"
                      strokeWidth="0.8"
                      fill="rgba(90,107,64,0.12)"
                    />
                  </svg>
                  <span className="text-[0.72rem] tracking-widest uppercase font-bold" style={{ color: "#5a6b40", letterSpacing: "0.12em" }}>
                    {energyTags.join(" · ")}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 1 L8.5 5.5 L13 5.5 L9.5 8.5 L11 13 L7 10 L3 13 L4.5 8.5 L1 5.5 L5.5 5.5 Z"
                      stroke="#5a6b40"
                      strokeWidth="0.8"
                      fill="rgba(90,107,64,0.12)"
                    />
                  </svg>
                </div>
              </div>
            </GrimoireCard>

            {nextFullMoon && (
              <GrimoireCard label="Next Full Moon" roman="IV">
                <Link
                  href={`/moon/${nextFullMoon.id}`}
                  style={{ display: "flex", flexDirection: "column", flex: 1, textDecoration: "none" }}
                  data-testid={`link-next-moon-${nextFullMoon.id}`}
                >
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-2">
                    <svg width="52" height="52" viewBox="-26 -26 52 52" fill="none">
                      <circle r="22" fill="#e8d5a8" />
                      <circle r="22" fill="none" stroke="rgba(12,10,16,0.55)" strokeWidth="0.8" />
                      <circle r="27" fill="none" stroke="rgba(198,164,69,0.28)" strokeWidth="0.6" />
                    </svg>
                    <div>
                      <p className="font-cinzel font-bold text-[1.1rem]" style={{ color: "#e8d4a8", letterSpacing: "0.04em" }}>
                        {nextFullMoon.name}
                      </p>
                      <p className="italic text-sm mt-0.5" style={{ color: "rgba(232,212,168,0.42)" }}>
                        {formattedNextMoonDate}
                      </p>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(198,164,69,0.16)", paddingTop: 10, width: "100%" }}>
                      <span
                        className="font-cinzel font-black"
                        data-testid="text-days-remaining"
                        style={{ fontSize: "3.2rem", lineHeight: 1, color: "#c6a445", display: "block", textShadow: "0 0 18px rgba(198,164,69,0.28)" }}
                      >
                        {daysRemaining}
                      </span>
                      <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(198,164,69,0.48)" }}>
                        {daysRemaining === 1 ? "Day" : "Days"}
                      </span>
                    </div>
                  </div>
                </Link>
              </GrimoireCard>
            )}

            <GrimoireCard label="Lunar Library" roman="V">
              <Link href="/library" style={{ display: "flex", flexDirection: "column", flex: 1, textDecoration: "none" }} className="library-link">
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-2">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <circle cx="28" cy="28" r="26" stroke={`${GOLD}0.20)`} strokeWidth="0.8" strokeDasharray="2 5" />
                    <circle cx="28" cy="28" r="18" stroke={`${GOLD}0.28)`} strokeWidth="0.7" />
                    <circle cx="28" cy="28" r="10" stroke={`${GOLD}0.35)`} strokeWidth="0.9" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                      const len = deg % 90 === 0 ? 26 : 22;
                      const rad = ((deg - 90) * Math.PI) / 180;
                      return (
                        <line
                          key={deg}
                          x1={28 + 18 * Math.cos(rad)}
                          y1={28 + 18 * Math.sin(rad)}
                          x2={28 + len * Math.cos(rad)}
                          y2={28 + len * Math.sin(rad)}
                          stroke={`${GOLD}${deg % 90 === 0 ? "0.45" : "0.22"})`}
                          strokeWidth={deg % 90 === 0 ? "0.9" : "0.6"}
                        />
                      );
                    })}
                    <text x="28" y="32" textAnchor="middle" fontSize="14" fill={`${GOLD}0.72)`}>☽</text>
                  </svg>
                  <div>
                    <p className="font-cinzel font-bold tracking-[0.18em] text-[1rem]" style={{ color: "rgba(198,164,69,0.75)", textTransform: "uppercase" }}>
                      Explore
                    </p>
                    <p className="font-cinzel text-[0.7rem] tracking-widest uppercase mt-0.5" style={{ color: `${GOLD}0.38)` }}>
                      Full Moon Lore
                    </p>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(198,164,69,0.14)", paddingTop: 8, width: "100%" }}>
                    <p className="font-cinzel text-[9px] tracking-[0.25em] uppercase" style={{ color: `${GOLD}0.30)` }}>
                      12 Moons · Myths · Rituals
                    </p>
                  </div>
                </div>
              </Link>
            </GrimoireCard>
          </div>

          <div className="flex items-center justify-center pb-6 pt-1">
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", fontFamily: "'Amarante',serif", color: "rgba(198,164,69,0.25)" }}>
              ☽   ○   ☾
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
