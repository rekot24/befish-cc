/** Data for the Tips & Tricks page sections. */

export type TipItem = {
  text: string;
  link?: { href: string; label: string };
};

export type PassPriorityItem = {
  rank: number;
  name: string;
  desc: string;
};

export type LeaderboardItem = {
  value: string;
  note: string;
};

export const GETTING_STARTED_TIPS: TipItem[] = [
  { text: "When starting, only use the Goldfish until you get a better fish. End Run once you get a few fish in your net and switch fish." },
  { text: "If you plan to play for any considerable amount of time, the passes are a must!" },
  { text: "You can get 50% luck for liking the game and joining the community. It won't always show up right away, but it's worth it." },
  { text: "Always use your gems to open chests. There is no other way to spend gems and every unlocked chest adds permanent Luck." },
  {
    text: "Use Auto Farm as much as possible. The more time spent farming, the more fish you'll catch.",
    link: { href: "https://youtu.be/Yr1XuQK7c2E", label: "▶ Watch the New Player Guide" },
  },
];

export const GENERAL_TIPS: TipItem[] = [
  { text: "Speed is more important than XP stat. Unless the XP stat is much higher, prioritize Speed for higher nets per minute." },
  { text: "General rule of thumb for best fish to use: choose your fastest fish in the top 2 rows of your FishDex." },
  {
    text: "It is possible to get the Rainbow Betta Fish by spending roughly 2 weeks of 24/7 auto farming with passes. This is one of the fastest fish you can get early on — ranked #45 fastest in the game.",
    link: { href: "https://youtu.be/VO5gkYLz238", label: "▶ Watch the Rainbow Betta in 13 days video" },
  },
  { text: "Getting eaten doesn't really matter and eating other fish doesn't really help you progress. Keeping Auto Farm on 24/7 is the key to collecting the rarest fish." },
  { text: "If you buy a private tank, you can farm in peace without interruptions. Note: auto rejoin puts you into a public tank, so a private tank requires an auto clicker to maintain." },
  { text: "If you haven't bought all the passes, Revive and Revenge are a complete waste of money. If you have money for these, spend it on passes instead." },
  { text: "Generally speaking, Revenge is not worth it. Revive is 1/5th the cost, which nullifies Revenge. Just switch to another tank." },
];

export const AUTO_FARMER_TIPS: TipItem[] = [
  { text: "Autos always prioritize food and never chase. They move in a bouncy zigzag pattern — manual players move in straight lines. An auto will never follow a single player into an area without food." },
  { text: "Even if an auto is bigger than you, you can chase it away. Turn toward it and move as if you're trying to eat it — it will divert." },
  { text: "Subtle AFK check: move your fish in several quick direction changes and watch the fish you suspect — not your own. Autos will react to nearby movement and can be redirected this way." },
  { text: "Easy AFK check: sway your fish side to side. Every auto in range will mirror the motion in unison. Manual players won't." },
  { text: "When multiple players are moving manually, autos crash into each other and their paths get erratic. To find the actual manual player: look for the one fish whose actions make logical sense as a chase. All autos will be pointed in the same direction; only one fish will be actively steering." },
];

export const PASS_PRIORITY: PassPriorityItem[] = [
  {
    rank: 1,
    name: "Food Magnet",
    desc: "Doubles your food collection radius. Hidden benefit: Auto Farm fish are less likely to eat you — your increased radius diverts them toward pellets instead of you.",
  },
  {
    rank: 2,
    name: "Double Loot",
    desc: "2 fish instead of 1 in your net each time you fill your XP bar. Doubles your fish collection rate.",
  },
  {
    rank: 3,
    name: "Fast XP",
    desc: "Fill your XP bar faster and get more fish in your net.",
  },
  {
    rank: 4,
    name: "Double Growth",
    desc: "Increases how fast you grow in the tank. Keeps you from getting eaten quicker and lets you outgrow aggressive fish.",
  },
  {
    rank: 5,
    name: "Lucky",
    desc: "Permanent +100% Luck. A minor boost, but every bit helps.",
  },
];

export const LEADERBOARDS: LeaderboardItem[] = [
  { value: "Most Kills",     note: "Ranks players by number of fish eaten." },
  { value: "Fish Collected", note: "Ranks players by total fish collected in FishDex." },
  { value: "Rarest Fish",    note: "Ranks players by rarest fish collected in FishDex." },
];

export const LEADERBOARD_TIPS: TipItem[] = [
  { text: "It will take some serious farming to reach the top of any leaderboard. It is possible, but you must be committed." },
  { text: "There are quite a few players who farm 24/7 — including 24rolla." },
];
