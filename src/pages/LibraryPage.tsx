import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { FULL_MOONS_2026 } from '../data/moons';
import { generateFullMoonsForYear } from '../utils/moonCalc';
import { FullMoon } from '../types';

const GOLD = "rgba(198,164,69,";
const BASE_YEAR = parseInt(FULL_MOONS_2026[0]?.date.slice(0, 4) ?? "2026", 10);

const ELEMENT_SYMBOLS: Record<string, string> = {
  Water: "≋",
  Fire: "∴",
  Earth: "⊕",
  Air: "∿"
};

function MiniMoonIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="16" fill="rgba(232,212,168,0.88)" />
      <circle cx="24" cy="24" r="16" fill="none" stroke={`${GOLD}0.35)`} strokeWidth="0.8" />
      <circle cx="24" cy="24" r="19" fill="none" stroke={`${GOLD}0.15)`} strokeWidth="0.6" strokeDasharray="2 3" />
      <circle cx="19" cy="19" r="2.5" fill="rgba(180,155,100,0.22)" />
      <circle cx="29" cy="26" r="1.8" fill="rgba(180,155,100,0.18)" />
      <circle cx="22" cy="30" r="1.2" fill="rgba(180,155,100,0.15)" />
    </svg>
  );
}

function ElementTag({ element }: { element: string }) {
  const sym = ELEMENT_SYMBOLS[element] ?? "✦";
  return (
    <span className="font-cinzel" style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: `${GOLD}0.55)`, display: "inline-flex", alignItems: "center", gap: 3 }}>
      <span style={{ fontSize: "0.75rem" }}>{sym}</span>
      {element.toUpperCase()}
    </span>
  );
}

