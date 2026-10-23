import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Student } from '../../types/erp';
import { CHEM_NUMERICAL_CHALLENGES } from '../../data/initialData';

interface ChemLab3DSimulatorProps {
  currentStudent: Student;
  handleAwardBonusXP: (studentId: string, amount: number, reason: string) => void;
  playUISound: (type?: string) => void;
  showToast: (title: string, description: string, type?: string) => void;
}

export type ElementCategory =
  | 'Alkali Metal (Explosive)'
  | 'Alkaline Earth Metal'
  | 'Transition Metal'
  | 'Reactive Non-Metal'
  | 'Halogen'
  | 'Noble Gas'
  | 'Lab Acid / Base / Salt';

export interface PeriodicChemItem {
  id: string;
  symbol: string;
  name: string;
  atomicNumber?: number;
  molarMass: string;
  category: ElementCategory;
  stateType: 'solid' | 'liquid' | 'gas';
  colorHex: string; // Color imparted or natural color
  solidColorHex: string;
  phDelta: number; // Negative = acidic, Positive = basic
  reactivityLevel: number; // 0 = inert, 1 = mild, 2 = vigorous, 3 = EXPLOSIVE BLAST
  shortDesc: string;
}

export const PERIODIC_AND_LAB_CHEMICALS: PeriodicChemItem[] = [
  // --- ALKALI METALS (GROUP 1 - HIGHLY REACTIVE / EXPLOSIVE IN WATER & ACID) ---
  {
    id: 'h',
    symbol: 'H₂',
    name: 'Hydrogen',
    atomicNumber: 1,
    molarMass: '2.016 g/mol',
    category: 'Reactive Non-Metal',
    stateType: 'gas',
    colorHex: '#60A5FA',
    solidColorHex: '#93C5FD',
    phDelta: 0,
    reactivityLevel: 2,
    shortDesc: 'Flammable diatomic gas; explodes with a sharp POP when ignited with Oxygen or Halogens!'
  },
  {
    id: 'li',
    symbol: 'Li',
    name: 'Lithium',
    atomicNumber: 3,
    molarMass: '6.94 u',
    category: 'Alkali Metal (Explosive)',
    stateType: 'solid',
    colorHex: '#F43F5E',
    solidColorHex: '#CBD5E1',
    phDelta: +4.5,
    reactivityLevel: 2,
    shortDesc: 'Lightest alkali metal; fizzes vigorously on liquid surface releasing H₂ gas and crimson-red flame tint.'
  },
  {
    id: 'na',
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    molarMass: '22.99 u',
    category: 'Alkali Metal (Explosive)',
    stateType: 'solid',
    colorHex: '#F59E0B',
    solidColorHex: '#F1F5F9',
    phDelta: +5.5,
    reactivityLevel: 3,
    shortDesc: 'Soft silvery alkali metal; darts on water/acid surface and BLASTS with golden-yellow exothermic flames!'
  },
  {
    id: 'k',
    symbol: 'K',
    name: 'Potassium',
    atomicNumber: 19,
    molarMass: '39.10 u',
    category: 'Alkali Metal (Explosive)',
    stateType: 'solid',
    colorHex: '#A855F7',
    solidColorHex: '#E2E8F0',
    phDelta: +6.2,
    reactivityLevel: 3,
    shortDesc: 'Explodes instantaneously on contact with water or acid with a lilac-violet fireball blast!'
  },
  {
    id: 'rb',
    symbol: 'Rb',
    name: 'Rubidium',
    atomicNumber: 37,
    molarMass: '85.47 u',
    category: 'Alkali Metal (Explosive)',
    stateType: 'solid',
    colorHex: '#EC4899',
    solidColorHex: '#CBD5E1',
    phDelta: +6.5,
    reactivityLevel: 3,
    shortDesc: 'Heavy alkali metal; violently detonates in aqueous or acidic solutions with a red-violet shockwave!'
  },
  {
    id: 'cs',
    symbol: 'Cs',
    name: 'Cesium',
    atomicNumber: 55,
    molarMass: '132.91 u',
    category: 'Alkali Metal (Explosive)',
    stateType: 'solid',
    colorHex: '#6366F1',
    solidColorHex: '#FEF08A',
    phDelta: +6.8,
    reactivityLevel: 3,
    shortDesc: 'Most electropositive metal; shatters glass test tubes on contact with water or acid!'
  },

  // --- ALKALINE EARTH METALS (GROUP 2) ---
  {
    id: 'mg',
    symbol: 'Mg',
    name: 'Magnesium',
    atomicNumber: 12,
    molarMass: '24.31 u',
    category: 'Alkaline Earth Metal',
    stateType: 'solid',
    colorHex: '#E2E8F0',
    solidColorHex: '#94A3B8',
    phDelta: +2.8,
    reactivityLevel: 2,
    shortDesc: 'Silvery ribbon; reacts rapidly with acids liberating H₂ gas and burns with blinding white light.'
  },
  {
    id: 'ca',
    symbol: 'Ca',
    name: 'Calcium',
    atomicNumber: 20,
    molarMass: '40.08 u',
    category: 'Alkaline Earth Metal',
    stateType: 'solid',
    colorHex: '#F8FAFC',
    solidColorHex: '#E2E8F0',
    phDelta: +3.8,
    reactivityLevel: 2,
    shortDesc: 'Sinks in water/acid, evolving steady streams of H₂ bubbles and forming milky Calcium Hydroxide.'
  },
  {
    id: 'ba',
    symbol: 'Ba',
    name: 'Barium',
    atomicNumber: 56,
    molarMass: '137.33 u',
    category: 'Alkaline Earth Metal',
    stateType: 'solid',
    colorHex: '#84CC16',
    solidColorHex: '#94A3B8',
    phDelta: +4.0,
    reactivityLevel: 2,
    shortDesc: 'Forms dense white BaSO₄ precipitate with Sulfuric Acid and apple-green flame color.'
  },

  // --- TRANSITION METALS (VIVID COLOR CHANGERS!) ---
  {
    id: 'cr',
    symbol: 'Cr',
    name: 'Chromium (Cr₂O₇²⁻)',
    atomicNumber: 24,
    molarMass: '52.00 u',
    category: 'Transition Metal',
    stateType: 'liquid',
    colorHex: '#F97316',
    solidColorHex: '#EA580C',
    phDelta: -0.8,
    reactivityLevel: 1,
    shortDesc: 'Fiery Dichromate Orange (#F97316) in acid; shifts to Emerald Green (Cr³⁺) when reduced by Zn, Fe, or S!'
  },
  {
    id: 'mn',
    symbol: 'Mn',
    name: 'Manganese (MnO₄⁻)',
    atomicNumber: 25,
    molarMass: '54.94 u',
    category: 'Transition Metal',
    stateType: 'liquid',
    colorHex: '#9333EA',
    solidColorHex: '#7E22CE',
    phDelta: -0.5,
    reactivityLevel: 2,
    shortDesc: 'Intense Royal Purple Permanganate; turns Emerald Green in alkali or decolorizes with Fe / H₂O₂!'
  },
  {
    id: 'fe',
    symbol: 'Fe',
    name: 'Iron',
    atomicNumber: 26,
    molarMass: '55.85 u',
    category: 'Transition Metal',
    stateType: 'solid',
    colorHex: '#22C55E',
    solidColorHex: '#475569',
    phDelta: +0.5,
    reactivityLevel: 1,
    shortDesc: 'Turns blue Copper solutions Pale Mint Green (Fe²⁺) or forms Blood-Orange Ferric (Fe³⁺) with Chlorine!'
  },
  {
    id: 'co',
    symbol: 'Co',
    name: 'Cobalt',
    atomicNumber: 27,
    molarMass: '58.93 u',
    category: 'Transition Metal',
    stateType: 'liquid',
    colorHex: '#F43F5E',
    solidColorHex: '#E11D48',
    phDelta: 0,
    reactivityLevel: 1,
    shortDesc: 'Rose-Pink hydrated complex [Co(H₂O)₆]²⁺ at room temp; shifts to Deep Royal Blue when heated!'
  },
  {
    id: 'ni',
    symbol: 'Ni',
    name: 'Nickel',
    atomicNumber: 28,
    molarMass: '58.69 u',
    category: 'Transition Metal',
    stateType: 'liquid',
    colorHex: '#10B981',
    solidColorHex: '#64748B',
    phDelta: 0,
    reactivityLevel: 1,
    shortDesc: 'Dissolves in acids to form a vivid Apple-Emerald Green [Ni(H₂O)₆]²⁺ solution.'
  },
  {
    id: 'cu',
    symbol: 'Cu',
    name: 'Copper (Cu²⁺ / CuO)',
    atomicNumber: 29,
    molarMass: '63.55 u',
    category: 'Transition Metal',
    stateType: 'solid',
    colorHex: '#06B6D4',
    solidColorHex: '#B45309',
    phDelta: +0.6,
    reactivityLevel: 1,
    shortDesc: 'Forms brilliant Aquamarine Cyan-Blue CuCl₂ in HCl and Deep Sapphire Blue in Ammonia!'
  },
  {
    id: 'zn',
    symbol: 'Zn',
    name: 'Zinc',
    atomicNumber: 30,
    molarMass: '65.38 u',
    category: 'Transition Metal',
    stateType: 'solid',
    colorHex: '#38BDF8',
    solidColorHex: '#64748B',
    phDelta: +1.2,
    reactivityLevel: 2,
    shortDesc: 'Amphoteric metal; releases rapid streams of H₂ gas bubbles in HCl, H₂SO₄, and NaOH.'
  },
  {
    id: 'ag',
    symbol: 'Ag',
    name: 'Silver (Ag⁺)',
    atomicNumber: 47,
    molarMass: '107.87 u',
    category: 'Transition Metal',
    stateType: 'liquid',
    colorHex: '#F8FAFC',
    solidColorHex: '#E2E8F0',
    phDelta: -0.2,
    reactivityLevel: 1,
    shortDesc: 'Instantly precipitates Curdy White AgCl↓ with Cl/HCl, Cream AgBr↓ with Br, and Yellow AgI↓ with I!'
  },
  {
    id: 'au',
    symbol: 'Au',
    name: 'Gold',
    atomicNumber: 79,
    molarMass: '196.97 u',
    category: 'Transition Metal',
    stateType: 'solid',
    colorHex: '#EAB308',
    solidColorHex: '#FACC15',
    phDelta: 0,
    reactivityLevel: 0,
    shortDesc: 'Noble metal; unreactive in single acids, but dissolves in Aqua Regia (HCl + HNO₃) to turn Golden Yellow!'
  },

  // --- REACTIVE NON-METALS & HALOGENS ---
  {
    id: 'o',
    symbol: 'O₂',
    name: 'Oxygen / Peroxide',
    atomicNumber: 8,
    molarMass: '32.00 g/mol',
    category: 'Reactive Non-Metal',
    stateType: 'liquid',
    colorHex: '#38BDF8',
    solidColorHex: '#BAE6FD',
    phDelta: -0.2,
    reactivityLevel: 2,
    shortDesc: 'Strong oxidizer; triggers explosive combustion with H₂, P, or Alkali Metals!'
  },
  {
    id: 'p',
    symbol: 'P',
    name: 'White Phosphorus',
    atomicNumber: 15,
    molarMass: '30.97 u',
    category: 'Reactive Non-Metal',
    stateType: 'solid',
    colorHex: '#FEF08A',
    solidColorHex: '#FDE047',
    phDelta: -1.5,
    reactivityLevel: 3,
    shortDesc: 'Pyrophoric element; bursts into blinding yellow-white flames with Oxygen, HNO₃, or Halogens!'
  },
  {
    id: 's',
    symbol: 'S',
    name: 'Sulfur',
    atomicNumber: 16,
    molarMass: '32.06 u',
    category: 'Reactive Non-Metal',
    stateType: 'solid',
    colorHex: '#FACC15',
    solidColorHex: '#EAB308',
    phDelta: -1.0,
    reactivityLevel: 2,
    shortDesc: 'Bright yellow solid; forms colloidal yellow suspension or explodes with strong oxidizers like KMnO₄!'
  },
  {
    id: 'f',
    symbol: 'F₂',
    name: 'Fluorine',
    atomicNumber: 9,
    molarMass: '38.00 g/mol',
    category: 'Halogen',
    stateType: 'gas',
    colorHex: '#FDE047',
    solidColorHex: '#FEF08A',
    phDelta: -4.5,
    reactivityLevel: 3,
    shortDesc: 'Most electronegative element on Earth; hypergolically BLASTS on contact with water, metals, or H₂!'
  },
  {
    id: 'cl',
    symbol: 'Cl₂',
    name: 'Chlorine',
    atomicNumber: 17,
    molarMass: '70.90 g/mol',
    category: 'Halogen',
    stateType: 'liquid',
    colorHex: '#A3E635',
    solidColorHex: '#84CC16',
    phDelta: -2.8,
    reactivityLevel: 2,
    shortDesc: 'Pale yellow-green halogen; turns Fe²⁺ blood-orange, forms white AgCl↓ with Silver, and bleaches dyes.'
  },
  {
    id: 'br',
    symbol: 'Br₂',
    name: 'Bromine',
    atomicNumber: 35,
    molarMass: '159.81 g/mol',
    category: 'Halogen',
    stateType: 'liquid',
    colorHex: '#DC2626',
    solidColorHex: '#991B1B',
    phDelta: -2.0,
    reactivityLevel: 2,
    shortDesc: 'Dense fuming reddish-brown liquid halogen; forms cream precipitate with Silver.'
  },
  {
    id: 'i',
    symbol: 'I₂',
    name: 'Iodine',
    atomicNumber: 53,
    molarMass: '253.81 g/mol',
    category: 'Halogen',
    stateType: 'solid',
    colorHex: '#7C3AED',
    solidColorHex: '#4C1D95',
    phDelta: -0.5,
    reactivityLevel: 1,
    shortDesc: 'Lustrous dark-violet crystals; turns solution rich Violet/Amber and forms bright Yellow AgI↓ with Silver!'
  },

  // --- ESSENTIAL LAB ACIDS, BASES & SALTS ---
  {
    id: 'h2o',
    symbol: 'H₂O',
    name: 'Distilled Water',
    molarMass: '18.015 g/mol',
    category: 'Lab Acid / Base / Salt',
    stateType: 'liquid',
    colorHex: '#38BDF8',
    solidColorHex: '#BAE6FD',
    phDelta: 0,
    reactivityLevel: 0,
    shortDesc: 'Universal polar solvent (pH 7.0); reacts explosively with Na, K, Rb, Cs, and F₂!'
  },
  {
    id: 'hcl',
    symbol: 'HCl',
    name: 'Hydrochloric Acid',
    molarMass: '36.46 g/mol',
    category: 'Lab Acid / Base / Salt',
    stateType: 'liquid',
    colorHex: '#60A5FA',
    solidColorHex: '#93C5FD',
    phDelta: -5.5,
    reactivityLevel: 2,
    shortDesc: 'Strong mineral acid (pH 1.2); turns Blue Litmus Red, dissolves metals, and forms CuCl₂ / AgCl↓.'
  },
  {
    id: 'h2so4',
    symbol: 'H₂SO₄',
    name: 'Sulfuric Acid',
    molarMass: '98.08 g/mol',
    category: 'Lab Acid / Base / Salt',
    stateType: 'liquid',
    colorHex: '#818CF8',
    solidColorHex: '#6366F1',
    phDelta: -5.8,
    reactivityLevel: 2,
    shortDesc: 'King of Chemicals (pH 1.0); strongly exothermic dehydrating acid.'
  },
  {
    id: 'hno3',
    symbol: 'HNO₃',
    name: 'Nitric Acid',
    molarMass: '63.01 g/mol',
    category: 'Lab Acid / Base / Salt',
    stateType: 'liquid',
    colorHex: '#FB923C',
    solidColorHex: '#F97316',
    phDelta: -5.4,
    reactivityLevel: 2,
    shortDesc: 'Powerful oxidizing acid; combines with HCl to form Aqua Regia that dissolves Gold (Au)!'
  },
  {
    id: 'naoh',
    symbol: 'NaOH',
    name: 'Sodium Hydroxide',
    molarMass: '40.00 g/mol',
    category: 'Lab Acid / Base / Salt',
    stateType: 'liquid',
    colorHex: '#2DD4BF',
    solidColorHex: '#99F6E4',
    phDelta: +6.0,
    reactivityLevel: 2,
    shortDesc: 'Strong caustic alkali (pH 13.8); turns Phenolphthalein Neon Pink and Red Litmus Blue!'
  },
  {
    id: 'nh4oh',
    symbol: 'NH₄OH',
    name: 'Ammonium Hydroxide',
    molarMass: '35.04 g/mol',
    category: 'Lab Acid / Base / Salt',
    stateType: 'liquid',
    colorHex: '#3B82F6',
    solidColorHex: '#93C5FD',
    phDelta: +3.8,
    reactivityLevel: 1,
    shortDesc: 'Weak base (pH 10.6); turns Copper (Cu²⁺) solutions into Deep Ultramarine Royal Blue!'
  },
  {
    id: 'na2co3',
    symbol: 'Na₂CO₃',
    name: 'Sodium Carbonate',
    molarMass: '105.99 g/mol',
    category: 'Lab Acid / Base / Salt',
    stateType: 'solid',
    colorHex: '#67E8F9',
    solidColorHex: '#F8FAFC',
    phDelta: +3.2,
    reactivityLevel: 1,
    shortDesc: 'Foams vigorously with CO₂↑ gas when combined with any acid (HCl, H₂SO₄, HNO₃).'
  }
];

