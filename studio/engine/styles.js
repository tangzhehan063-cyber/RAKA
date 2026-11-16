// engine/styles.js — colour moods + switchable visual styles.
// A MOOD is the lighting situation of a location (day, dusk, night, storm, interiors, void).
// A STYLE re-grades every mood (palette overrides + a lift/gamma/gain colour grade on the final frame + post settings).
// grade: contrast (around mid-grey), sat (saturation), lift/gamma/gain per RGB channel (lift tints shadows, gain tints highlights).
// Scenes must take colours from mood()/S() so a style switch re-themes the whole video.

export const BASE_MOODS = {
  day:          { sky: ['#8fb0d8', '#cfdcea', '#efe3d2'], ambient: '#6f7d96', key: '#fff3dc', rim: '#fff1d6', wall: '#8d8496', floor: '#5f5866', dark: '#2f2a36', practical: '#ffe2a8', grass: '#4f8a55', road: '#5d5a66', fog: '#dfe4f0' },
  golden:       { sky: ['#6b5a8e', '#e89a6a', '#f9d49c'], ambient: '#4a3a50', key: '#ffcf8f', rim: '#ffc68a', wall: '#5a3a34', floor: '#45302a', dark: '#2a1814', practical: '#ffe7b0', grass: '#4d6b3c', road: '#4a3c40', fog: '#f0c49a' },
  dusk:         { sky: ['#3d3360', '#8a5a86', '#e8956b', '#f7cf98'], ambient: '#3b2b3d', key: '#ffc68a', rim: '#ffc68a', wall: '#4a3646', floor: '#3d2c38', dark: '#231a27', practical: '#ffd59a', grass: '#3d5a48', road: '#3a3040', fog: '#c08a8a' },
  night:        { sky: ['#0b1028', '#1d2550', '#3a3570'], ambient: '#1e2444', key: '#c9d4ff', rim: '#a9b8ff', wall: '#262a46', floor: '#1b1e33', dark: '#0f1122', practical: '#ffb860', grass: '#22433a', road: '#24263a', fog: '#3a4270' },
  storm:        { sky: ['#141a33', '#2a3358', '#3d4670'], ambient: '#232a48', key: '#dfe6ff', rim: '#cfd9ff', wall: '#2b3150', floor: '#1c2238', dark: '#0d1020', practical: '#bcd0ff', grass: '#25483e', road: '#232838', fog: '#4a5580' },
  interiorWarm: { sky: ['#c98a74', '#f2b585', '#f7cf98'], ambient: '#4a3646', key: '#ffd59a', rim: '#ffcf8f', wall: '#4f3a40', floor: '#3a2a2e', dark: '#21171c', practical: '#ffd28a', grass: '#3d5a48', road: '#3a3040', fog: '#a87a70' },
  interiorCool: { sky: ['#2a3560', '#5a6aa0'], ambient: '#2a2c48', key: '#cbd6ff', rim: '#b8c6ff', wall: '#2e3150', floor: '#22243a', dark: '#121426', practical: '#9fe0ff', grass: '#22433a', road: '#24263a', fog: '#4a5080' },
  void:         { sky: ['#0a0e1a', '#121a2e'], ambient: '#151c30', key: '#ffffff', rim: '#8fb8e8', wall: '#121a2e', floor: '#0d1322', dark: '#070a12', practical: '#ffd47e', grass: '#1d3a33', road: '#151a28', fog: '#1d2740' },
};

const UI = { card: 'rgba(18,28,48,.94)', cardLine: 'rgba(150,180,230,.25)', text: '#9fb6d8', sub: '#6f84a6', accent: '#ff6f61', gold: '#ffd47e', cream: '#fff1dc', blueprint: '#8fb8e8', bpBg: '#0b1324', good: '#5fd39a' };