export function LibraryPage() {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(() => today.getFullYear());

  const moonsForYear: FullMoon[] = useMemo(() => {
    if (selectedYear === BASE_YEAR) {
      return FULL_MOONS_2026.map(f => ({
        id: f.id,
        date: f.date,
        name: f.name,
        astrologicalSign: f.astrologicalSign,
        element: f.element
      }));
    }
    return generateFullMoonsForYear(selectedYear);
  }, [selectedYear]);

  const { pastIds, nextId } = useMemo(() => {
    const targetMs = today.getTime();
    let next: string | null = null;
    const pasts = new Set<string>();

    for (const m of moonsForYear) {
      if (new Date(m.date + "T12:00:00Z").getTime() < targetMs) {
        pasts.add(m.id);
      } else if (!next) {
        next = m.id;
      }
    }
    return { pastIds: pasts, nextId: next };
  }, [moonsForYear]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      data-testid="page-library"
    >
      <div className="grimoire-container w-full min-h-screen flex flex-col items-center py-10 px-5" style={{ position: "relative" }}>
        <div className="candle-left" />
        <div className="candle-right" />
        <div className="candle-top-left" />
        <div className="candle-top-right" />

        <div className="w-full" style={{ maxWidth: 680, marginBottom: "1.5rem" }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-100"
            style={{
              color: `${GOLD}0.5)`,
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              fontFamily: "'Amarante', serif",
              textTransform: "uppercase",
              opacity: 0.7
            }}
          >
            <ArrowLeft style={{ width: 12, height: 12 }} /> Return Home
          </Link>
        </div>

        <div className="flex flex-col items-center" style={{ marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
            <button
              onClick={() => setSelectedYear(y => y - 1)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 0.25rem",
                color: `${GOLD}0.4)`,
                fontFamily: "'Amarante', serif",
                fontSize: "0.75rem",
                lineHeight: 1,
                transition: "color 0.2s"
              }}
              aria-label="Previous year"
            >
              ‹
            </button>
            <p className="font-cinzel" style={{ fontSize: "0.65rem", letterSpacing: "0.35em", color: `${GOLD}0.55)` }}>
              {selectedYear}
            </p>
            <button
              onClick={() => setSelectedYear(y => y + 1)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 0.25rem",
                color: `${GOLD}0.4)`,
                fontFamily: "'Amarante', serif",
                fontSize: "0.75rem",
                lineHeight: 1,
                transition: "color 0.2s"
              }}
              aria-label="Next year"
            >
              ›
            </button>
          </div>

          <h1
            className="font-cinzel text-center"
            style={{
              fontSize: "clamp(2rem, 6vw, 3rem)",
              letterSpacing: "0.18em",
              color: "rgba(232,212,168,0.92)",
              textTransform: "uppercase",
              lineHeight: 1.1
            }}
          >
            Lunar Library
          </h1>
          <p className="font-cinzel" style={{ fontSize: "0.6rem", letterSpacing: "0.35em", color: `${GOLD}0.4)`, marginTop: "0.5rem", textTransform: "uppercase" }}>
            ── Full Moons of the Year ──
          </p>
        </div>

        <svg width="260" height="18" viewBox="0 0 260 18" fill="none" style={{ marginBottom: "2rem", marginTop: "0.5rem" }}>
          <line x1="0" y1="9" x2="110" y2="9" stroke={`${GOLD}0.20)`} strokeWidth="0.6" />
          <polygon points="120,5 130,9 120,13" fill={`${GOLD}0.35)`} />
          <circle cx="130" cy="9" r="3" fill={`${GOLD}0.45)`} />
          <polygon points="140,5 130,9 140,13" fill={`${GOLD}0.35)`} />
          <line x1="150" y1="9" x2="260" y2="9" stroke={`${GOLD}0.20)`} strokeWidth="0.6" />
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "1.25rem", width: "100%", maxWidth: 680 }}>
          {moonsForYear.map((moon, index) => {
            const isPast = pastIds.has(moon.id);
            const isNext = moon.id === nextId;
            const dateObj = new Date(moon.date + "T12:00:00Z");
            const monthName = dateObj.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
            const dayNum = dateObj.toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" });
            const isSingleLast = index === moonsForYear.length - 1 && moonsForYear.length % 2 !== 0;

            return (
              <motion.div
                key={moon.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                style={isSingleLast ? { gridColumn: "1 / -1", display: "flex", justifyContent: "center" } : undefined}
              >
                <Link href={`/moon/${moon.id}`} style={{ display: "block", textDecoration: "none", width: isSingleLast ? "190px" : "100%" }}>
                  <div
                    style={{
                      background: isNext
                        ? "linear-gradient(135deg, rgba(198,164,69,0.10) 0%, rgba(140,110,40,0.06) 100%)"
                        : "linear-gradient(135deg, rgba(30,22,10,0.72) 0%, rgba(18,14,6,0.80) 100%)",
                      border: isNext ? `1px solid ${GOLD}0.40)` : `1px solid ${GOLD}0.14)`,
                      borderRadius: 4,
                      padding: "1.1rem 1rem 1rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      opacity: isPast ? 0.52 : 1,
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      boxShadow: isNext ? "0 0 18px rgba(198,164,69,0.12), inset 0 0 12px rgba(198,164,69,0.04)" : "none",
                      cursor: "pointer",
                      position: "relative"
                    }}
                    className="moon-card"
                  >
                    {isNext && (
                      <span className="font-cinzel" style={{ position: "absolute", top: 7, right: 9, fontSize: "0.5rem", letterSpacing: "0.2em", color: `${GOLD}0.7)`, textTransform: "uppercase" }}>
                        Next
                      </span>
                    )}
                    {isPast && (
                      <span className="font-cinzel" style={{ position: "absolute", top: 7, right: 9, fontSize: "0.5rem", letterSpacing: "0.2em", color: `${GOLD}0.35)`, textTransform: "uppercase" }}>
                        Past
                      </span>
                    )}

                    <MiniMoonIcon />

                    <p className="font-cinzel" style={{ fontSize: "0.58rem", letterSpacing: "0.25em", color: `${GOLD}0.45)`, textTransform: "uppercase" }}>
                      {monthName} {dayNum}
                    </p>

                    <h2 className="font-cinzel text-center" style={{ fontSize: "0.95rem", letterSpacing: "0.08em", color: isPast ? `${GOLD}0.60)` : "rgba(232,212,168,0.90)", lineHeight: 1.25 }}>
                      {moon.name}
                    </h2>

                    <p style={{ fontSize: "0.72rem", fontFamily: "'Crimson Text', serif", fontStyle: "italic", color: `${GOLD}0.45)`, letterSpacing: "0.04em" }}>
                      {moon.astrologicalSign}
                    </p>

                    <div style={{ marginTop: 2 }}>
                      <ElementTag element={moon.element} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 mb-4 font-cinzel" style={{ color: `${GOLD}0.25)`, fontSize: "0.75rem", letterSpacing: "0.3em" }}>
          ☽   ○   ☾
        </div>
      </div>
    </motion.div>
  );
}
