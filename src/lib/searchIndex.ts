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
  // Phase 3 — Game Mechanics
  { title: 'Growth — size multiplier and cap', body: 'Growth multiplier scales size gain from food pellets and fish eaten. Higher rarity tier increases growth. Visual size cap 335580. Indefinite size number.', url: '/mechanics#growth', page: 'Mechanics', section: 'Growth' },
  { title: 'XP & Loot Bar', body: 'XP multiplier controls loot bar fill speed. Inversely proportional food needed. Double Loot pass gives 2 fish per fill. More multiplier means more nets faster.', url: '/mechanics#xp-loot', page: 'Mechanics', section: 'XP & Loot Bar' },
  { title: 'Speed Multiplier', body: 'Speed multiplier scales by rarity and tier. Faster fish survive longer catch food more reliably. Improves effective XP per minute by intercepting more food.', url: '/mechanics#speed', page: 'Mechanics', section: 'Speed' },
  { title: 'How Size Affects Speed', body: 'Swim speed decreases as size grows. At 1 billion size fish still moves at 54% starting speed. Speed stat multiplies on top of penalty. Visual model caps at 335580 but speed penalty continues.', url: '/mechanics#size-speed', page: 'Mechanics', section: 'Size vs Speed' },
  { title: 'Shop Upgrades — Game Passes mechanics', body: 'Double Loot 2 fish per fill. Fast XP +50% multiplier. Food Magnet 2x pickup radius. Double Growth 2x size gain. Lucky +100% luck. Pass numerical mechanics explained.', url: '/mechanics#passes', page: 'Mechanics', section: 'Shop Upgrades' },
  { title: 'Shop Boosts — consumable buffs', body: 'Boosts temporary growth speed luck XP buffs. Stacking same boost increases duration not bonus amount. Super XP 4 potions gives 2 hours not 1000%.', url: '/mechanics#boosts', page: 'Mechanics', section: 'Shop Boosts' },
  { title: 'Fishdex Collection Bonus', body: 'Every 10 unique fishdex entries grants permanent reward. +50% luck +15% growth 1200 gems per milestone. 300 total entries 60 species 5 tiers.', url: '/mechanics#fishdex-bonus', page: 'Mechanics', section: 'Fishdex Bonus' },
  { title: 'Luck — how it works and sources', body: 'Total luck base 100% plus treasure bonus fishdex bonus group bonus 50% lucky pass 100% boosts. Luck affects rarity only not tier. Luck formula sources stack.', url: '/mechanics#luck', page: 'Mechanics', section: 'Luck' },
  { title: 'Luck & Drop Chances — odds table', body: 'Luck drop chances rarity odds table. Common uncommon rare epic legendary mythic percentages. Legendary unlocks 1667% luck. Mythic unlocks 50000% luck. Luck cap 1000000%. Rarity caps uncommon 350% rare 2500% epic 30000%.', url: '/mechanics#luck-drops', page: 'Mechanics', section: 'Luck & Drop Chances' },
  { title: 'Luck Distribution Probability', body: 'All rarity chances add up to 100%. Higher luck fewer common fish more rare. Common starts 89% shrinks as luck climbs. Same number of fish different rarity distribution.', url: '/mechanics#luck-distribution', page: 'Mechanics', section: 'Luck Distribution' },
  { title: 'Treasures — mechanics and gem cost', body: 'Treasures raise luck permanently. 3 fish per treasure rolled with current luck plus 100000% bonus. Hold up to 5. Buy 1000 gems. Unlock timer 4 hours. Gem cost decreases over time.', url: '/mechanics#treasures', page: 'Mechanics', section: 'Treasures' },
  { title: 'Merging & Tiers — crafting table', body: 'Merge 50 copies to get next tier. Normal golden rainbow glowing shadow. Cumulative normal fish required golden 50 rainbow 2551 glowing 127551 shadow 6377551. Tier separate from rarity unaffected by luck.', url: '/mechanics#merging', page: 'Mechanics', section: 'Merging & Tiers' },
  { title: 'AFK Auto-Farm mechanics', body: 'Auto farm steers toward nearest food. Zigzag pattern never chases players. Stuck on wall toggle off steer manually or rejoin. Idle kick dodge every 20 minutes auto rejoin.', url: '/mechanics#afk', page: 'Mechanics', section: 'AFK Auto-Farm' },
  { title: 'Leaderboards — in-tank and global', body: 'In-tank leaderboard sorted by size shows rank username fish size. Rarest fish most kills fish collected boards visible from lobby. Top 17 entries displayed mobile pull up for more.', url: '/mechanics#leaderboards', page: 'Mechanics', section: 'Leaderboards' },
  // Phase 3 — Tips & Tricks
  { title: 'Getting Started Tips', body: 'New player tips goldfish end run switch fish passes gems luck auto farm chests open treasure.', url: '/tips#getting-started', page: 'Tips & Tricks', section: 'Getting Started' },
  { title: 'Luck Milestones', body: 'Luck most impactful stat legendary mythic fish locked behind luck thresholds rare drops breakpoints.', url: '/tips#luck', page: 'Tips & Tricks', section: 'Luck Milestones' },
  { title: 'General Tips', body: 'Auto farm 24/7 speed more important than XP rainbow betta fastest fish private tank passes revive revenge aggressive players switch tanks.', url: '/tips#general', page: 'Tips & Tricks', section: 'General Tips' },
  { title: 'Spotting Auto Farmers', body: 'Auto farm behavior zigzag pattern manual players AFK check sway dancing direction changes identify auto farmers.', url: '/tips#auto-farmers', page: 'Tips & Tricks', section: 'Spotting Auto Farmers' },
  { title: 'Pass Priority — recommended order', body: 'Pass priority order food magnet double loot fast XP double growth lucky robux investment value ranking.', url: '/tips#pass-priority', page: 'Tips & Tricks', section: 'Pass Priority' },
  { title: 'Leaderboards', body: 'Three leaderboards most kills fish collected rarest fish fishdex farming 24/7 competitive.', url: '/tips#leaderboards', page: 'Tips & Tricks', section: 'Leaderboards' },
];
