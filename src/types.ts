export interface Ritual {
  name: string;
  description: string;
}

export interface FullMoon {
  id: string;
  date: string;
  name: string;
  emoji?: string;
  astrologicalSign: string;
  element: string;
  mythology?: string;
  spiritualMeaning?: string;
  rituals?: Ritual[];
  crystals?: string[];
  herbs?: string[];
  color?: string;
}

export interface PhaseDescription {
  symbol: string;
  description: string;
  energy: string;
}

export interface City {
  name: string;
  region: string;
  lat: number;
  lon: number;
}

export interface SkyPosition {
  altitude: number;
  azimuth: number;
  isVisible: boolean;
  riseTime: Date | null;
  setTime: Date | null;
}

export type LocationSource =
  | { kind: 'loading' }
  | { kind: 'geo'; lat: number; lon: number }
  | { kind: 'city'; city: City | null };