export const STYLES = {
  emerald: {
    name: 'GrowKaz Emerald', desc: 'GrowKaz signature look: deep forest-green shadows, warm gold key light, electric lime rim light, rich bloom.',
    ink: '#06110c', inkFar: '#1c3328', feature: '#f2ffe8', rimWidth: 4.5,
    ui: { ...UI, card: 'rgba(8,30,22,.94)', cardLine: 'rgba(140,255,170,.28)', text: '#a8e8c0', sub: '#6fa88a', accent: '#c6ff3d', gold: '#ffd45a', blueprint: '#7dffb0', bpBg: '#061a12', good: '#c6ff3d' },
    grade: { contrast: 1.08, sat: 1.15, lift: [0.0, 0.035, 0.02], gamma: [0.96, 1.06, 0.96], gain: [1.02, 1.1, 0.88], vignette: 0.6, grain: 0.05, bloom: 0.8 },
    moods: {
      dusk: { sky: ['#0c2a22', '#1f5a44', '#7ab05a', '#f2d36a'], key: '#ffd77a', rim: '#c6ff3d', wall: '#1e3a30', floor: '#152a22', dark: '#0a1812', practical: '#ffe28a', fog: '#5a8a6a' },
      golden: { sky: ['#1a4a38', '#8ab04a', '#f6d45a'], rim: '#d8ff6a', key: '#ffd36a' },
      night: { sky: ['#03100c', '#0a2a20', '#164a36'], rim: '#7dffb0', practical: '#ffd45a', wall: '#10261e' },
      interiorWarm: { rim: '#c6ff3d', wall: '#233a2e', practical: '#ffd45a' },
      void: { sky: ['#03100c', '#08201a'], rim: '#7dffb0' },
    },
  },
  imperial: {
    name: 'Imperial Ink', desc: 'Stick.Tales: ancient Chinese palace at night. Ink-black shadows, tarnished gold key, lacquer-red accents, aged paper highlights, heavy vignette.',
    ink: '#0a0a0c', inkFar: '#2a2420', feature: '#f3e9d2', rimWidth: 4.5,
    ui: { ...UI, card: 'rgba(20,14,10,.94)', cardLine: 'rgba(201,162,74,.35)', text: '#e9dfc7', sub: '#a8946a', accent: '#c4302b', gold: '#d9b25a', cream: '#efe4c8', blueprint: '#c9a24a', bpBg: '#140e0a', good: '#5f8f6a' },
    grade: { contrast: 1.14, sat: 0.92, lift: [0.02, 0.01, 0.0], gamma: [1.02, 0.98, 0.92], gain: [1.08, 1.0, 0.84], vignette: 0.85, grain: 0.07, bloom: 0.75 },
    moods: {
      night: { sky: ['#07080c', '#121018', '#241a18'], rim: '#d9b25a', practical: '#ffb54a', wall: '#1a1412', floor: '#120e0c', dark: '#08070a', fog: '#2a201a', key: '#ffcf86' },
      interiorWarm: { sky: ['#2a1410', '#5a2a18', '#8a5a2a'], rim: '#e8c26a', wall: '#3a1a14', floor: '#24120e', dark: '#120806', practical: '#ffc860', key: '#ffd38a', fog: '#6a3a22' },
      golden: { sky: ['#3a2414', '#a8743a', '#efd59a'], rim: '#ffe08a', key: '#ffd88f' },
      void: { sky: ['#050506', '#0e0c0e'], rim: '#9e1b1b' },
    },
  },
  flat: {
    name: 'Flat Storybook', desc: 'Stick.Tales: bright flat illustration, neutral grade, light vignette.',
    ink: '#1b1b1f', inkFar: '#3a3a40', feature: '#ffffff', rimWidth: 0,
    ui: { ...UI, gold: '#ffd23a', cream: '#ffffff' },
    grade: { contrast: 1.0, sat: 1.0, lift: [0, 0, 0], gamma: [1, 1, 1], gain: [1, 1, 1], vignette: 0.15, grain: 0.015, bloom: 0.2 },
    moods: {},
  },
  paper: {
    name: 'Paper Daylight', desc: 'High-key editorial: warm cream paper world, navy ink lines, no neon, almost no bloom. The orange mascot pops against the pale background.',
    ink: '#1b2238', inkFar: '#8a8fa6', feature: '#ffffff', rimWidth: 0,
    ui: { ...UI, card: 'rgba(255,250,238,.96)', cardLine: 'rgba(27,34,56,.22)', text: '#2a3150', sub: '#6b7190', accent: '#d64a33', gold: '#e8a21c', cream: '#1b2238', blueprint: '#2f5fa8', bpBg: '#f6efdd', good: '#2f9a6a' },
    grade: { contrast: 1.0, sat: 0.95, lift: [0.1, 0.09, 0.07], gamma: [1.05, 1.03, 1.0], gain: [1.02, 1.0, 0.94], vignette: 0.12, grain: 0.03, bloom: 0.1 },
    moods: {
      day: { sky: ['#f4e6c8', '#f9efd6', '#fff7e6'], ambient: '#b8aa94', key: '#fffaf0', wall: '#e9dcc0', floor: '#cdbd9f', dark: '#5a5468', practical: '#f2b441', fog: '#f6ecd6' },
      golden: { sky: ['#f2c58a', '#f8dcae', '#fff1d4'], key: '#fff0d0', wall: '#e8cfa6', floor: '#c9a97c', dark: '#5a4638', fog: '#f4d9b0' },
      dusk: { sky: ['#e8a98e', '#f2c4a0', '#f9dfbc', '#fff0d6'], key: '#fff0d6', rim: '#ffe2b8', wall: '#dcb89c', floor: '#b98f78', dark: '#4a3a40', practical: '#f2b441', fog: '#ecc0a4' },
      night: { sky: ['#2a3a64', '#4a5f94', '#8a9ac4'], ambient: '#6a769c', key: '#e6ecff', rim: '#dfe6ff', wall: '#7a86ac', floor: '#5a6488', dark: '#23294a', practical: '#ffc65a', fog: '#8a98c0' },
      storm: { sky: ['#5a6a8a', '#8a98b4', '#b8c2d4'], wall: '#8a96b0', floor: '#68748e', dark: '#2a3248', fog: '#a8b4c8' },
      interiorWarm: { sky: ['#e8c9a0', '#f2d9b4', '#fbe9cc'], rim: '#fff0d0', wall: '#e2c9a4', floor: '#bfa07a', dark: '#4a3a34', practical: '#f2b441', fog: '#ecd2ae' },
      interiorCool: { sky: ['#b8c8e0', '#d4deee'], rim: '#eef3ff', wall: '#c4d0e4', floor: '#9aa9c4', dark: '#33405e', practical: '#ffd27a', fog: '#c8d4e8' },
      void: { sky: ['#efe4cc', '#f7eed8'], rim: '#d64a33', wall: '#e6d9bd', floor: '#d2c4a4', dark: '#2a3150' },
    },
  },
  indigo: {
    name: 'Indigo Marigold', desc: 'Complementary blue/yellow: rich indigo-blue shadows with marigold-yellow light. Cinematic but not green, not neon.',
    ink: '#080c24', inkFar: '#26306a', feature: '#fff6d8', rimWidth: 3.5,
    ui: { ...UI, card: 'rgba(14,20,60,.94)', cardLine: 'rgba(255,200,80,.3)', text: '#c4cffc', sub: '#8090d0', accent: '#ff9f1c', gold: '#ffc83d', cream: '#fff6d8', blueprint: '#8aa4ff', bpBg: '#0a1038', good: '#ffc83d' },
    grade: { contrast: 1.08, sat: 1.05, lift: [0.0, 0.01, 0.06], gamma: [1.0, 0.98, 1.08], gain: [1.1, 1.04, 0.86], vignette: 0.55, grain: 0.04, bloom: 0.3 },
    moods: {
      dusk: { sky: ['#141a5a', '#3a4aa8', '#e8a64a', '#ffd98a'], key: '#ffd27a', rim: '#ffc040', wall: '#2a3478', floor: '#1c2458', dark: '#0c1038', practical: '#ffd27a', fog: '#6a78c8' },
      golden: { sky: ['#2a3a98', '#f0a840', '#ffe49a'], rim: '#ffd060', key: '#ffe2a0' },
      night: { sky: ['#0a1040', '#1a2a80', '#3a54b8'], ambient: '#2a3a88', rim: '#ffc83d', practical: '#ffc83d', wall: '#1c2870', floor: '#121a58', dark: '#080c2c', fog: '#3a4aa0' },
      interiorWarm: { rim: '#ffc040', wall: '#2c3a88', floor: '#1e2866', practical: '#ffc83d' },
      void: { sky: ['#080c30', '#101a58'], rim: '#ffc83d' },
    },
  },
  clay: {
    name: 'Clay Terracotta', desc: 'Earthy matte: terracotta, sand and dusty teal. Warm, tactile, flat-lit, no glow. Calm and human.',
    ink: '#2a1a16', inkFar: '#7a5a4c', feature: '#fff4e4', rimWidth: 0,
    ui: { ...UI, card: 'rgba(60,34,28,.94)', cardLine: 'rgba(255,214,170,.3)', text: '#f2d8c0', sub: '#b8907a', accent: '#e8603a', gold: '#f2c25a', cream: '#fff0dc', blueprint: '#7ab8b0', bpBg: '#2a1814', good: '#8ac0a0' },
    grade: { contrast: 0.98, sat: 0.9, lift: [0.07, 0.04, 0.03], gamma: [1.06, 1.02, 0.96], gain: [1.06, 0.98, 0.86], vignette: 0.35, grain: 0.07, bloom: 0.15 },
    moods: {
      day: { sky: ['#e0b894', '#efcfa8', '#f8e4c4'], wall: '#c88a68', floor: '#9a6650', dark: '#4a2e28', fog: '#ecc9a4' },
      golden: { sky: ['#c8704a', '#e8a070', '#f8d4a4'], key: '#ffe0b0', wall: '#b87254', floor: '#8a5440', dark: '#3a2420' },
      dusk: { sky: ['#4a3a52', '#a85a52', '#e0905a', '#f4cc94'], key: '#ffcf94', rim: '#ffb070', wall: '#8a5444', floor: '#6a4034', dark: '#2e1c1c', practical: '#ffd49a', fog: '#c08a6a' },
      night: { sky: ['#1c2a34', '#2e4a52', '#4a6e72'], ambient: '#3a5058', rim: '#f2a06a', practical: '#f2b25a', wall: '#34464a', floor: '#26343a', dark: '#141e22', fog: '#4a6a6e' },
      interiorWarm: { rim: '#ffc08a', wall: '#a8664c', floor: '#7a4838', dark: '#3a2220', practical: '#ffd080' },
      interiorCool: { sky: ['#3a5a62', '#6a8e8e'], wall: '#4a6a70', floor: '#34505a', dark: '#1a2a30', practical: '#ffd080', rim: '#f2c2a0' },
      void: { sky: ['#2a1c1a', '#3a2622'], rim: '#e8603a' },
    },
  },
  lembut: {
    name: 'Lembut Terang', desc: 'RAKA: dunia terang pastel, kontras sangat halus, tanpa neon, tanpa rim/outline (2D dan 3D), bloom hampir nol; tokoh arang lembut, bayangan tipis.',
    ink: '#3d4352', inkFar: '#a4a2b0', feature: '#fffdf8', rimWidth: 0, outline3D: false,
    ui: { ...UI, card: 'rgba(255,250,240,.96)', cardLine: 'rgba(43,47,58,.18)', text: '#2a3150', sub: '#6b7190', accent: '#d64a33', gold: '#8a4f0c', cream: '#2b2f3a', blueprint: '#3f6fb8', bpBg: '#f4ecdc', good: '#2f8a57' },
    grade: { contrast: 0.93, sat: 0.84, lift: [0.12, 0.11, 0.1], gamma: [1.06, 1.04, 1.02], gain: [1.0, 0.99, 0.96], vignette: 0.08, grain: 0.02, bloom: 0.03 },
    moods: {
      day: { sky: ['#cfe0ee', '#e6eef2', '#f7f1e4'], ambient: '#b8b0a4', key: '#fffaf0', rim: '#fffaf0', wall: '#e9dcc6', floor: '#c9b49a', dark: '#5a5468', practical: '#f2b441', fog: '#eef0ea' },
      golden: { sky: ['#f2c58a', '#f8dcae', '#fff1d4'], ambient: '#c4a68a', key: '#fff0d0', rim: '#fff0d0', wall: '#ecd2b0', floor: '#c9a27c', dark: '#5a4638', practical: '#f2b441', fog: '#f4d9b0' },
      dusk: { sky: ['#c9a0a8', '#e8bfa8', '#f6dcc0'], ambient: '#b49a98', key: '#ffe6c8', rim: '#ffe6c8', wall: '#dcbcae', floor: '#b0907e', dark: '#4a3a40', practical: '#f2b441', fog: '#ecd0c0' },
      night: { sky: ['#5a6a8e', '#7f8fb0', '#b0bcd4'], ambient: '#7a86a6', key: '#e6ecff', rim: '#e6ecff', wall: '#8f99b4', floor: '#6c7492', dark: '#2e3448', practical: '#ffcf8a', fog: '#a8b2cc' },
      storm: { sky: ['#6a7488', '#8c96a8', '#b4bcc8'], ambient: '#7c8494', key: '#eef2f8', rim: '#eef2f8', wall: '#8a92a2', floor: '#6a7282', dark: '#30343e', practical: '#f2c46a', fog: '#b0b8c4' },
      interiorWarm: { sky: ['#f3d9b8', '#f6e4c8', '#fbefdc'], ambient: '#c8b29a', key: '#fff1da', rim: '#fff1da', wall: '#e8cfb0', floor: '#c9a17e', dark: '#5a4a44', practical: '#f2b441', fog: '#f0dcc0' },
      interiorCool: { sky: ['#c8d6e4', '#dce6f0'], ambient: '#a8b4c4', key: '#f4f8ff', rim: '#f4f8ff', wall: '#c8d2de', floor: '#9aa8b8', dark: '#3a4450', practical: '#f2c46a', fog: '#d4dce6' },
      void: { sky: ['#efe6d8', '#e6dccb'], ambient: '#cbbfae', key: '#ffffff', rim: '#d64a33', wall: '#e6dccb', floor: '#d4c8b4', dark: '#5a5048', practical: '#f2b441', fog: '#efe6d8' },
    },
  },
  lavender: {
    name: 'Dusty Lavender', desc: 'Soft violet and peach: muted lavender shadows, warm peach key, gentle haze. Quiet, modern, not neon.',
    ink: '#1e1832', inkFar: '#5a5080', feature: '#fff6f0', rimWidth: 3,
    ui: { ...UI, card: 'rgba(40,32,72,.92)', cardLine: 'rgba(210,190,255,.3)', text: '#e0d4ff', sub: '#9a8cc4', accent: '#ff8a5c', gold: '#ffd09a', cream: '#fff4ec', blueprint: '#b8a4ff', bpBg: '#1a1438', good: '#9ae0c0' },
    grade: { contrast: 0.98, sat: 0.88, lift: [0.06, 0.04, 0.08], gamma: [1.02, 1.0, 1.06], gain: [1.06, 0.98, 1.0], vignette: 0.4, grain: 0.04, bloom: 0.35 },
    moods: {
      day: { sky: ['#b8aee0', '#dccef0', '#fbe4dc'], wall: '#a89ac8', floor: '#7a6ea4', dark: '#3a3260', fog: '#dccef0' },
      golden: { sky: ['#8a7ac0', '#f0a8a0', '#ffe0c4'], key: '#ffdcc0', wall: '#9a80b0', floor: '#6e5a8a', dark: '#342a58' },
      dusk: { sky: ['#3a3270', '#7a68b0', '#e89aa0', '#ffd4b4'], key: '#ffcfb0', rim: '#ffb0a0', wall: '#5a4c8a', floor: '#463a70', dark: '#241c48', practical: '#ffd8b8', fog: '#a090c8' },
      night: { sky: ['#14103c', '#2c2468', '#5a4a98'], ambient: '#3a3070', rim: '#ffb4a0', practical: '#ffd09a', wall: '#2e2860', floor: '#201a4a', dark: '#100c30', fog: '#4a3e88' },
      interiorWarm: { rim: '#ffb4a0', wall: '#6a5496', floor: '#4a3a74', dark: '#241c48', practical: '#ffd8b0' },
      void: { sky: ['#100c2c', '#1c1650'], rim: '#ffb4a0' },
    },
  },
  ember: {
    name: 'Ember Forge', desc: 'Charcoal-black world lit by fire: crimson shadows, molten copper rim light, hot orange glows, heavy contrast.',
    ink: '#0c0606', inkFar: '#2e1614', feature: '#fff0e0', rimWidth: 4,
    ui: { ...UI, card: 'rgba(30,12,10,.94)', cardLine: 'rgba(255,140,90,.3)', text: '#f0b49a', sub: '#a8705c', accent: '#ff3d2e', gold: '#ffa53d', blueprint: '#ff9a6a', bpBg: '#1a0806', good: '#ffc53d' },
    grade: { contrast: 1.18, sat: 1.2, lift: [0.05, 0.0, 0.0], gamma: [1.08, 0.94, 0.86], gain: [1.2, 0.95, 0.75], vignette: 0.75, grain: 0.065, bloom: 0.85 },
    moods: {
      dusk: { sky: ['#1a0606', '#5a140e', '#c8401e', '#ffa040'], key: '#ff9a4a', rim: '#ff7a2e', wall: '#3a1612', floor: '#2a100c', dark: '#140606', practical: '#ffb050', fog: '#8a3a26' },
      night: { sky: ['#0a0404', '#2a0a08', '#5a1a10'], rim: '#ff6a2e', practical: '#ffa53d', wall: '#241010' },
      golden: { sky: ['#4a1a10', '#d0602a', '#ffb860'], rim: '#ff8a3a' },
      interiorWarm: { rim: '#ff7a2e', wall: '#3a1a16' },
    },
  },
  arctic: {
    name: 'Arctic Glass', desc: 'Clean icy world: pale steel-teal shadows, crisp white key, bright cyan rim light, cool and sharp, almost no grain.',
    ink: '#08121a', inkFar: '#2a4050', feature: '#f4fdff', rimWidth: 4,
    ui: { ...UI, card: 'rgba(10,30,44,.92)', cardLine: 'rgba(160,240,255,.3)', text: '#bfefff', sub: '#7aaabf', accent: '#3de0ff', gold: '#e8fbff', blueprint: '#9af2ff', bpBg: '#071822', good: '#5fffd2' },
    grade: { contrast: 1.04, sat: 0.82, lift: [0.02, 0.05, 0.07], gamma: [0.94, 1.02, 1.08], gain: [0.92, 1.04, 1.12], vignette: 0.4, grain: 0.025, bloom: 0.65 },
    moods: {
      dusk: { sky: ['#123044', '#2e6a86', '#8ad0e0', '#e6f8ff'], key: '#eaf8ff', rim: '#7ff0ff', wall: '#2a4656', floor: '#1e3442', dark: '#0e1e28', practical: '#c8f6ff', fog: '#8ab8c8' },
      golden: { sky: ['#2a5a76', '#a0d8e8', '#f0fcff'], rim: '#a8f6ff', key: '#f4fcff' },
      night: { sky: ['#040e16', '#0c2636', '#18465a'], rim: '#5fe8ff', practical: '#e8fbff' },
      interiorWarm: { rim: '#9af2ff', wall: '#2e4a58', practical: '#e0faff' },
    },
  },
  sakura: {
    name: 'Sakura Bloom', desc: 'Dreamy rose-and-peach world: plum shadows, soft pink sky, warm peach key, glowing rose rim light, gentle haze.',
    ink: '#1a0c16', inkFar: '#4a2a40', feature: '#fff4f6', rimWidth: 5,
    ui: { ...UI, card: 'rgba(50,20,40,.9)', cardLine: 'rgba(255,170,210,.3)', text: '#ffc4dc', sub: '#c088a4', accent: '#ff5fa0', gold: '#ffd0a0', blueprint: '#ffb0d4', bpBg: '#220e1c', good: '#ffa0c8' },
    grade: { contrast: 0.95, sat: 1.05, lift: [0.07, 0.03, 0.06], gamma: [1.08, 1.0, 1.04], gain: [1.1, 0.96, 1.02], vignette: 0.35, grain: 0.05, bloom: 0.7 },
    moods: {
      dusk: { sky: ['#4a2050', '#b05a8a', '#f2a0b4', '#ffe0d0'], key: '#ffcfb0', rim: '#ffa0c8', wall: '#5a3048', floor: '#46243a', dark: '#2a1222', practical: '#ffd8c0', fog: '#d08aa8' },
      night: { sky: ['#1a0a24', '#3a1a48', '#6a3a70'], rim: '#ff9ad0', practical: '#ffc8a0' },
      golden: { sky: ['#8a4a7a', '#f2a0a0', '#ffe4c4'], rim: '#ffb4c8' },
      interiorWarm: { rim: '#ffa0c8', wall: '#5a3448' },
    },
  },
  retro: {
    name: 'Retro Print', desc: 'Vintage poster look: faded teal and mustard, sepia-warm highlights, low saturation, flat contrast, heavy print grain.',
    ink: '#1c1612', inkFar: '#4a4036', feature: '#fbf2dc', rimWidth: 5.5,
    ui: { ...UI, card: 'rgba(36,40,36,.92)', cardLine: 'rgba(230,200,140,.3)', text: '#e8d8b0', sub: '#a89878', accent: '#e8603a', gold: '#e8b83a', blueprint: '#8ac0b0', bpBg: '#1a2420', good: '#9ac06a' },
    grade: { contrast: 0.9, sat: 0.7, lift: [0.08, 0.07, 0.05], gamma: [1.06, 1.04, 0.96], gain: [1.06, 1.0, 0.86], vignette: 0.5, grain: 0.11, bloom: 0.35 },
    moods: {
      dusk: { sky: ['#2a4a48', '#5a8a80', '#e0a050', '#f2d8a0'], key: '#f2c880', rim: '#f2c070', wall: '#4a4038', floor: '#3a322c', dark: '#221c18', practical: '#f2d090', fog: '#a89070' },
      night: { sky: ['#14201e', '#24403c', '#3a5a54'], rim: '#e8c070', practical: '#e8603a' },
      golden: { sky: ['#4a7a70', '#e0a050', '#f6dca8'], rim: '#f6c87a' },
    },
  },
};
export const STYLE_IDS = Object.keys(STYLES);