type IndicatorType = 'none' | 'blue-litmus' | 'red-litmus' | 'phenolphthalein' | 'methyl-orange' | 'universal';

// Web Audio API Synthesized Lab Sounds (Pour, Fizz, and Loud Exothermic Blast!)
const playChemLabAudio = (effect: 'pour' | 'fizz' | 'blast') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (effect === 'pour') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.18);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (effect === 'fizz') {
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.18));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } else if (effect === 'blast') {
      // 1. Sub-bass boom
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(130, now);
      subOsc.frequency.exponentialRampToValueAtTime(22, now + 0.85);
      subGain.gain.setValueAtTime(0.55, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.9);

      // 2. White noise explosion roar
      const bufferSize = ctx.sampleRate * 0.9;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.6);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1100, now);
      lowpass.frequency.exponentialRampToValueAtTime(180, now + 0.85);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
      noise.connect(lowpass);
      lowpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    }
  } catch {
    // Ignore audio context restriction errors
  }
};

// ============================================================================
// REACT THREE FIBER (R3F) 3D VIRTUAL TEST TUBE & EXPLOSION SCENE
// ============================================================================

interface R3FSceneProps {
  addedChemicals: PeriodicChemItem[];
  liquidHex: string;
  precipitateHex: string | null;
  litmusTopHex: string;
  litmusBottomHex: string;
  showLitmus: boolean;
  litmusDipped: boolean;
  onToggleLitmusDip: () => void;
  gasIntensity: number;
  hasExothermicSparks: boolean;
  bunsenBurnerOn: boolean;
  onToggleBunsen: () => void;
  popTestTriggered: boolean;
  liquidVolumeMl: number;
  isDropHovering: boolean;
  lastAddedItem: PeriodicChemItem | null;
  pourTimestamp: number;
  isBlasted: boolean;
  blastTimestamp: number;
  blastColorHex: string;
  onQuickAddFrom3D: (id: string) => void;
}

