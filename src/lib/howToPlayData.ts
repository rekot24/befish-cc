/** Data for the How to Play page sections and their content. */

export type InfoCardData = {
  label: string;
  value: string;
  note: string;
};

export type BoostCardData = {
  icon: string;
  name: string;
  desc: string;
  duration: string;
};

export type PassCardData = {
  icon: string;
  name: string;
  desc: string;
};

export type GemCardData = {
  amount: string;
};

export type ScreenElementData = {
  element: string;
  location: string;
  desc: string;
};

export type TierChainItem = {
  label: string;
  /** Matches a --tier-[key] token in globals.css — used to pick the pill's CSS class. */
  key: 'normal' | 'golden' | 'rainbow' | 'glowing' | 'shadow';
  multiplier: string | null;
};

export const FISH_STATS: InfoCardData[] = [
  {
    label: 'Size gain',
    value: 'Growth',
    note: 'How much your fish grows each time it eats a food pellet or other fish. Higher = get bigger numbers above your fish while in the tank.',
  },
  {
    label: 'Movement',
    value: 'Speed',
    note: 'How fast your fish moves around the tank. One of the most important stats. Higher = chase others and escape predators.',
  },
  {
    label: 'XP',
    value: 'XP Multiplier',
    note: 'Determines how fast you collect fish in your net by eating pellets/food in the tank.',
  },
  {
    label: '1 in ???',
    value: 'Rarity',
    note: 'How rare this fish is, based on the 1 in xx number value. Higher rarity = much better stats.',
  },
];

export const SCREEN_ELEMENTS: ScreenElementData[] = [
  { element: '💎 Gem Counter',      location: 'Top center',    desc: 'Your current Gem balance. The only purpose of gems is to open Treasures before the timer — see Game Mechanics → Treasures for the full mechanics.' },
  { element: '🏆 Tank Leaderboard', location: 'Top right',     desc: 'Biggest fishes in the tank.' },
  { element: '📖 Fishdex',          location: 'Top left',      desc: 'Opens your fish collection. Shows how many of the 300 you\'ve discovered.' },
  { element: '🛒 Shop',             location: 'Left',          desc: 'Buy Passes, Gems, and Treasure Chests. Red badge means new items are available.' },
  { element: '🍀 Luck',             location: 'Bottom left',   desc: 'Your total Luck %. Increases your chances of catching rarer fish from all sources.' },
  { element: '⚡ XP Bar',           location: 'Bottom center', desc: 'Fills up as you eat food. Shows your current XP Multiplier value.' },
  { element: '🐟 Switch Fish',      location: 'Bottom center', desc: 'Opens fish selection. Only available while in the lobby.' },
  { element: '🏁 End Run',          location: 'Bottom right',  desc: 'Ends your run, banks all fish collected in your net, and resets your fish size back to 1.' },
  { element: '🫧 Boosts',           location: 'Bottom right',  desc: 'Opens the Boosts menu for temporary power-ups.' },
  { element: '🤖 Auto Farm',        location: 'Right',         desc: 'Automatically moves and plays for you while AFK.' },
  { element: '🕸️ Net Counter',      location: 'Right of XP bar', desc: 'Number of fish you\'ve collected on the current run. Only visible while in the tank.' },
];

export const BOOSTS: BoostCardData[] = [
  { icon: '🍀', name: 'Luck Boost',    duration: '10 min', desc: '+100% Luck. Increases your luck by 100.' },
  { icon: '🟠', name: 'Growth Boost',  duration: '5 min',  desc: '+100% Growth. Your fish gains size twice as fast from eating food and other players.' },
  { icon: '⚗️', name: 'XP Boost',      duration: '10 min', desc: '+100% XP. Increases your in-game XP multiplier.' },
  { icon: '💨', name: 'Speed Boost',   duration: '5 min',  desc: '+50% Movement Speed. Increases your movement speed.' },
  { icon: '☘️', name: 'Super Luck',    duration: '30 min', desc: '+1000% Luck. Increases your luck by 1000.' },
  { icon: '⚗️', name: 'Super XP',      duration: '30 min', desc: '+250% XP for 30 minutes. A sustained surge — best during active sessions with a high-XP fish equipped.' },
];

export const PASSES: PassCardData[] = [
  { icon: '🍀', name: 'Lucky',         desc: 'Permanently +100% Luck. Stacks with all other Luck sources.' },
  { icon: '⏩', name: 'Fast XP',       desc: 'Permanently +50% XP for your in-tank XP bar. Increases your rate of collecting nets.' },
  { icon: '🎣', name: 'Double Loot',   desc: 'Get 2 nets every time your XP bar fills, instead of 1. Doubles fish collection rate.' },
  { icon: '🧲', name: 'Food Magnet',   desc: 'Increases your circle of food collection radius. You can see this transparent circle around your fish. Highly beneficial.' },
  { icon: '📈', name: 'Double Growth', desc: 'Gain 2× size from everything you eat. Stacks with your fish\'s Growth stat and Growth Boost.' },
];

export const GEM_AMOUNTS: GemCardData[] = [
  { amount: '💎 1,000' },
  { amount: '💎 10,000' },
  { amount: '💎 50,000' },
  { amount: '💎 500,000' },
];

export const TIER_CHAIN: TierChainItem[] = [
  { label: 'Normal',  key: 'normal',  multiplier: null },
  { label: 'Golden',  key: 'golden',  multiplier: '50×' },
  { label: 'Rainbow', key: 'rainbow', multiplier: '50×' },
  { label: 'Glowing', key: 'glowing', multiplier: '50×' },
  { label: 'Shadow',  key: 'shadow',  multiplier: '50×' },
];
