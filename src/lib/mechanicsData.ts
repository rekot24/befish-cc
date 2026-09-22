/** Data for the Game Mechanics page. */

export type PassMechanicData = {
  label: string;
  value: string;
  note: string;
};

export type FishdexRewardData = {
  label: string;
  value: string;
  note: string;
};

export type LuckThresholdData = {
  label: string;
  value: string;
  note: string;
};

export type TreasureStatData = {
  label: string;
  value: string;
  note: string;
};

export type MergingRowData = {
  tier: string;
  required: string;
};

export type AfkStatData = {
  label: string;
  value: string;
  note: string;
};

export type LuckDropRow = {
  luck: string;
  common: string;
  uncommon: string;
  rare: string;
  epic: string;
  legendary: string;
  mythic: string;
};

export const PASS_MECHANICS: PassMechanicData[] = [
  { label: 'Double Loot',   value: '2 fish / fill',    note: 'Loot bar drops 2 fish instead of 1 every time it fills. Doubles collection rate, no change to fill speed.' },
  { label: 'Fast XP',       value: '+50% XP',          note: 'Permanent +50% XP Multiplier, stacking with your equipped fish\'s own XP stat.' },
  { label: 'Food Magnet',   value: '2× pickup radius', note: 'Doubles the range at which food is pulled toward your fish.' },
  { label: 'Double Growth', value: '2× size gain',     note: 'Doubles the size gained per food/fish eaten, stacking multiplicatively with your fish\'s Growth stat.' },
  { label: 'Lucky',         value: '+100% Luck',       note: 'Permanent flat +100% added to your total Luck stat.' },
];

export const FISHDEX_REWARDS: FishdexRewardData[] = [
  { label: 'Bonus Luck',         value: '+50% Luck',   note: 'Permanent Luck increase, stacking with every other Luck source.' },
  { label: 'Growth Multiplier',  value: '+15% Growth', note: 'Permanent Growth bonus applied on every run.' },
  { label: 'Gems',               value: '1,200 gems',  note: 'A gem reward at each milestone, useful for opening Treasures early.' },
];

export const LUCK_THRESHOLDS: LuckThresholdData[] = [
  { label: 'Legendary unlocks', value: '1,667% Luck',  note: 'Hard-locked rarity — 0% chance below this threshold no matter how many rolls you make.' },
  { label: 'Mythic unlocks',    value: '50,000% Luck', note: 'The other hard-locked rarity. Nothing summons a Mythic fish below this Luck value.' },
  { label: 'Rarity caps',       value: 'Uncommon 350% · Rare 2,500%', note: 'Epic caps at 30,000%, Legendary at 833,333%. Mythic never truly caps, sitting at just 0.20% even at the 1,000,000% Luck ceiling.' },
];

export const TREASURE_STATS: TreasureStatData[] = [
  { label: 'Fish per Treasure', value: '3 fish',     note: 'Rolled at your current Luck + 100,000% bonus for that roll only.' },
  { label: 'Held at once',      value: 'Up to 5',    note: 'A 6th Treasure can\'t be collected or purchased until one of the current 5 is opened.' },
  { label: 'Buy directly',      value: '1,000 gems', note: 'Purchasable in the Shop, subject to the 5-held cap above.' },
  { label: 'Unlock timer',      value: '4 hours',    note: 'Free once the timer runs out, or pay Gems to open early. Cost decreases the longer you wait.' },
];

export const MERGING_ROWS: MergingRowData[] = [
  { tier: 'Golden',  required: '50' },
  { tier: 'Rainbow', required: '2,551' },
  { tier: 'Glowing', required: '127,551' },
  { tier: 'Shadow',  required: '6,377,551' },
];

export const AFK_STATS: AfkStatData[] = [
  { label: 'Stuck on a wall?', value: '3 ways out',    note: 'Toggle Auto Farm off and steer manually, rejoin the tank, or let yourself get eaten — larger fish can sometimes wiggle free on their own.' },
  { label: 'Idle-kick dodge',  value: '~every 20 min', note: 'The game automatically rejoins on a roughly 20-minute cycle to avoid Roblox\'s built-in AFK/idle kick.' },
];

export const LUCK_DROP_ROWS: LuckDropRow[] = [
  { luck: '100% (base)',      common: '88.95%', uncommon: '10%',  rare: '1%',   epic: '0.05%', legendary: '0% 🔒',       mythic: '0% 🔒' },
  { luck: '350%',             common: '60.82%', uncommon: '35%',  rare: '4%',   epic: '0.18%', legendary: '0% 🔒',       mythic: '0% 🔒' },
  { luck: '1,000%',           common: '54.5%',  uncommon: '35%',  rare: '10%',  epic: '0.5%',  legendary: '0% 🔒',       mythic: '0% 🔒' },
  { luck: '1,667%',           common: '47.16%', uncommon: '35%',  rare: '17%',  epic: '0.83%', legendary: '0.01%',       mythic: '0% 🔒' },
  { luck: '2,500%',           common: '38.99%', uncommon: '35%',  rare: '25%',  epic: '1%',    legendary: '0.02%',       mythic: '0% 🔒' },
  { luck: '5,000%',           common: '37.97%', uncommon: '35%',  rare: '25%',  epic: '2%',    legendary: '0.03%',       mythic: '0% 🔒' },
  { luck: '7,500%',           common: '35.96%', uncommon: '35%',  rare: '25%',  epic: '4%',    legendary: '0.04%',       mythic: '0% 🔒' },
  { luck: '10,000%',          common: '34.94%', uncommon: '35%',  rare: '25%',  epic: '5%',    legendary: '0.06%',       mythic: '0% 🔒' },
  { luck: '20,000%',          common: '29.88%', uncommon: '35%',  rare: '25%',  epic: '10%',   legendary: '0.12%',       mythic: '0% 🔒' },
  { luck: '30,000%',          common: '24.82%', uncommon: '35%',  rare: '25%',  epic: '15%',   legendary: '0.18%',       mythic: '0% 🔒' },
  { luck: '50,000%',          common: '24.69%', uncommon: '35%',  rare: '25%',  epic: '15%',   legendary: '0.3%',        mythic: '0.01%' },
  { luck: '100,000%',         common: '24.38%', uncommon: '35%',  rare: '25%',  epic: '15%',   legendary: '0.6%',        mythic: '0.02%' },
  { luck: '500,000%',         common: '21.9%',  uncommon: '35%',  rare: '25%',  epic: '15%',   legendary: '3%',          mythic: '0.10%' },
  { luck: '833,333%',         common: '19.83%', uncommon: '35%',  rare: '25%',  epic: '15%',   legendary: '5%',          mythic: '0.17%' },
  { luck: '1,000,000% (cap)', common: '19.8%',  uncommon: '35%',  rare: '25%',  epic: '15%',   legendary: '5%',          mythic: '0.20%' },
];
