import React, { useMemo } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Sparkles, Flame, Droplets, Wind, Mountain, Star } from 'lucide-react';
import { FULL_MOONS_2026 } from '../data/moons';
import { generateFullMoonsForYear } from '../utils/moonCalc';
import { HandDrawnMoon } from '../components/MoonPhaseGraphic';
import { FullMoon } from '../types';

export function MoonDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const moonData: FullMoon | null = useMemo(() => {
    const foundIn2026 = FULL_MOONS_2026.find(m => m.id === id);
    if (foundIn2026) return foundIn2026;
    if (!id) return null;

    const match = id.match(/^(.+)-(\d{4})$/);
    if (!match) return null;

    const baseNameSlug = match[1];
    const year = parseInt(match[2], 10);

    const yearMoons = generateFullMoonsForYear(year);
    const generatedMatch = yearMoons.find(m => m.id === id);
    if (!generatedMatch) return null;

    const template = FULL_MOONS_2026.find(m => m.id.startsWith(baseNameSlug + "-") || m.name === generatedMatch.name);
    if (!template) return null;

    return {
      ...template,
      id,
      date: generatedMatch.date,
      astrologicalSign: generatedMatch.astrologicalSign,
      element: generatedMatch.element
    };
  }, [id]);

  if (!moonData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-serif mb-4" style={{ color: "#e8d4a8" }}>
          Moon Not Found
        </h1>
        <p className="text-muted-foreground mb-8" style={{ color: "rgba(232,212,168,0.5)" }}>
          This celestial body has hidden its face.
        </p>
        <Link href="/" className="text-primary hover:underline flex items-center gap-2" style={{ color: "#c6a445" }}>
          <ArrowLeft className="w-4 h-4" /> Return to the Sky
        </Link>
      </div>
    );
  }

  const renderElementIcon = () => {
    switch (moonData.element) {
      case "Water":
        return <Droplets className="w-4 h-4" />;
      case "Fire":
        return <Flame className="w-4 h-4" />;
      case "Earth":
        return <Mountain className="w-4 h-4" />;
      case "Air":
        return <Wind className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const formattedDate = new Date(moonData.date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="container max-w-4xl mx-auto px-4 py-8 md:py-12 pb-24"
      data-testid={`page-moon-detail-${moonData.id}`}
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group text-sm uppercase tracking-wider font-medium"
        style={{ color: "rgba(198,164,69,0.7)" }}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return Home
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-5 flex flex-col items-center text-center space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full shadow-[0_0_120px_rgba(230,213,184,0.2)] pointer-events-none -z-10" />
            <HandDrawnMoon phaseName="Full Moon" size={240} />
          </motion.div>

          <div className="space-y-4">
            <h1
              className="text-4xl md:text-5xl font-serif text-primary tracking-wide leading-tight"
              style={{ color: moonData.color || "#c6a445" }}
            >
              {moonData.name}
            </h1>
            <div className="text-lg text-muted-foreground font-light font-serif" style={{ color: "rgba(232,212,168,0.7)" }}>
              {formattedDate}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span
                className="bg-background/50 border border-primary/30 text-foreground px-3 py-1 text-sm font-normal rounded-md inline-flex items-center"
                style={{ background: "rgba(12,10,16,0.6)", border: "1px solid rgba(198,164,69,0.3)", color: "#e8d4a8" }}
              >
                <Star className="w-3.5 h-3.5 mr-2 text-primary" style={{ color: "#c6a445" }} /> {moonData.astrologicalSign}
              </span>
              <span
                className="bg-background/50 border border-primary/30 text-foreground px-3 py-1 text-sm font-normal rounded-md inline-flex items-center"
                style={{ background: "rgba(12,10,16,0.6)", border: "1px solid rgba(198,164,69,0.3)", color: "#e8d4a8" }}
              >
                {renderElementIcon()} <span className="ml-2">{moonData.element}</span>
              </span>
            </div>
          </div>

          <div className="w-full pt-6 border-t border-border/40 space-y-6" style={{ borderColor: "rgba(198,164,69,0.2)" }}>
            {moonData.crystals && moonData.crystals.length > 0 && (
              <div>
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-3" style={{ color: "rgba(198,164,69,0.5)" }}>
                  Sacred Stones
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {moonData.crystals.map(crystal => (
                    <span
                      key={crystal}
                      className="px-3 py-1 bg-card/60 rounded-full text-xs border border-border/50 text-foreground/80"
                      style={{ background: "rgba(20,15,25,0.7)", border: "1px solid rgba(198,164,69,0.2)", color: "#e8d4a8" }}
                    >
                      {crystal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {moonData.herbs && moonData.herbs.length > 0 && (
              <div>
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-3" style={{ color: "rgba(198,164,69,0.5)" }}>
                  Botanicals
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {moonData.herbs.map(herb => (
                    <span
                      key={herb}
                      className="px-3 py-1 bg-card/60 rounded-full text-xs border border-border/50 text-foreground/80"
                      style={{ background: "rgba(20,15,25,0.7)", border: "1px solid rgba(198,164,69,0.2)", color: "#e8d4a8" }}
                    >
                      {herb}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-7 space-y-10">
          {moonData.mythology && (
            <section
              className="bg-card/30 rounded-2xl p-6 md:p-8 border border-border/40 relative overflow-hidden backdrop-blur-sm"
              style={{ background: "rgba(20,15,25,0.5)", border: "1px solid rgba(198,164,69,0.2)" }}
            >
              <BookOpen className="absolute top-4 right-4 w-24 h-24 text-primary/5 -z-10 rotate-12" style={{ color: "rgba(198,164,69,0.05)" }} />
              <h2 className="text-2xl font-serif mb-4 flex items-center gap-3 text-primary" style={{ color: "#c6a445" }}>
                <Sparkles className="w-5 h-5 text-primary/70" style={{ color: "rgba(198,164,69,0.7)" }} /> Mythology & Lore
              </h2>
              <p className="text-foreground/80 leading-relaxed font-light" style={{ color: "#e8d4a8", opacity: 0.9 }}>
                {moonData.mythology}
              </p>
            </section>
          )}

          {moonData.spiritualMeaning && (
            <section
              className="bg-card/30 rounded-2xl p-6 md:p-8 border border-border/40 backdrop-blur-sm"
              style={{ background: "rgba(20,15,25,0.5)", border: "1px solid rgba(198,164,69,0.2)" }}
            >
              <h2 className="text-2xl font-serif mb-4 text-primary" style={{ color: "#c6a445" }}>
                Spiritual Meaning
              </h2>
              <p className="text-foreground/80 leading-relaxed font-light text-lg italic" style={{ color: "#e8d4a8", opacity: 0.9 }}>
                "{moonData.spiritualMeaning}"
              </p>
            </section>
          )}

          {moonData.rituals && moonData.rituals.length > 0 && (
            <section>
              <h2 className="text-2xl font-serif mb-6 text-primary flex items-center gap-2" style={{ color: "#c6a445" }}>
                <Flame className="w-5 h-5" /> Suggested Rituals
              </h2>
              <div className="grid gap-4">
                {moonData.rituals.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-5 rounded-xl border border-border/50 bg-card/20 hover:bg-card/40 transition-colors"
                    style={{ background: "rgba(20,15,25,0.4)", border: "1px solid rgba(198,164,69,0.2)" }}
                  >
                    <h4 className="font-serif text-lg mb-2 text-foreground/90" style={{ color: "#f3e5c4" }}>
                      {r.name}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light" style={{ color: "rgba(232,212,168,0.7)" }}>
                      {r.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
}
