export type SearchEntry = {
  title: string;       // section or topic title
  body: string;        // searchable text excerpt
  url: string;         // full path with anchor e.g. /mechanics#growth-formula
  page: string;        // display name e.g. "Mechanics"
  section: string;     // subsection label e.g. "Growth Formula"
};

/**
 * Site-wide search index.
 * Entries are added here as each content page is built (Phase 3).
 * Body text should be a plain-language summary of the section content —
 * enough for Fuse.js to match natural language queries.
 */
export const searchIndex: SearchEntry[] = [
  // Phase 3 — How to Play
  { title: 'The Basics', body: 'Be Fish idle fish collection game Roblox. Control a fish eat food pellets grow collect nets. 60 species 5 tiers 300 collectibles. Crafting Normal Golden Rainbow Glowing Shadow tiers.', url: '/how-to-play#basics', page: 'How to Play', section: 'The Basics' },
  { title: 'Fish Stats — Growth, Speed, XP, Rarity', body: 'Fish stats Growth Speed XP Multiplier Rarity. Growth how much fish grows eating food. Speed movement around tank. XP multiplier rate of collecting nets. Rarity 1 in chance odds.', url: '/how-to-play#fish-stats', page: 'How to Play', section: 'Fish Stats' },
  { title: 'In-Tank Game Screen Guide', body: 'Game screen UI elements. Gem counter top center. Leaderboard top right. Fishdex top left. Shop passes gems treasures. Luck bottom left. XP bar bottom center. Switch fish. End run. Boosts. Auto Farm. Net counter.', url: '/how-to-play#screen-guide', page: 'How to Play', section: 'Game Screen Guide' },
  { title: 'Boosts', body: 'Boosts temporary power-ups Robux. Luck boost 10 min +100 luck. Growth boost 5 min +100 growth. XP boost 10 min. Speed boost 5 min. Super Luck 30 min +1000 luck. Super XP 30 min +250 XP. Stack with passes and fishdex bonuses.', url: '/how-to-play#boosts', page: 'How to Play', section: 'Boosts' },
  { title: 'Passes', body: 'Passes permanent upgrades Robux one-time purchase. Lucky +100 luck. Fast XP +50 XP. Double Loot 2 nets per fill. Food Magnet collection radius. Double Growth 2x size. Best pass Double Loot doubles collection rate.', url: '/how-to-play#passes', page: 'How to Play', section: 'Passes' },
  { title: 'Gems', body: 'Gems premium currency Robux. Open treasure chests skip timer. Increase luck permanently. 1000 10000 50000 500000 gem packages. 14500 chests for 50000 luck. Mythic fish at 50000 luck.', url: '/how-to-play#gems', page: 'How to Play', section: 'Gems' },
  // Phase 3 — Game Mechanics entries go here
  // Phase 3 — Tips & Tricks
  { title: 'Getting Started Tips', body: 'New player tips goldfish end run switch fish passes gems luck auto farm chests open treasure.', url: '/tips#getting-started', page: 'Tips & Tricks', section: 'Getting Started' },
  { title: 'Luck Milestones', body: 'Luck most impactful stat legendary mythic fish locked behind luck thresholds rare drops breakpoints.', url: '/tips#luck', page: 'Tips & Tricks', section: 'Luck Milestones' },
  { title: 'General Tips', body: 'Auto farm 24/7 speed more important than XP rainbow betta fastest fish private tank passes revive revenge aggressive players switch tanks.', url: '/tips#general', page: 'Tips & Tricks', section: 'General Tips' },
  { title: 'Spotting Auto Farmers', body: 'Auto farm behavior zigzag pattern manual players AFK check sway dancing direction changes identify auto farmers.', url: '/tips#auto-farmers', page: 'Tips & Tricks', section: 'Spotting Auto Farmers' },
  { title: 'Pass Priority — recommended order', body: 'Pass priority order food magnet double loot fast XP double growth lucky robux investment value ranking.', url: '/tips#pass-priority', page: 'Tips & Tricks', section: 'Pass Priority' },
  { title: 'Leaderboards', body: 'Three leaderboards most kills fish collected rarest fish fishdex farming 24/7 competitive.', url: '/tips#leaderboards', page: 'Tips & Tricks', section: 'Leaderboards' },
];