const R3FTestTubeWorkbench: React.FC<R3FSceneProps> = ({
  addedChemicals,
  liquidHex,
  precipitateHex,
  litmusTopHex,
  litmusBottomHex,
  showLitmus,
  litmusDipped,
  onToggleLitmusDip,
  gasIntensity,
  hasExothermicSparks,
  bunsenBurnerOn,
  onToggleBunsen,
  popTestTriggered,
  liquidVolumeMl,
  isDropHovering,
  lastAddedItem,
  pourTimestamp,
  isBlasted,
  blastTimestamp,
  blastColorHex
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const liquidMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const liquidBottomMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const meniscusMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const liquidCylRef = useRef<THREE.Mesh>(null);
  const meniscusRef = useRef<THREE.Mesh>(null);
  const pourStreamRef = useRef<THREE.Mesh>(null);
  const fallingChunkRef = useRef<THREE.Mesh>(null);
  const litmusGroupRef = useRef<THREE.Group>(null);
  const litmusTopMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const litmusBottomMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const burnerFlameRef = useRef<THREE.Mesh>(null);
  const burnerLightRef = useRef<THREE.PointLight>(null);
  const bubblesGroupRef = useRef<THREE.Group>(null);
  const floatingMetalsGroupRef = useRef<THREE.Group>(null);

  // Explosion Refs
  const fireballRef = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const blastLightRef = useRef<THREE.PointLight>(null);
  const debrisGroupRef = useRef<THREE.Group>(null);

  const bubbleSeeds = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 0.42,
      yOffset: -1.1 + Math.random() * 2.0,
      speed: 0.9 + Math.random() * 1.5
    }));
  }, []);

  const debrisSeeds = useMemo(() => {
    return Array.from({ length: 42 }, (_, i) => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.75;
      const speed = 2.8 + Math.random() * 5.2;
      return {
        id: i,
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.cos(phi) * speed + 1.8,
        vz: Math.sin(phi) * Math.sin(theta) * speed,
        rotSpeed: (Math.random() - 0.5) * 12,
        isGlass: i % 2 === 0
      };
    });
  }, []);

  const targetLiquidColor = useMemo(() => new THREE.Color(liquidHex), [liquidHex]);
  const targetTopColor = useMemo(() => new THREE.Color(litmusTopHex), [litmusTopHex]);
  const targetBottomColor = useMemo(() => new THREE.Color(litmusBottomHex), [litmusBottomHex]);

  // Separate solid chunks into floating alkali metals (Li, Na, K, Rb, Cs) and sinking solids (Zn, Fe, Cu, Au, Mg, Ca, S, P, I)
  const floatingSolids = useMemo(
    () =>
      addedChemicals.filter(c =>
        ['li', 'na', 'k', 'rb', 'cs'].includes(c.id)
      ),
    [addedChemicals]
  );

  const bottomSolids = useMemo(
    () =>
      addedChemicals.filter(
        c => c.stateType === 'solid' && !['li', 'na', 'k', 'rb', 'cs'].includes(c.id)
      ),
    [addedChemicals]
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const elapsed = state.clock.getElapsedTime();

    // 1. Liquid Volume & Vivid Color Interpolation
    const hasLiquid = liquidVolumeMl > 0;
    const volScale = hasLiquid ? Math.max(0.25, Math.min(1.45, liquidVolumeMl / 28)) : 0.01;
    const surfaceY = -0.9 + 1.8 * volScale;

    if (liquidMatRef.current && liquidBottomMatRef.current && meniscusMatRef.current) {
      liquidMatRef.current.color.lerp(targetLiquidColor, 0.14);
      liquidMatRef.current.emissive.lerp(targetLiquidColor, 0.14);
      liquidBottomMatRef.current.color.lerp(targetLiquidColor, 0.14);
      liquidBottomMatRef.current.emissive.lerp(targetLiquidColor, 0.14);
      meniscusMatRef.current.color.lerp(targetLiquidColor, 0.14);
    }

    if (liquidCylRef.current) {
      liquidCylRef.current.visible = hasLiquid;
      liquidCylRef.current.scale.y = THREE.MathUtils.lerp(liquidCylRef.current.scale.y, volScale, 0.14);
      liquidCylRef.current.position.y = -0.9 + 0.9 * liquidCylRef.current.scale.y;
    }

    if (meniscusRef.current) {
      meniscusRef.current.visible = hasLiquid;
      meniscusRef.current.position.y = THREE.MathUtils.lerp(meniscusRef.current.position.y, surfaceY, 0.14);
    }

    // 2. Pouring Liquid Stream / Falling Solid Element Animation
    const pourAge = (performance.now() - pourTimestamp) / 1000;
    if (pourStreamRef.current) {
      if (lastAddedItem && lastAddedItem.stateType !== 'solid' && pourAge >= 0 && pourAge < 0.85) {
        pourStreamRef.current.visible = true;
        const streamHeight = Math.max(0.5, 2.75 - surfaceY);
        pourStreamRef.current.scale.set(1, streamHeight, 1);
        pourStreamRef.current.position.y = surfaceY + streamHeight / 2;
      } else {
        pourStreamRef.current.visible = false;
      }
    }

    if (fallingChunkRef.current) {
      if (lastAddedItem && lastAddedItem.stateType === 'solid' && pourAge >= 0 && pourAge < 0.7) {
        fallingChunkRef.current.visible = true;
        const t = pourAge / 0.7;
        fallingChunkRef.current.position.y = THREE.MathUtils.lerp(2.85, surfaceY, t * t);
        fallingChunkRef.current.rotation.x += dt * 8;
        fallingChunkRef.current.rotation.y += dt * 10;
      } else {
        fallingChunkRef.current.visible = false;
      }
    }

    // 3. Litmus Strip Dipping & Color Change
    if (litmusGroupRef.current) {
      const targetY = litmusDipped ? surfaceY + 0.12 : 2.15;
      litmusGroupRef.current.position.y = THREE.MathUtils.lerp(litmusGroupRef.current.position.y, targetY, 0.12);
    }
    if (litmusTopMatRef.current && litmusBottomMatRef.current) {
      litmusTopMatRef.current.color.lerp(targetTopColor, 0.14);
      litmusBottomMatRef.current.color.lerp(targetBottomColor, 0.14);
    }

    // 4. Floating Alkali Metals (Li, Na, K, Rb, Cs) Darting on Liquid Surface
    if (floatingMetalsGroupRef.current) {
      floatingMetalsGroupRef.current.children.forEach((child, idx) => {
        child.position.y = surfaceY + 0.05 + Math.sin(elapsed * 22 + idx) * 0.03;
        child.position.x = Math.cos(elapsed * (7 + idx * 2) + idx) * 0.26;
        child.position.z = Math.sin(elapsed * (9 + idx * 2) + idx) * 0.26;
        child.rotation.x += dt * 8;
        child.rotation.z += dt * 9;
      });
    }

    // 5. Bunsen Burner Flame
    if (burnerFlameRef.current && burnerLightRef.current) {
      if (bunsenBurnerOn) {
        burnerFlameRef.current.scale.set(
          1 + Math.sin(elapsed * 25) * 0.14,
          1 + Math.cos(elapsed * 29) * 0.2,
          1 + Math.sin(elapsed * 23) * 0.14
        );
        burnerLightRef.current.intensity = 2.8 + Math.sin(elapsed * 20) * 0.5;
      } else {
        burnerLightRef.current.intensity = 0;
      }
    }

    // 6. Effervescence Rising Gas Bubbles
    if (bubblesGroupRef.current) {
      const activeSpeed = gasIntensity > 0 ? gasIntensity : bunsenBurnerOn ? 1.1 : 0;
      bubblesGroupRef.current.children.forEach((child, idx) => {
        const seed = bubbleSeeds[idx];
        if (!seed) return;
        if (activeSpeed <= 0 || !hasLiquid) {
          child.visible = false;
          return;
        }
        child.visible = true;
        child.position.y += dt * seed.speed * (0.75 + activeSpeed * 0.7);
        child.position.x = Math.cos(seed.angle + elapsed * 3.5) * seed.radius;
        child.position.z = Math.sin(seed.angle + elapsed * 3.5) * seed.radius;
        if (child.position.y > surfaceY) {
          child.position.y = -1.12;
        }
      });
    }

    // 7. 3D EXPLOSION / BLAST PHYSICS & CAMERA SHAKE!
    const blastAge = (performance.now() - blastTimestamp) / 1000;
    if (rootGroupRef.current) {
      if (isBlasted && blastAge >= 0 && blastAge < 1.2) {
        const shakeAmt = (1.2 - blastAge) * 0.22;
        rootGroupRef.current.position.x = (Math.random() - 0.5) * shakeAmt;
        rootGroupRef.current.position.y = -0.25 + (Math.random() - 0.5) * shakeAmt;
      } else {
        rootGroupRef.current.position.x = THREE.MathUtils.lerp(rootGroupRef.current.position.x, 0, 0.2);
        rootGroupRef.current.position.y = THREE.MathUtils.lerp(rootGroupRef.current.position.y, -0.25, 0.2);
      }
    }

    if (fireballRef.current && shockwaveRef.current && blastLightRef.current) {
      if (isBlasted && blastAge >= 0 && blastAge < 1.6) {
        fireballRef.current.visible = true;
        shockwaveRef.current.visible = true;
        const scaleFire = 0.4 + blastAge * 3.8;
        fireballRef.current.scale.setScalar(scaleFire);
        const fireMat = fireballRef.current.material as THREE.MeshBasicMaterial;
        fireMat.opacity = Math.max(0, 1 - blastAge / 1.3);

        const scaleWave = 0.5 + blastAge * 6.2;
        shockwaveRef.current.scale.setScalar(scaleWave);
        const waveMat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
        waveMat.opacity = Math.max(0, 0.95 - blastAge / 1.1);

        blastLightRef.current.intensity = Math.max(0, (1.4 - blastAge) * 12);
      } else {
        fireballRef.current.visible = false;
        shockwaveRef.current.visible = false;
        blastLightRef.current.intensity = 0;
      }
    }

    if (debrisGroupRef.current) {
      if (isBlasted && blastAge >= 0 && blastAge < 2.2) {
        debrisGroupRef.current.visible = true;
        debrisGroupRef.current.children.forEach((shard, idx) => {
          const seed = debrisSeeds[idx];
          if (!seed) return;
          shard.position.set(
            seed.vx * blastAge,
            0.9 + seed.vy * blastAge - 0.5 * 9.8 * blastAge * blastAge,
            seed.vz * blastAge
          );
          shard.rotation.x = blastAge * seed.rotSpeed;
          shard.rotation.y = blastAge * seed.rotSpeed;
        });
      } else {
        debrisGroupRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.25, 0]}>
      {/* Studio & Reaction Lighting */}
      <ambientLight intensity={1.15} color="#f0fdfa" />
      <directionalLight position={[5, 8, 6]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-5, 4, -4]} intensity={0.8} color="#38bdf8" />
      <pointLight ref={burnerLightRef} position={[0, -1.5, 0]} color="#ff7b00" distance={7} intensity={0} />
      <pointLight ref={blastLightRef} position={[0, 1.0, 0.5]} color={blastColorHex} distance={14} intensity={0} />

      {/* 1. Composite Retort Stand & Lab Workbench Base */}
      <group>
        <mesh position={[0, -2.55, 0]}>
          <boxGeometry args={[5.2, 0.24, 3.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.45} metalness={0.65} />
        </mesh>
        <mesh position={[-1.65, 0.3, -0.25]}>
          <cylinderGeometry args={[0.09, 0.09, 5.6, 18]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[-1.65, 1.45, -0.25]}>
          <boxGeometry args={[0.36, 0.32, 0.36]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[-0.82, 1.45, -0.12]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 1.75, 12]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[0, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.68, 0.055, 12, 32]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* 2. Interactive 3D Bunsen Burner */}
      <group
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onToggleBunsen();
        }}
      >
        <mesh position={[0, -2.3, 0]}>
          <cylinderGeometry args={[0.32, 0.48, 0.25, 20]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.85} />
        </mesh>
        <mesh position={[0, -1.9, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.65, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.85} />
        </mesh>
        {bunsenBurnerOn && (
          <mesh ref={burnerFlameRef} position={[0, -1.35, 0]}>
            <coneGeometry args={[0.26, 0.72, 16]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.92} />
          </mesh>
        )}
      </group>

      {/* 3. CENTRAL VIRTUAL 3D TEST TUBE (FIXED DEPTH WRITE SO LIQUID & SOLIDS ALWAYS SHOW VIVIDLY!) */}
      <group>
        {/* Drop Target Ring at Mouth of Test Tube */}
        <mesh position={[0, 2.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.78, isDropHovering ? 0.075 : 0.03, 16, 36]} />
          <meshBasicMaterial
            color={isBlasted ? '#ef4444' : isDropHovering ? '#34d399' : '#38bdf8'}
            transparent
            opacity={isDropHovering ? 0.98 : 0.6}
          />
        </mesh>

        {/* INNER OPAQUE/VIVID LIQUID COLUMN (renderOrder=1, depthWrite=true so it ALWAYS renders brightly!) */}
        <mesh ref={liquidCylRef} position={[0, 0, 0]} renderOrder={1}>
          <cylinderGeometry args={[0.55, 0.55, 1.8, 32]} />
          <meshStandardMaterial
            ref={liquidMatRef}
            color={liquidHex}
            emissive={liquidHex}
            emissiveIntensity={0.28}
            roughness={0.15}
            metalness={0.05}
            transparent
            opacity={0.92}
            depthWrite={true}
          />
        </mesh>

        {/* Liquid Hemispherical Bottom */}
        {liquidVolumeMl > 0 && (
          <mesh position={[0, -0.9, 0]} renderOrder={1}>
            <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <meshStandardMaterial
              ref={liquidBottomMatRef}
              color={liquidHex}
              emissive={liquidHex}
              emissiveIntensity={0.28}
              roughness={0.15}
              metalness={0.05}
              transparent
              opacity={0.92}
              depthWrite={true}
            />
          </mesh>
        )}

        {/* Glowing Liquid Meniscus Top Disk */}
        <mesh ref={meniscusRef} position={[0, 0.9, 0]} renderOrder={2}>
          <cylinderGeometry args={[0.55, 0.55, 0.05, 32]} />
          <meshStandardMaterial
            ref={meniscusMatRef}
            color={liquidHex}
            emissive="#ffffff"
            emissiveIntensity={0.35}
            roughness={0.1}
          />
        </mesh>

        {/* Active Pouring Stream from Top of Tube into Meniscus */}
        <mesh ref={pourStreamRef} position={[0, 1.8, 0]} visible={false} renderOrder={3}>
          <cylinderGeometry args={[0.07, 0.11, 1.0, 16]} />
          <meshBasicMaterial color={lastAddedItem?.colorHex || liquidHex} />
        </mesh>

        {/* Falling Solid Chunk When User Clicks/Drops a Solid Element */}
        <mesh ref={fallingChunkRef} position={[0, 2.5, 0]} visible={false} renderOrder={3}>
          <dodecahedronGeometry args={[0.19, 1]} />
          <meshStandardMaterial
            color={lastAddedItem?.solidColorHex || '#f8fafc'}
            roughness={0.25}
            metalness={0.75}
          />
        </mesh>

        {/* Precipitate Layer at Bottom of Test Tube (AgCl↓ White, AgI↓ Yellow, Cu↓ Brown, BaSO₄↓) */}
        {precipitateHex && (
          <mesh position={[0, -1.06, 0]} renderOrder={2}>
            <sphereGeometry args={[0.53, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <meshStandardMaterial
              color={precipitateHex}
              emissive={precipitateHex}
              emissiveIntensity={0.18}
              roughness={0.8}
            />
          </mesh>
        )}

        {/* Floating Reactive Alkali Metal Chunks (Li, Na, K, Rb, Cs) on Liquid Surface */}
        <group ref={floatingMetalsGroupRef}>
          {floatingSolids.map(item => (
            <mesh key={item.id} position={[0, 0.92, 0]} renderOrder={3}>
              <dodecahedronGeometry args={[0.17, 1]} />
              <meshStandardMaterial
                color={item.solidColorHex}
                emissive={item.colorHex}
                emissiveIntensity={0.65}
                roughness={0.2}
                metalness={0.85}
              />
            </mesh>
          ))}
        </group>

        {/* Sinking Solid Element Chunks at Bottom of Tube (Zn, Fe, Cu, Au, Mg, Ca, S, P, I) */}
        {bottomSolids.length > 0 && (
          <group renderOrder={3}>
            {bottomSolids.map((item, idx) => {
              const angle = (idx * Math.PI * 2) / Math.max(1, bottomSolids.length);
              const rad = bottomSolids.length === 1 ? 0 : 0.22;
              const gx = Math.cos(angle) * rad;
              const gz = Math.sin(angle) * rad;
              return (
                <group key={item.id} position={[gx, -1.16, gz]}>
                  <mesh>
                    <dodecahedronGeometry args={[0.14, 0]} />
                    <meshStandardMaterial
                      color={item.solidColorHex}
                      emissive={item.solidColorHex}
                      emissiveIntensity={0.2}
                      roughness={0.3}
                      metalness={0.75}
                    />
                  </mesh>
                  <mesh position={[0.1, -0.04, 0.06]}>
                    <dodecahedronGeometry args={[0.1, 0]} />
                    <meshStandardMaterial
                      color={item.solidColorHex}
                      roughness={0.3}
                      metalness={0.75}
                    />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}

        {/* 3D Litmus Paper Strip Inside Test Tube */}
        {showLitmus && !isBlasted && (
          <group
            ref={litmusGroupRef}
            position={[0.16, 1.1, 0]}
            renderOrder={4}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onToggleLitmusDip();
            }}
          >
            <mesh position={[0, 0.525, 0]}>
              <boxGeometry args={[0.24, 1.05, 0.04]} />
              <meshStandardMaterial ref={litmusTopMatRef} color={litmusTopHex} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.525, 0]}>
              <boxGeometry args={[0.24, 1.05, 0.04]} />
              <meshStandardMaterial ref={litmusBottomMatRef} color={litmusBottomHex} roughness={0.5} />
            </mesh>
          </group>
        )}

        {/* Effervescence Rising Gas Bubbles */}
        <group ref={bubblesGroupRef} renderOrder={4}>
          {bubbleSeeds.map(seed => (
            <mesh key={seed.id} position={[0, seed.yOffset, 0]}>
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
            </mesh>
          ))}
        </group>

        {/* Exothermic Surface Sparkles */}
        {(hasExothermicSparks || isBlasted) && (
          <Sparkles
            position={[0, 1.1, 0]}
            count={40}
            scale={[1.5, 1.8, 1.5]}
            size={6}
            speed={2.8}
            color={blastColorHex}
          />
        )}

        {/* Hydrogen "Pop!" Test Burning Splinter at Mouth of Tube */}
        {popTestTriggered && (
          <group renderOrder={5}>
            <mesh position={[0.65, 2.65, 0]} rotation={[0, 0, Math.PI / 3]}>
              <cylinderGeometry args={[0.025, 0.025, 1.2, 8]} />
              <meshStandardMaterial color="#d97706" />
            </mesh>
            <mesh position={[0.12, 2.38, 0]}>
              <sphereGeometry args={[0.38, 16, 16]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.92} />
            </mesh>
            <Sparkles position={[0.12, 2.4, 0]} count={30} scale={1.4} size={6} speed={3.5} color="#f97316" />
          </group>
        )}

        {/* OUTER BOROSILICATE GLASS SHELL (depthWrite=false, renderOrder=10 so it NEVER hides liquid/solids!) */}
        {!isBlasted ? (
          <group renderOrder={10}>
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.62, 0.62, 3.2, 32, 1, true]} />
              <meshStandardMaterial
                color="#e2e8f0"
                transparent
                opacity={0.2}
                roughness={0.08}
                metalness={0.25}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, -0.9, 0]}>
              <sphereGeometry args={[0.62, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              <meshStandardMaterial
                color="#e2e8f0"
                transparent
                opacity={0.2}
                roughness={0.08}
                metalness={0.25}
                depthWrite={false}
              />
            </mesh>
            {/* Glass Rim Lip */}
            <mesh position={[0, 2.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.63, 0.045, 12, 32]} />
              <meshStandardMaterial color="#f8fafc" transparent opacity={0.7} roughness={0.15} />
            </mesh>
            {/* Volume Graduation Rings on Glass (10mL, 20mL, 30mL, 40mL) */}
            {[-0.4, 0.15, 0.7, 1.25, 1.8].map((gy, idx) => (
              <mesh key={idx} position={[0, gy, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.622, 0.008, 8, 32]} />
                <meshBasicMaterial color="#94a3b8" transparent opacity={0.55} />
              </mesh>
            ))}
          </group>
        ) : (
          /* SHATTERED / BLASTED TEST TUBE BASE WHEN EXPLOSION OCCURS! */
          <group renderOrder={10}>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.62, 0.62, 1.5, 16, 1, true]} />
              <meshStandardMaterial
                color="#fca5a5"
                transparent
                opacity={0.35}
                roughness={0.2}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, -0.9, 0]}>
              <sphereGeometry args={[0.62, 24, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              <meshStandardMaterial
                color="#fca5a5"
                transparent
                opacity={0.35}
                roughness={0.2}
                depthWrite={false}
              />
            </mesh>
          </group>
        )}

        {/* 4. 3D EXPLOSION FIREBALL, SHOCKWAVE RING & SHATTERING GLASS DEBRIS! */}
        <mesh ref={fireballRef} position={[0, 1.0, 0]} visible={false} renderOrder={15}>
          <sphereGeometry args={[0.65, 24, 24]} />
          <meshBasicMaterial color={blastColorHex} transparent opacity={0.95} />
        </mesh>

        <mesh
          ref={shockwaveRef}
          position={[0, 1.0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          visible={false}
          renderOrder={16}
        >
          <torusGeometry args={[0.7, 0.08, 16, 36]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.9} />
        </mesh>

        <group ref={debrisGroupRef} visible={false} renderOrder={15}>
          {debrisSeeds.map(seed => (
            <mesh key={seed.id}>
              <dodecahedronGeometry args={[seed.isGlass ? 0.09 : 0.12, 0]} />
              <meshBasicMaterial color={seed.isGlass ? '#e2e8f0' : blastColorHex} />
            </mesh>
          ))}
        </group>

        {/* 5. Floating 3D Chemical Formula Badges Right Next to Test Tube */}
        <Html position={[-1.45, 0.85, 0]} center distanceFactor={8}>
          <div className="bg-[#072E29]/95 border border-emerald-400/50 rounded-lg px-2.5 py-2 text-left shadow-lg min-w-[115px] pointer-events-none">
            <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-300 block">
              In 3D Test Tube
            </span>
            {addedChemicals.length === 0 ? (
              <span className="text-[11px] font-mono text-slate-300">Empty (0 mL)</span>
            ) : (
              <div className="flex flex-wrap gap-1 mt-1">
                {addedChemicals.map(c => (
                  <span
                    key={c.id}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-950"
                    style={{ backgroundColor: c.colorHex }}
                  >
                    {c.symbol}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Html>
      </group>

      <ContactShadows position={[0, -2.68, 0]} opacity={0.45} scale={10} blur={2} far={4} />
    </group>
  );
};

// ============================================================================
// MAIN COMPONENT: ChemLab3DSimulator
// ============================================================================

export const ChemLab3DSimulator: React.FC<ChemLab3DSimulatorProps> = ({
  currentStudent,
  handleAwardBonusXP,
  playUISound,
  showToast
}) => {
  // Chemicals currently inside the Virtual 3D Test Tube (Starts with HCl + Blue Litmus so liquid is immediately visible!)
  const [addedIds, setAddedIds] = useState<string[]>(['hcl']);
  const [activeIndicator, setActiveIndicator] = useState<IndicatorType>('universal');
  const [litmusDipped, setLitmusDipped] = useState<boolean>(true);
  const [bunsenBurnerOn, setBunsenBurnerOn] = useState<boolean>(false);
  const [popTestTriggered, setPopTestTriggered] = useState<boolean>(false);
  const [limeWaterMilky, setLimeWaterMilky] = useState<boolean>(false);
  const [liquidVolumeMl, setLiquidVolumeMl] = useState<number>(28);
  const [renderMode, setRenderMode] = useState<'3d' | '2d-turbo'>('3d');
  const [cameraPreset, setCameraPreset] = useState<'front' | 'top' | 'closeup'>('front');
  const [periodicFilter, setPeriodicFilter] = useState<string>('ALL');

  // Pour & Blast Animation States
  const [draggedChemId, setDraggedChemId] = useState<string | null>(null);
  const [isDropHovering, setIsDropHovering] = useState<boolean>(false);
  const [lastAddedItem, setLastAddedItem] = useState<PeriodicChemItem | null>(
    PERIODIC_AND_LAB_CHEMICALS.find(c => c.id === 'hcl') || null
  );
  const [pourTimestamp, setPourTimestamp] = useState<number>(0);
  const [isBlasted, setIsBlasted] = useState<boolean>(false);
  const [blastTimestamp, setBlastTimestamp] = useState<number>(0);
  const [blastReason, setBlastReason] = useState<string>('');
  const [blastColorHex, setBlastColorHex] = useState<string>('#F97316');

  // Numerical Table States
  const [chemNumericalInputs, setChemNumericalInputs] = useState<Record<string, string>>({});
  const [verifiedNumericalIds, setVerifiedNumericalIds] = useState<string[]>([]);

  const addedChemicals = useMemo(
    () =>
      addedIds
        .map(id => PERIODIC_AND_LAB_CHEMICALS.find(c => c.id === id))
        .filter((c): c is PeriodicChemItem => Boolean(c)),
    [addedIds]
  );

  // Trigger a 3D Explosion / Blast with sound & shockwave
  const triggerExplosionBlast = (reason: string, flameHex = '#F97316') => {
    setIsBlasted(true);
    setBlastTimestamp(performance.now());
    setBlastReason(reason);
    setBlastColorHex(flameHex);
    playChemLabAudio('blast');
    showToast('💥 EXOTHERMIC BLAST IN TEST TUBE!', reason, 'warning');
  };

  // Add / Combine any Periodic Element or Lab Reagent into the Virtual Test Tube
  const handleAddChemicalToTube = (chemId: string) => {
    const item = PERIODIC_AND_LAB_CHEMICALS.find(c => c.id === chemId);
    if (!item) return;

    // If tube was shattered from a previous blast, auto-repair it when adding a new chemical
    const currentList = isBlasted ? [chemId] : addedIds.includes(chemId) ? addedIds : [...addedIds, chemId];
    if (isBlasted) {
      setIsBlasted(false);
      setBlastReason('');
    }

    setAddedIds(currentList);
    setLastAddedItem(item);
    setPourTimestamp(performance.now());
    setPopTestTriggered(false);
    setLimeWaterMilky(false);

    // Ensure visible liquid volume in tube
    setLiquidVolumeMl(prev => {
      if (prev <= 0) return 24;
      return Math.min(45, prev + (item.stateType === 'solid' ? 2 : 6));
    });

    // Check if the new combination triggers an EXPLOSIVE BLAST!
    const hasWaterOrAcid = currentList.some(id =>
      ['h2o', 'hcl', 'h2so4', 'hno3', 'cr', 'mn'].includes(id)
    );
    const hasStrongAcid = currentList.some(id => ['hcl', 'h2so4', 'hno3'].includes(id));
    const hasOxidizer = currentList.some(id => ['o', 'mn', 'hno3', 'f', 'cl', 'br'].includes(id));

    if (['k', 'rb', 'cs'].includes(chemId) && (hasWaterOrAcid || currentList.length >= 1)) {
      triggerExplosionBlast(
        `2${item.symbol} (s) + 2H⁺/H₂O → 2${item.symbol}⁺ + H₂↑ + 💥 Runaway Exothermic Detonation (380°C)!`,
        item.colorHex
      );
    } else if (
      currentList.some(id => ['k', 'rb', 'cs'].includes(id)) &&
      ['h2o', 'hcl', 'h2so4', 'hno3', 'f', 'cl', 'br', 'o'].includes(chemId)
    ) {
      triggerExplosionBlast(
        `Heavy Alkali Metal + ${item.symbol} triggered an instantaneous hydrogen-oxygen fireball explosion!`,
        '#A855F7'
      );
    } else if (
      (chemId === 'na' && hasStrongAcid) ||
      (currentList.includes('na') && ['hcl', 'h2so4', 'hno3', 'f', 'cl'].includes(chemId))
    ) {
      triggerExplosionBlast(
        '2Na (s) + 2HCl (aq) → 2NaCl + H₂↑ + 💥 Golden-Yellow Sodium Exothermic Fireball Blast!',
        '#F59E0B'
      );
    } else if (chemId === 'f' || currentList.includes('f')) {
      triggerExplosionBlast(
        '2F₂ (g) + 2H₂O (l) → 4HF + O₂ + 💥 Hypergolic Fluorine Plasma Explosion!',
        '#FACC15'
      );
    } else if (
      (currentList.includes('p') && hasOxidizer) ||
      (currentList.includes('s') && currentList.includes('mn') && hasStrongAcid) ||
      (currentList.includes('h') && currentList.includes('o') && bunsenBurnerOn)
    ) {
      triggerExplosionBlast(
        'Rapid exothermic oxidation triggered a violent thermal runaway blast inside the test tube!',
        '#EF4444'
      );
    } else {
      playChemLabAudio(item.stateType === 'solid' ? 'fizz' : 'pour');
      showToast(
        `Added ${item.symbol} — ${item.name}`,
        item.shortDesc,
        'success'
      );
    }

    handleAwardBonusXP(
      currentStudent.id,
      30,
      `Combined ${item.symbol} (${item.name}) in 3D Chemistry Lab`
    );
  };

  const handleEmptyTube = () => {
    playUISound('click');
    setAddedIds([]);
    setLiquidVolumeMl(0);
    setIsBlasted(false);
    setBlastReason('');
    setPopTestTriggered(false);
    setLimeWaterMilky(false);
  };

  const handleResetTubeToHCl = () => {
    playUISound('click');
    setAddedIds(['hcl']);
    setActiveIndicator('universal');
    setLiquidVolumeMl(28);
    setIsBlasted(false);
    setBlastReason('');
    setPopTestTriggered(false);
    setLimeWaterMilky(false);
    setBunsenBurnerOn(false);
  };

  // Real-Time Multi-Element Reaction Engine (Color Changes, Precipitates, Gases, pH, Temperature)
  const reactionMetrics = useMemo(() => {
    if (addedIds.length === 0) {
      return {
        ph: 7.0,
        tempC: bunsenBurnerOn ? 65.0 : 25.0,
        gasType: 'none' as const,
        gasIntensity: 0,
        hasExothermicSparks: false,
        precipitateHex: null as string | null,
        precipitateLabel: null as string | null,
        isAcidic: false,
        isBasic: false,
        liquidHex: '#38BDF8',
        colorLabel: 'Empty Test Tube — Click Any Periodic Element to Pour or Drop!',
        litmusTopHex: activeIndicator === 'red-litmus' ? '#EF4444' : '#3B82F6',
        litmusBottomHex: activeIndicator === 'red-litmus' ? '#EF4444' : '#3B82F6',
        litmusNote: 'Add an acid or base to test Litmus color change.',
        equation: 'Select or drag any chemical element from the Periodic Table to begin.'
      };
    }

    const has = (id: string) => addedIds.includes(id);
    const hasAny = (ids: string[]) => ids.some(id => addedIds.includes(id));

    const hasAcid = hasAny(['hcl', 'h2so4', 'hno3']);
    const hasBase = hasAny(['naoh', 'nh4oh', 'li', 'na', 'k', 'rb', 'cs', 'ca', 'ba', 'na2co3']);
    const hasAlkaliMetal = hasAny(['li', 'na', 'k', 'rb', 'cs']);
    const hasActiveMetal = hasAny(['mg', 'ca', 'ba', 'zn', 'fe']);

    // Calculate net pH
    let ph = 7.0;
    addedChemicals.forEach(c => {
      ph += c.phDelta;
    });
    if (hasAcid && has('naoh')) {
      ph = 7.0; // Neutralization
    }
    ph = Math.max(0.5, Math.min(14.0, ph));

    const isAcidic = ph < 6.6;
    const isBasic = ph > 7.4;

    // Temperature & Gas Evolution
    let tempC = bunsenBurnerOn ? 78.0 : 25.0;
    let gasType: 'none' | 'H2' | 'CO2' | 'O2' | 'Cl2' = 'none';
    let gasIntensity = 0;
    let hasExothermicSparks = false;

    if (isBlasted) {
      tempC = 340.0;
      gasType = 'H2';
      gasIntensity = 3.5;
      hasExothermicSparks = true;
    } else if (hasAlkaliMetal) {
      tempC = 88.5;
      gasType = 'H2';
      gasIntensity = 3.0;
      hasExothermicSparks = true;
    } else if (hasActiveMetal && (hasAcid || has('naoh') || has('h2o'))) {
      tempC += 18.0;
      gasType = 'H2';
      gasIntensity = hasAcid ? 2.6 : 1.4;
    } else if (has('na2co3') && hasAcid) {
      tempC += 5.0;
      gasType = 'CO2';
      gasIntensity = 2.8;
    } else if (has('mn') && (has('o') || hasAcid)) {
      gasType = 'O2';
      gasIntensity = 2.0;
      tempC += 12.0;
    }

    // Determine Vivid Liquid Color, Precipitate & Equation
    let liquidHex = addedChemicals[addedChemicals.length - 1]?.colorHex || '#38BDF8';
    let colorLabel = `${addedChemicals.map(c => c.symbol).join(' + ')} Reaction Mixture`;
    let precipitateHex: string | null = null;
    let precipitateLabel: string | null = null;
    let equation = `${addedChemicals.map(c => c.symbol).join(' + ')} → Aqueous Reaction (pH ${ph.toFixed(1)})`;

    // Specific Multi-Element Color & Precipitate Reactions
    if (has('au') && has('hcl') && has('hno3')) {
      liquidHex = '#EAB308';
      colorLabel = 'Luminous Golden-Yellow Chloroauric Acid (HAuCl₄ in Aqua Regia!)';
      equation = 'Au (s) + HNO₃ + 4HCl (Aqua Regia) → HAuCl₄ (Golden Yellow) + NO↑ + 2H₂O';
    } else if (has('ag') && has('i')) {
      liquidHex = '#FEF08A';
      precipitateHex = '#FACC15';
      precipitateLabel = 'Bright Canary Yellow Silver Iodide (AgI↓) Precipitate';
      colorLabel = 'Canary Yellow AgI↓ Suspension';
      equation = 'Ag⁺ (aq) + I⁻ (aq) → AgI↓ (Bright Canary Yellow Precipitate)';
    } else if (has('ag') && has('br')) {
      liquidHex = '#FEF9C3';
      precipitateHex = '#FDE047';
      precipitateLabel = 'Creamy Pale Yellow Silver Bromide (AgBr↓) Precipitate';
      colorLabel = 'Creamy Yellow AgBr↓ Suspension';
      equation = 'Ag⁺ (aq) + Br⁻ (aq) → AgBr↓ (Creamy Yellow Precipitate)';
    } else if (has('ag') && (has('cl') || has('hcl'))) {
      liquidHex = '#F1F5F9';
      precipitateHex = '#FFFFFF';
      precipitateLabel = 'Curdy White Silver Chloride (AgCl↓) Precipitate';
      colorLabel = 'Milky Curdy White AgCl↓ Suspension';
      equation = 'Ag⁺ (aq) + Cl⁻ (aq) → AgCl↓ (Curdy White Precipitate)';
    } else if (has('ba') && has('h2so4')) {
      liquidHex = '#F8FAFC';
      precipitateHex = '#FFFFFF';
      precipitateLabel = 'Dense White Barium Sulfate (BaSO₄↓) Precipitate';
      colorLabel = 'Milky White BaSO₄↓ Precipitate';
      equation = 'Ba²⁺ + H₂SO₄ (aq) → BaSO₄↓ (White Precipitate) + H₂↑';
    } else if (has('mn') && (has('fe') || has('zn') || has('o'))) {
      liquidHex = '#FDE68A';
      colorLabel = 'Redox Decolorized: Deep Purple MnO₄⁻ → Pale Amber Mn²⁺';
      equation = 'MnO₄⁻ (Deep Purple) + 5Fe²⁺ + 8H⁺ → Mn²⁺ (Colorless/Amber) + 5Fe³⁺ + 4H₂O';
    } else if (has('mn') && has('naoh')) {
      liquidHex = '#10B981';
      colorLabel = 'Alkaline Manganate: Deep Purple → Emerald Green (MnO₄²⁻)';
      equation = '4MnO₄⁻ (Purple) + 4OH⁻ → 4MnO₄²⁻ (Emerald Green) + O₂↑ + 2H₂O';
    } else if (has('mn')) {
      liquidHex = '#9333EA';
      colorLabel = 'Deep Royal Violet-Purple Permanganate (MnO₄⁻) Solution';
      equation = 'KMnO₄ (aq) → K⁺ + MnO₄⁻ (Intense Royal Purple Solution)';
    } else if (has('cr') && (has('zn') || has('fe') || has('s'))) {
      liquidHex = '#059669';
      colorLabel = 'Reduced Chromium(III): Fiery Orange Cr₂O₇²⁻ → Emerald Green Cr³⁺';
      equation = 'Cr₂O₇²⁻ (Orange) + 3Zn + 14H⁺ → 2Cr³⁺ (Emerald Green) + 3Zn²⁺ + 7H₂O';
    } else if (has('cr')) {
      liquidHex = '#F97316';
      colorLabel = 'Fiery Dichromate Orange (Cr₂O₇²⁻) Solution';
      equation = 'Cr₂O₇²⁻ (Orange) + H₂O ⇌ 2CrO₄²⁻ + 2H⁺';
    } else if (has('cu') && has('fe')) {
      liquidHex = '#22C55E';
      precipitateHex = '#B45309';
      precipitateLabel = 'Displaced Reddish-Brown Copper (Cu↓) Metal Deposit';
      colorLabel = 'Displacement: Blue Cu²⁺ → Emerald Mint Green Fe²⁺ Solution';
      equation = 'Fe (s) + Cu²⁺ (aq, Blue) → Fe²⁺ (aq, Mint Green) + Cu↓ (Red-Brown Deposit)';
    } else if (has('cu') && has('nh4oh')) {
      liquidHex = '#1D4ED8';
      colorLabel = 'Deep Ultramarine Royal Blue [Cu(NH₃)₄]²⁺ Complex';
      equation = 'Cu²⁺ + 4NH₄OH (aq) → [Cu(NH₃)₄]²⁺ (Deep Royal Blue) + 4H₂O';
    } else if (has('cu') && hasAcid) {
      liquidHex = '#06B6D4';
      colorLabel = 'Aquamarine Cyan-Blue Copper(II) Chloride (CuCl₂) Solution';
      equation = 'CuO / Cu + 2HCl (aq) → CuCl₂ (aq, Aquamarine Blue-Green) + H₂O';
    } else if (has('co')) {
      if (bunsenBurnerOn || has('cl') || has('hcl')) {
        liquidHex = '#2563EB';
        colorLabel = 'Endothermic Shift: Rose-Pink → Deep Cobalt Blue [CoCl₄]²⁻';
        equation = '[Co(H₂O)₆]²⁺ (Rose Pink) + 4Cl⁻ + Heat ⇌ [CoCl₄]²⁻ (Deep Blue) + 6H₂O';
      } else {
        liquidHex = '#F43F5E';
        colorLabel = 'Rose-Pink Hexaaquacobalt(II) [Co(H₂O)₆]²⁺ Solution';
        equation = 'Co²⁺ + 6H₂O → [Co(H₂O)₆]²⁺ (Rose-Pink Complex — Heat to turn Blue!)';
      }
    } else if (has('fe') && (has('cl') || has('hno3') || has('br'))) {
      liquidHex = '#EA580C';
      colorLabel = 'Blood-Orange Ferric Chloride (FeCl₃ / Fe³⁺) Solution';
      equation = '2Fe (s) + 3Cl₂ → 2FeCl₃ (aq, Blood-Orange Ferric Solution)';
    } else if (has('ni')) {
      liquidHex = '#10B981';
      colorLabel = 'Apple-Emerald Green Nickel(II) [Ni(H₂O)₆]²⁺ Solution';
      equation = 'Ni (s) + 2H⁺ → Ni²⁺ (aq, Emerald Green) + H₂↑';
    } else if (has('i')) {
      liquidHex = '#8B5CF6';
      colorLabel = 'Deep Violet-Amber Iodine (I₂) Solution';
      equation = 'I₂ (s) + Aqueous Solvent → Deep Violet-Amber Iodine Tincture';
    } else if (has('br')) {
      liquidHex = '#DC2626';
      colorLabel = 'Deep Reddish-Brown Bromine Water (Br₂)';
      equation = 'Br₂ (l) + H₂O (l) ⇌ HOBr + HBr (Reddish-Brown Bromine Water)';
    } else if (has('cl')) {
      liquidHex = '#A3E635';
      colorLabel = 'Yellow-Green Chlorine Water (Cl₂)';
      equation = 'Cl₂ (g) + H₂O (l) ⇌ HCl + HOCl (Pale Yellow-Green)';
    } else if (has('na2co3') && hasAcid) {
      liquidHex = '#38BDF8';
      colorLabel = 'Vigorous CO₂↑ Effervescence Foam in Neutralized Salt Solution';
      equation = 'Na₂CO₃ (s) + 2HCl (aq) → 2NaCl (aq) + H₂O (l) + CO₂↑ (Turns Lime Water Milky)';
    } else if (hasAcid && has('naoh')) {
      liquidHex = '#22C55E';
      colorLabel = 'Neutralized Salt + Water Solution (pH 7.0)';
      equation = 'HCl (aq) + NaOH (aq) → NaCl (aq) + H₂O (l) + ΔH (pH 7.0)';
    } else {
      // Apply Indicator Color if no strongly colored transition metal overrides it
      if (activeIndicator === 'phenolphthalein') {
        liquidHex = isBasic ? '#EC4899' : '#38BDF8';
        colorLabel = isBasic
          ? 'Neon Magenta-Pink (Phenolphthalein in Basic Medium)'
          : 'Crystal Aqua (Phenolphthalein in Acidic/Neutral Medium)';
      } else if (activeIndicator === 'methyl-orange') {
        liquidHex = isAcidic ? '#EF4444' : isBasic ? '#FACC15' : '#FB923C';
        colorLabel = isAcidic
          ? 'Crimson Red (Methyl Orange in Acid)'
          : 'Golden Yellow (Methyl Orange in Base)';
      } else if (activeIndicator === 'universal') {
        if (ph <= 2.5) {
          liquidHex = '#EF4444';
          colorLabel = `Universal Indicator: Ruby Red (Strong Acid, pH ${ph.toFixed(1)})`;
        } else if (ph <= 5.8) {
          liquidHex = '#F97316';
          colorLabel = `Universal Indicator: Amber Orange (Weak Acid, pH ${ph.toFixed(1)})`;
        } else if (ph <= 7.6) {
          liquidHex = '#22C55E';
          colorLabel = `Universal Indicator: Emerald Green (Neutral, pH ${ph.toFixed(1)})`;
        } else if (ph <= 11.2) {
          liquidHex = '#3B82F6';
          colorLabel = `Universal Indicator: Royal Blue (Basic, pH ${ph.toFixed(1)})`;
        } else {
          liquidHex = '#8B5CF6';
          colorLabel = `Universal Indicator: Deep Violet (Strong Alkali, pH ${ph.toFixed(1)})`;
        }
      }
    }

    // Litmus Paper Colors
    let litmusTopHex = '#3B82F6';
    let litmusBottomHex = '#3B82F6';
    let litmusNote = '';

    if (activeIndicator === 'red-litmus') {
      litmusTopHex = '#EF4444';
      litmusBottomHex = litmusDipped && isBasic ? '#2563EB' : '#EF4444';
      litmusNote = isBasic
        ? 'Red Litmus submerged tip turned BLUE → Confirms Alkaline OH⁻ ions!'
        : 'Red Litmus stays RED in acidic/neutral solution.';
    } else {
      litmusTopHex = '#2563EB';
      litmusBottomHex = litmusDipped && isAcidic ? '#EF4444' : '#2563EB';
      litmusNote = isAcidic
        ? 'Blue Litmus submerged tip turned CRIMSON RED → Confirms Acidic H₃O⁺ ions!'
        : 'Blue Litmus stays BLUE in basic/neutral solution.';
    }

    return {
      ph,
      tempC,
      gasType,
      gasIntensity,
      hasExothermicSparks,
      precipitateHex,
      precipitateLabel,
      isAcidic,
      isBasic,
      liquidHex,
      colorLabel,
      litmusTopHex,
      litmusBottomHex,
      litmusNote,
      equation
    };
  }, [addedIds, addedChemicals, activeIndicator, litmusDipped, bunsenBurnerOn, isBlasted]);

  const filteredPeriodicItems = useMemo(() => {
    if (periodicFilter === 'ALL') return PERIODIC_AND_LAB_CHEMICALS;
    if (periodicFilter === 'EXPLOSIVE') {
      return PERIODIC_AND_LAB_CHEMICALS.filter(c => c.reactivityLevel === 3);
    }
    if (periodicFilter === 'COLOR') {
      return PERIODIC_AND_LAB_CHEMICALS.filter(c =>
        ['cr', 'mn', 'fe', 'co', 'ni', 'cu', 'ag', 'au', 'cl', 'br', 'i', 'naoh'].includes(c.id)
      );
    }
    return PERIODIC_AND_LAB_CHEMICALS.filter(c => c.category === periodicFilter);
  }, [periodicFilter]);

  const cameraPosition = useMemo<[number, number, number]>(() => {
    if (cameraPreset === 'closeup') return [0, 0.5, 5.1];
    if (cameraPreset === 'top') return [0, 4.8, 5.5];
    return [0, 1.0, 7.2];
  }, [cameraPreset]);

  return (
    <div className="space-y-6">
      {/* MAIN SIDE-BY-SIDE 3D VIRTUAL TEST TUBE & INTERACTIVE PERIODIC TABLE */}
      <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden shadow-sm">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EAE2D3] flex flex-wrap items-center justify-between gap-3 bg-[#F7F3EB]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
              Interactive 3D Periodic Table & Chemistry Reaction Simulator
            </p>
            <h3 className="text-lg font-semibold text-[#1C2A27] mt-0.5">
              Mix Periodic Elements in the 3D Test Tube — Real-Time Color Shifts, Precipitates & Exothermic Blasts
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                triggerExplosionBlast(
                  'Manual Detonation Test: 2K (s) + 2HCl (aq) → 2KCl + H₂↑ + 💥 Exothermic Fireball Blast!',
                  '#F97316'
                )
              }
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition shadow-sm cursor-pointer"
            >
              💥 Test 3D Blast Now
            </button>
            <button
              type="button"
              onClick={handleEmptyTube}
              className="px-3 py-1.5 rounded-lg border border-[#D5CBB8] bg-[#FFFDF9] hover:bg-[#EAE2D3] text-xs font-semibold text-[#1C2A27] transition cursor-pointer"
            >
              Empty Tube (0 mL)
            </button>
            <button
              type="button"
              onClick={handleResetTubeToHCl}
              className="px-3 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] text-xs font-semibold transition cursor-pointer"
            >
              Reset (HCl + Indicator)
            </button>
          </div>
        </div>

        {/* ONE-CLICK FAMOUS REACTION RECIPES (BLASTS & VIVID COLOR CHANGES) */}
        <div className="px-4 py-3 bg-[#0A3630] text-[#F5F0E6] border-b border-[#124E45] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#9CC5BE] mr-1">
            Instant Demos:
          </span>
          {[
            {
              label: '💥 Potassium (K) + HCl BLAST!',
              ids: ['hcl', 'k'],
              ind: 'universal' as IndicatorType
            },
            {
              label: '💥 Cesium (Cs) + Water BLAST!',
              ids: ['h2o', 'cs'],
              ind: 'phenolphthalein' as IndicatorType
            },
            {
              label: '💥 Sodium (Na) + Acid Fireball',
              ids: ['hcl', 'na'],
              ind: 'universal' as IndicatorType
            },
            {
              label: '🎨 Purple KMnO₄ → Colorless (Add Fe)',
              ids: ['mn', 'fe'],
              ind: 'none' as IndicatorType
            },
            {
              label: '🎨 Orange Cr₂O₇²⁻ → Emerald Green',
              ids: ['cr', 'zn'],
              ind: 'none' as IndicatorType
            },
            {
              label: '🎨 Blue Cu²⁺ → Mint Green (Fe Displacement)',
              ids: ['hcl', 'cu', 'fe'],
              ind: 'none' as IndicatorType
            },
            {
              label: '🎨 Silver + Iodine → Canary Yellow AgI↓',
              ids: ['ag', 'i'],
              ind: 'none' as IndicatorType
            },
            {
              label: '🎨 Aqua Regia Dissolves Gold (Au)!',
              ids: ['hcl', 'hno3', 'au'],
              ind: 'none' as IndicatorType
            }
          ].map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsBlasted(false);
                setActiveIndicator(demo.ind);
                setAddedIds([demo.ids[0]]);
                setLiquidVolumeMl(26);
                setTimeout(() => {
                  demo.ids.slice(1).forEach(id => handleAddChemicalToTube(id));
                }, 60);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#124E45] hover:bg-[#1B6B5F] border border-[#2B7A6E] text-[11px] font-semibold text-white transition cursor-pointer"
            >
              {demo.label}
            </button>
          ))}
        </div>

        {/* MAIN SPLIT GRID: LEFT = 3D TEST TUBE VIEWPORT, RIGHT = PERIODIC TABLE & CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT 5 COLS: 3D REACT THREE FIBER VIRTUAL TEST TUBE */}
          <div
            onDragOver={e => {
              e.preventDefault();
              if (!isDropHovering) setIsDropHovering(true);
            }}
            onDragLeave={() => setIsDropHovering(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDropHovering(false);
              const droppedId = e.dataTransfer.getData('text/plain') || draggedChemId;
              if (droppedId) {
                handleAddChemicalToTube(droppedId);
              }
            }}
            className={`lg:col-span-5 bg-[#06231F] text-[#F5F0E6] p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE2D3] relative transition ${
              isDropHovering ? 'ring-4 ring-inset ring-emerald-400' : ''
            }`}
          >
            {/* Top Status & Camera Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 z-10 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border-2 border-white shadow shrink-0"
                  style={{ backgroundColor: reactionMetrics.liquidHex }}
                />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#82B2A9] block">
                    Live 3D Liquid Color & State
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                    {reactionMetrics.colorLabel}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {(['front', 'closeup', 'top'] as const).map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      playUISound('click');
                      setCameraPreset(preset);
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-mono uppercase transition cursor-pointer ${
                      cameraPreset === preset
                        ? 'bg-[#0E6B5E] text-white font-semibold'
                        : 'bg-[#0A3630] text-[#9CC5BE] hover:text-white'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setRenderMode(prev => (prev === '3d' ? '2d-turbo' : '3d'))}
                  className="px-2 py-1 rounded text-[10px] font-mono bg-[#124E45] text-emerald-200 hover:text-white ml-1 cursor-pointer"
                >
                  {renderMode === '3d' ? '2D View' : '3D View'}
                </button>
              </div>
            </div>

            {/* EXPLOSION BLAST ALERT OVERLAY BANNER */}
            {isBlasted && (
              <div className="mb-2 p-3 rounded-xl bg-red-950/95 border-2 border-red-500 text-red-100 flex items-center justify-between gap-3 animate-pulse">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    💥 EXOTHERMIC BLAST & TUBE SHATTERED!
                  </p>
                  <p className="text-[11px] font-mono mt-0.5">{blastReason}</p>
                </div>
                <button
                  type="button"
                  onClick={handleResetTubeToHCl}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shrink-0 cursor-pointer"
                >
                  Repair Tube
                </button>
              </div>
            )}

            {/* 3D REACT THREE FIBER CANVAS (OR 2D SVG VIEW) */}
            {renderMode === '3d' ? (
              <div className="w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-[#124E45] bg-[#06231F] relative">
                <Canvas
                  dpr={[1, 1.75]}
                  camera={{ position: cameraPosition, fov: 42, near: 0.1, far: 100 }}
                >
                  <color attach="background" args={['#06231F']} />
                  <OrbitControls
                    enablePan={false}
                    minDistance={4.0}
                    maxDistance={10.5}
                    maxPolarAngle={Math.PI / 2 + 0.15}
                  />
                  <R3FTestTubeWorkbench
                    addedChemicals={addedChemicals}
                    liquidHex={reactionMetrics.liquidHex}
                    precipitateHex={reactionMetrics.precipitateHex}
                    litmusTopHex={reactionMetrics.litmusTopHex}
                    litmusBottomHex={reactionMetrics.litmusBottomHex}
                    showLitmus={
                      activeIndicator === 'blue-litmus' || activeIndicator === 'red-litmus'
                    }
                    litmusDipped={litmusDipped}
                    onToggleLitmusDip={() => {
                      playUISound('click');
                      setLitmusDipped(prev => !prev);
                    }}
                    gasIntensity={reactionMetrics.gasIntensity}
                    hasExothermicSparks={reactionMetrics.hasExothermicSparks}
                    bunsenBurnerOn={bunsenBurnerOn}
                    onToggleBunsen={() => {
                      playUISound('click');
                      setBunsenBurnerOn(prev => !prev);
                    }}
                    popTestTriggered={popTestTriggered}
                    liquidVolumeMl={liquidVolumeMl}
                    isDropHovering={isDropHovering}
                    lastAddedItem={lastAddedItem}
                    pourTimestamp={pourTimestamp}
                    isBlasted={isBlasted}
                    blastTimestamp={blastTimestamp}
                    blastColorHex={blastColorHex}
                    onQuickAddFrom3D={handleAddChemicalToTube}
                  />
                </Canvas>
              </div>
            ) : (
              <div className="w-full h-[380px] sm:h-[420px] rounded-xl border border-[#124E45] bg-[#072E29] flex flex-col items-center justify-center p-4">
                <svg viewBox="0 0 260 280" className="w-56 h-64">
                  <path
                    d="M95,30 L95,200 A35,35 0 0,0 165,200 L165,30"
                    fill="none"
                    stroke={isBlasted ? '#EF4444' : '#9CC5BE'}
                    strokeWidth="4"
                  />
                  <ellipse cx="130" cy="30" rx="37" ry="6" fill="none" stroke="#9CC5BE" strokeWidth="3" />
                  {liquidVolumeMl > 0 && (
                    <path
                      d="M98,100 L98,198 A32,32 0 0,0 162,198 L162,100 Z"
                      fill={reactionMetrics.liquidHex}
                      fillOpacity="0.92"
                    />
                  )}
                  {reactionMetrics.precipitateHex && (
                    <path
                      d="M100,190 A30,30 0 0,0 160,190 Z"
                      fill={reactionMetrics.precipitateHex}
                    />
                  )}
                </svg>
              </div>
            )}

            {/* Currently Mixed Chemicals Bar Inside Left Viewport */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#0A3630] border border-[#124E45]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9CC5BE]">
                  Chemicals Currently Inside Test Tube ({addedChemicals.length}):
                </span>
                {addedChemicals.length > 0 && (
                  <button
                    type="button"
                    onClick={handleEmptyTube}
                    className="text-[10px] font-mono text-rose-300 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              {addedChemicals.length === 0 ? (
                <p className="text-xs font-mono text-[#82B2A9]">
                  Test tube is empty. Click any element on the right to add it!
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {addedChemicals.map(c => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#06231F] border border-[#1B6B5F] text-xs font-mono font-bold text-white"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.colorHex }}
                      />
                      {c.symbol} ({c.name})
                      <button
                        type="button"
                        onClick={() =>
                          setAddedIds(prev => prev.filter(item => item !== c.id))
                        }
                        className="text-slate-400 hover:text-rose-400 ml-1 cursor-pointer"
                        title="Remove from tube"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Apparatus Action Buttons */}
            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  playUISound('click');
                  if (activeIndicator !== 'blue-litmus' && activeIndicator !== 'red-litmus') {
                    setActiveIndicator('blue-litmus');
                    setLitmusDipped(true);
                  } else {
                    setLitmusDipped(prev => !prev);
                  }
                }}
                className="px-2.5 py-2 rounded-lg bg-[#0E6B5E] hover:bg-[#128070] text-white text-xs font-semibold transition cursor-pointer"
              >
                {activeIndicator === 'blue-litmus' || activeIndicator === 'red-litmus'
                  ? litmusDipped
                    ? 'Raise Litmus'
                    : 'Dip Litmus'
                  : 'Show 3D Litmus'}
              </button>

              <button
                type="button"
                onClick={() => {
                  playUISound('click');
                  const nextBurner = !bunsenBurnerOn;
                  setBunsenBurnerOn(nextBurner);
                  if (nextBurner && addedIds.includes('h') && addedIds.includes('o')) {
                    triggerExplosionBlast(
                      '2H₂ + O₂ + Bunsen Flame → 2H₂O + 💥 Oxyhydrogen Detonation!',
                      '#F97316'
                    );
                  }
                }}
                className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  bunsenBurnerOn
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#0A3630] hover:bg-[#124E45] text-[#D6EAE6]'
                }`}
              >
                {bunsenBurnerOn ? '🔥 Burner: ON' : '🔥 Heat Tube'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (reactionMetrics.gasType === 'H2') {
                    playChemLabAudio('blast');
                    setPopTestTriggered(true);
                    handleAwardBonusXP(
                      currentStudent.id,
                      40,
                      'Verified Hydrogen (H₂) Gas with Burning Splinter Pop Test!'
                    );
                    showToast(
                      'POP! Hydrogen (H₂) Ignited!',
                      '2H₂ (g) + O₂ (g) → 2H₂O (l) + Sharp Pop Flame!',
                      'success'
                    );
                  } else {
                    playUISound('error');
                    showToast(
                      'No H₂ Gas Present',
                      'Add Zn, Mg, Ca, Li, or Na with Acid/Water first to generate H₂ gas.',
                      'warning'
                    );
                  }
                }}
                className="px-2.5 py-2 rounded-lg bg-[#0A3630] hover:bg-[#124E45] text-[#FDE047] text-xs font-semibold transition cursor-pointer"
              >
                H₂ Pop Test
              </button>

              <button
                type="button"
                onClick={() => {
                  if (reactionMetrics.gasType === 'CO2') {
                    playUISound('success');
                    setLimeWaterMilky(true);
                    handleAwardBonusXP(
                      currentStudent.id,
                      40,
                      'Verified CO₂ Gas with Milky Lime Water Test!'
                    );
                    showToast(
                      'Lime Water Turned Milky!',
                      'Ca(OH)₂ + CO₂ → CaCO₃↓ (Milky White Precipitate)',
                      'success'
                    );
                  } else {
                    playUISound('error');
                    showToast(
                      'No CO₂ Gas Present',
                      'Combine Na₂CO₃ (Sodium Carbonate) with an Acid (HCl/H₂SO₄) first.',
                      'warning'
                    );
                  }
                }}
                className="px-2.5 py-2 rounded-lg bg-[#0A3630] hover:bg-[#124E45] text-[#BAE6FD] text-xs font-semibold transition cursor-pointer"
              >
                CO₂ Lime Test
              </button>
            </div>

            {/* Live Telemetry Footer */}
            <div className="mt-3 pt-2.5 border-t border-[#124E45] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#9CC5BE]">
              <span>pH: {reactionMetrics.ph.toFixed(1)}</span>
              <span>·</span>
              <span>Temp: {reactionMetrics.tempC.toFixed(1)}°C</span>
              <span>·</span>
              <span>
                Gas:{' '}
                {reactionMetrics.gasType === 'none'
                  ? 'None'
                  : `${reactionMetrics.gasType}↑ Bubbles`}
              </span>
              <span>·</span>
              <span>Vol: {liquidVolumeMl} mL</span>
            </div>
          </div>

          {/* RIGHT 7 COLS: INTERACTIVE PERIODIC TABLE OF ELEMENTS & REAGENTS */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between space-y-4">
            {/* Live Equation & Color / Blast Readout Box */}
            <div className="p-4 rounded-xl bg-[#072E29] text-[#F5F0E6] space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#82B2A9]">
                  Live Chemical Reaction Equation & Color Readout
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: reactionMetrics.liquidHex }}
                  />
                  <span className="text-xs font-mono font-bold text-[#4ADE80]">
                    {reactionMetrics.isAcidic
                      ? `Acidic (pH ${reactionMetrics.ph.toFixed(1)})`
                      : reactionMetrics.isBasic
                      ? `Alkaline (pH ${reactionMetrics.ph.toFixed(1)})`
                      : `Neutral (pH ${reactionMetrics.ph.toFixed(1)})`}
                  </span>
                </div>
              </div>
              <p className="text-sm font-mono font-bold text-white break-words">
                {reactionMetrics.equation}
              </p>
              {reactionMetrics.precipitateLabel && (
                <p className="text-xs font-mono text-[#FDE047]">
                  ✓ Solid Precipitate at Bottom of Tube: {reactionMetrics.precipitateLabel}
                </p>
              )}
              <p className="text-xs text-[#D6EAE6] pt-1 border-t border-[#124E45]">
                {reactionMetrics.litmusNote}
              </p>
            </div>

            {/* Category Filter Tabs for the Periodic Table */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#0A4D44]">
                  1. Click or Drag Any Periodic Table Element or Lab Reagent into the Test Tube:
                </label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'ALL', label: 'All (28)' },
                    { id: 'EXPLOSIVE', label: '💥 Explosive Elements' },
                    { id: 'COLOR', label: '🎨 Color Changers' },
                    { id: 'Transition Metal', label: 'Transition Metals' },
                    { id: 'Lab Acid / Base / Salt', label: 'Acids & Bases' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        playUISound('click');
                        setPeriodicFilter(tab.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                        periodicFilter === tab.id
                          ? 'bg-[#0A4D44] text-[#F5F0E6]'
                          : 'bg-[#F2ECE1] text-[#5A5346] hover:bg-[#EAE2D3]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Periodic Table Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-2 max-h-[340px] overflow-y-auto pr-1">
                {filteredPeriodicItems.map(item => {
                  const isAdded = addedIds.includes(item.id);
                  const isExplosive = item.reactivityLevel === 3;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData('text/plain', item.id);
                        setDraggedChemId(item.id);
                      }}
                      onDragEnd={() => {
                        setDraggedChemId(null);
                        setIsDropHovering(false);
                      }}
                      onClick={() => handleAddChemicalToTube(item.id)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer relative ${
                        isAdded
                          ? 'bg-[#0A4D44] text-[#F5F0E6] border-[#0A4D44] shadow-sm'
                          : isExplosive
                          ? 'bg-[#FFF5F5] hover:bg-[#FEE2E2] text-[#1C2A27] border-red-300'
                          : 'bg-[#F7F3EB] hover:bg-[#EAE2D3] text-[#1C2A27] border-[#DDD4C2]'
                      }`}
                      title={item.shortDesc}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-base font-mono font-bold tracking-tight">
                          {item.symbol}
                        </span>
                        <div className="flex items-center gap-1">
                          {isExplosive && (
                            <span className="text-[10px]" title="Explosive Reaction!">
                              💥
                            </span>
                          )}
                          <span
                            className="w-3 h-3 rounded-full border border-black/25 shrink-0"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        </div>
                      </div>
                      <p
                        className={`text-xs font-semibold truncate mt-1 ${
                          isAdded ? 'text-white' : 'text-[#1C2A27]'
                        }`}
                      >
                        {item.name}
                      </p>
                      <p
                        className={`text-[10px] font-mono truncate mt-0.5 ${
                          isAdded ? 'text-[#9CC5BE]' : 'text-[#686052]'
                        }`}
                      >
                        {item.atomicNumber ? `Z=${item.atomicNumber} · ` : ''}
                        {isAdded ? '✓ In Tube (+More)' : '+ Add to Tube'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: pH Indicator & Litmus Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#686052] mb-2">
                2. Select pH Indicator Dye or 3D Litmus Strip (Changes Liquid / Strip Color by pH):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'universal' as const, label: 'Universal pH Rainbow' },
                  { id: 'phenolphthalein' as const, label: 'Phenolphthalein (Pink)' },
                  { id: 'methyl-orange' as const, label: 'Methyl Orange' },
                  { id: 'blue-litmus' as const, label: '3D Blue Litmus' },
                  { id: 'red-litmus' as const, label: '3D Red Litmus' }
                ].map(ind => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => {
                      playUISound('click');
                      setActiveIndicator(ind.id);
                      if (ind.id === 'blue-litmus' || ind.id === 'red-litmus') {
                        setLitmusDipped(true);
                      }
                    }}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      activeIndicator === ind.id
                        ? 'bg-[#0E6B5E] text-[#F5F0E6] border-[#0A4D44]'
                        : 'bg-[#F7F3EB] hover:bg-[#EAE2D3] text-[#1C2A27] border-[#DDD4C2]'
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Universal pH Scale Reference Bar with Live Pointer */}
            <div className="p-3 rounded-xl bg-[#F7F3EB] border border-[#E2D9C8] space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono font-semibold text-[#5A5346]">
                <span>pH 1 Strong Acid (Red)</span>
                <span>pH 4 Weak Acid</span>
                <span>pH 7 Neutral (Green)</span>
                <span>pH 10 Base (Blue)</span>
                <span>pH 14 Alkali (Violet)</span>
              </div>
              <div className="relative h-3.5 w-full rounded-full flex overflow-hidden">
                <div className="flex-1 bg-red-600" />
                <div className="flex-1 bg-orange-500" />
                <div className="flex-1 bg-amber-400" />
                <div className="flex-1 bg-emerald-500" />
                <div className="flex-1 bg-cyan-500" />
                <div className="flex-1 bg-blue-600" />
                <div className="flex-1 bg-purple-700" />
                <div
                  className="absolute top-0 bottom-0 w-2.5 bg-white border-2 border-[#072E29] rounded-full transition-all duration-300"
                  style={{
                    left: `calc(${Math.min(100, Math.max(0, (reactionMetrics.ph / 14) * 100))}% - 5px)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PART B: INTERACTIVE CHEMISTRY NUMERICAL & STOICHIOMETRY TABLE */}
      <div className="bg-[#FFFDF9] border border-[#DDD4C2] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#EAE2D3] flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0E6B5E]">
              Interactive Chemistry Numerical Table • Verified {verifiedNumericalIds.length} of{' '}
              {CHEM_NUMERICAL_CHALLENGES.length}
            </p>
            <h3 className="text-base font-semibold text-[#1C2A27] mt-0.5">
              pH, Molarity, Neutralization Titration & Salt Formula Mass Numericals
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold text-[#0A4D44]">
            Solve & Verify Each Row for Merit XP
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0A3630] text-[#F5F0E6] uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3.5 px-4">Concept & Numerical Problem</th>
                <th className="py-3.5 px-3">Formula & Given Data</th>
                <th className="py-3.5 px-3 text-center">Your Answer</th>
                <th className="py-3.5 px-4 text-right">Verify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D3]">
              {CHEM_NUMERICAL_CHALLENGES.map(row => {
                const isVerified = verifiedNumericalIds.includes(row.id);
                const userVal = chemNumericalInputs[row.id] ?? '';
                return (
                  <tr key={row.id} className={isVerified ? 'bg-[#EFF5F3]' : 'hover:bg-[#F7F3EB]'}>
                    <td className="py-3.5 px-4 max-w-md">
                      <span className="font-semibold text-[#0A4D44] block">{row.topic}</span>
                      <p className="text-[#1C2A27] mt-0.5 leading-relaxed">{row.problem}</p>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px]">
                      <span className="text-[#1C2A27] font-semibold block">{row.formula}</span>
                      <span className="text-[#686052]">{row.givenData}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <input
                          type="number"
                          step="any"
                          disabled={isVerified}
                          placeholder="0.0"
                          value={isVerified ? row.correctAnswer : userVal}
                          onChange={e =>
                            setChemNumericalInputs(prev => ({ ...prev, [row.id]: e.target.value }))
                          }
                          className="w-20 px-2.5 py-1.5 text-center font-mono font-semibold bg-[#F5F0E6] border border-[#D5CBB8] rounded-lg focus:outline-none focus:border-[#0A4D44]"
                        />
                        <span className="text-[11px] font-mono text-[#686052]">{row.unit}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isVerified ? (
                        <span className="font-mono font-semibold text-[#0A4D44]">
                          Verified ✓ (+{row.xp} XP)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const parsed = parseFloat(userVal);
                            if (Math.abs(parsed - row.correctAnswer) < 0.05) {
                              setVerifiedNumericalIds(prev => [...prev, row.id]);
                              handleAwardBonusXP(
                                currentStudent.id,
                                row.xp,
                                `Solved Chemistry Numerical: ${row.topic}`
                              );
                            } else {
                              playUISound('error');
                              showToast(
                                'Check Calculation',
                                `Hint: Apply ${row.formula} using ${row.givenData}.`,
                                'warning'
                              );
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0A4D44] hover:bg-[#073831] text-[#F5F0E6] font-semibold text-xs transition cursor-pointer"
                        >
                          Check (+{row.xp} XP)
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
