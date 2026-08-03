import React, { useState, useEffect, useCallback } from 'react';
import { City, LocationSource, SkyPosition } from '../types';
import { CITIES, REGIONS, getSavedCity, saveCity } from '../data/cities';
import { calculateSkyPosition, getDirectionCardinal, formatTime } from '../utils/moonCalc';

const GOLD = "rgba(198,164,69,";

const CANCEL_BTN_STYLE: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  color: `${GOLD}0.38)`,
  fontSize: "0.6rem",
  letterSpacing: "0.15em",
  fontFamily: "'Amarante', serif",
  textTransform: "uppercase"
};

const SELECT_STYLE: React.CSSProperties = {
  background: "rgba(8,5,9,0.85)",
  border: `1px solid ${GOLD}0.30)`,
  color: "#c4ad7e",
  fontSize: "0.7rem",
  letterSpacing: "0.06em",
  padding: "4px 6px",
  cursor: "pointer",
  fontFamily: "'Amarante', serif",
  width: "100%",
  outline: "none"
};

const DEFAULT_SKY_POSITION: SkyPosition = {
  altitude: 0,
  azimuth: 0,
  isVisible: false,
  riseTime: null,
  setTime: null
};

export function useSkyLocation() {
  const [source, setSource] = useState<LocationSource>({ kind: "loading" });
  const [skyPos, setSkyPos] = useState<SkyPosition>(DEFAULT_SKY_POSITION);

  useEffect(() => {
    let cancelled = false;
    if (!navigator.geolocation) {
      setSource({ kind: "city", city: getSavedCity() });
      return;
    }
    const timer = setTimeout(() => {
      if (!cancelled) setSource({ kind: "city", city: getSavedCity() });
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      pos => {
        clearTimeout(timer);
        if (!cancelled) {
          setSource({ kind: "geo", lat: pos.coords.latitude, lon: pos.coords.longitude });
        }
      },
      () => {
        clearTimeout(timer);
        if (!cancelled) {
          setSource({ kind: "city", city: getSavedCity() });
        }
      },
      { timeout: 7000, maximumAge: 60000 }
    );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (source.kind === "loading") return;
    let lat: number, lon: number;

    if (source.kind === "geo") {
      lat = source.lat;
      lon = source.lon;
    } else if (source.city) {
      lat = source.city.lat;
      lon = source.city.lon;
    } else {
      return;
    }

    setSkyPos(calculateSkyPosition(lat, lon));
    const interval = setInterval(() => {
      setSkyPos(calculateSkyPosition(lat, lon));
    }, 60000);

    return () => clearInterval(interval);
  }, [source]);

  const setCity = useCallback((city: City) => {
    saveCity(city);
    setSource({ kind: "city", city });
  }, []);

  return { ...skyPos, source, setCity };
}

export function CitySelector({
  onSelect,
  onCancel,
  canCancel
}: {
  onSelect: (city: City) => void;
  onCancel?: () => void;
  canCancel: boolean;
}) {
  const [region, setRegion] = useState("Americas");
  const filtered = CITIES.filter(c => c.region === region);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4 px-3 w-full">
      <span style={{ fontSize: "1.3rem", opacity: 0.45 }}>☽</span>
      <p className="font-cinzel text-[9px] tracking-widest uppercase text-center" style={{ color: `${GOLD}0.50)` }}>
        Choose your city
      </p>

      <div className="w-full flex flex-col gap-2">
        <select value={region} onChange={e => setRegion(e.target.value)} style={SELECT_STYLE}>
          {REGIONS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <select
          defaultValue=""
          onChange={e => {
            const found = CITIES.find(c => c.name === e.target.value);
            if (found) onSelect(found);
          }}
          style={SELECT_STYLE}
        >
          <option value="" disabled>— choose city —</option>
          {filtered.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {canCancel && onCancel && (
        <button onClick={onCancel} style={CANCEL_BTN_STYLE}>
          ‹ cancel
        </button>
      )}
    </div>
  );
}

export function LocationHeader({
  source,
  onChangeCityClick
}: {
  source: LocationSource;
  onChangeCityClick: () => void;
}) {
  const name =
    source.kind === "geo"
      ? "◦ your location ◦"
      : source.kind === "city" && source.city
      ? source.city.name
      : "";

  return (
    <div className="flex items-center justify-between w-full" style={{ borderBottom: `1px solid ${GOLD}0.12)`, paddingBottom: 6 }}>
      <span className="font-cinzel text-[9px] tracking-widest uppercase" style={{ color: `${GOLD}0.45)` }}>
        {name}
      </span>
      <button onClick={onChangeCityClick} style={CANCEL_BTN_STYLE}>
        {source.kind === "geo" ? "use city ›" : "change ›"}
      </button>
    </div>
  );
}

export function CompassRadar({
  altitude,
  azimuth,
  isVisible
}: {
  altitude: number;
  azimuth: number;
  isVisible: boolean;
}) {
  const normAlt = Math.max(-90, Math.min(90, altitude));
  const normAz = (azimuth - 90) * (Math.PI / 180);
  const altFraction = Math.max(0, 1 - normAlt / 90);

  const cx = 90;
  const cy = 90;
  const radius = 72;

  const moonX = cx + radius * altFraction * Math.cos(normAz);
  const moonY = cy + radius * altFraction * Math.sin(normAz);
  const isBelow = altitude < 0;

  const directions = [
    { label: "N", angle: -90 },
    { label: "E", angle: 0 },
    { label: "S", angle: 90 },
    { label: "W", angle: 180 }
  ];

  return (
    <svg width="180" height="180" viewBox="0 0 180 180" style={{ overflow: "visible" }}>
      {[72, 54, 36, 18].map(r => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={`${GOLD}${r === 72 ? "0.22" : "0.10"})`}
          strokeWidth={r === 72 ? "0.9" : "0.5"}
          strokeDasharray={r === 72 ? "3 4" : "2 5"}
        />
      ))}

      {directions.map(({ label, angle }) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <g key={label}>
            <line
              x1={cx}
              y1={cy}
              x2={cx + radius * Math.cos(rad)}
              y2={cy + radius * Math.sin(rad)}
              stroke={`${GOLD}0.12)`}
              strokeWidth="0.6"
            />
            <text
              x={cx + 83 * Math.cos(rad)}
              y={cy + 83 * Math.sin(rad)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7.5"
              fill={`${GOLD}0.50)`}
              fontFamily="'Amarante',serif"
            >
              {label}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={`${GOLD}0.38)`} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="2.5" fill="none" stroke={`${GOLD}0.30)`} strokeWidth="0.8" />
      <text x={cx} y={82} textAnchor="middle" fontSize="6" fill={`${GOLD}0.32)`} fontFamily="'Amarante',serif">
        Z
      </text>

      {isBelow ? (
        <>
          <circle cx={cx} cy={154} r="4" fill="none" stroke="rgba(180,170,200,0.22)" strokeWidth="0.8" strokeDasharray="2 3" />
          <text x={cx} y={155} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="rgba(180,170,200,0.28)">
            ☽
          </text>
        </>
      ) : (
        <>
          <circle cx={moonX} cy={moonY} r="8" fill={`${GOLD}0.08)`} />
          <circle cx={moonX} cy={moonY} r="5" fill={`${GOLD}0.50)`} />
          <circle cx={moonX} cy={moonY} r="2.5" fill="#e8d4a8" />
        </>
      )}

      {!isVisible && (
        <text x={cx} y={176} textAnchor="middle" fontSize="6.5" fill="rgba(180,170,200,0.30)" fontFamily="'Amarante',serif">
          below horizon
        </text>
      )}
    </svg>
  );
}

export function MoonInSkyWidget() {
  const { altitude, azimuth, isVisible, riseTime, setTime, source, setCity } = useSkyLocation();
  const [selectingCity, setSelectingCity] = useState(false);

  if (source.kind === "loading") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <span style={{ fontSize: "1.2rem", opacity: 0.35, animation: "pulse 2s infinite" }}>☽</span>
        <p className="font-cinzel text-[9px] tracking-widest uppercase" style={{ color: `${GOLD}0.35)` }}>
          Seeking location…
        </p>
      </div>
    );
  }

  if (selectingCity || (source.kind === "city" && !source.city)) {
    return (
      <CitySelector
        onSelect={city => {
          setCity(city);
          setSelectingCity(false);
        }}
        onCancel={source.kind !== "city" || source.city ? () => setSelectingCity(false) : undefined}
        canCancel={source.kind === "geo" || (source.kind === "city" && !!source.city)}
      />
    );
  }

  const isPrecise = source.kind === "geo";

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <LocationHeader source={source} onChangeCityClick={() => setSelectingCity(true)} />

      <div
        style={{
          padding: "3px 14px",
          border: `1px solid ${isVisible ? "rgba(198,164,69,0.55)" : "rgba(100,100,120,0.35)"}`,
          background: isVisible ? "rgba(198,164,69,0.10)" : "rgba(30,28,40,0.6)"
        }}
      >
        <span
          className="font-cinzel tracking-[0.25em] text-[10px] uppercase"
          style={{ color: isVisible ? "#c6a445" : "rgba(180,170,200,0.45)" }}
        >
          {isVisible ? "◉ Visible" : "◎ Not Visible"}
        </span>
      </div>

      <CompassRadar altitude={altitude} azimuth={azimuth} isVisible={isVisible} />

      <div className="w-full grid grid-cols-2 gap-x-3 gap-y-3" style={{ borderTop: `1px solid ${GOLD}0.14)`, paddingTop: 10 }}>
        {[
          { label: "Altitude", value: `${altitude >= 0 ? "+" : ""}${altitude.toFixed(1)}°` },
          { label: "Direction", value: getDirectionCardinal(azimuth) },
          { label: "Moonrise", value: formatTime(riseTime) },
          { label: "Moonset", value: formatTime(setTime) }
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-cinzel text-[8px] tracking-widest uppercase mb-0.5" style={{ color: `${GOLD}0.36)` }}>
              {label}
            </p>
            <p className="font-cinzel text-[12px]" style={{ color: "#c6a445" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {isPrecise && (
        <p className="font-cinzel text-[7.5px] tracking-widest" style={{ color: `${GOLD}0.28)`, marginTop: -4 }}>
          ◦ precise location ◦
        </p>
      )}
    </div>
  );
}
