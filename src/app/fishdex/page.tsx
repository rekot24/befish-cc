import type { Metadata } from 'next';
import FishDex from '../../components/FishDex/FishDex';

export const metadata: Metadata = {
  title: 'Fish Dex — Be Fish Wiki',
  description: 'Browse all 60 Be Fish species across 5 tiers. Filter by rarity, sort by growth or speed, and compare fish side by side.',
};

export default function FishDexPage() {
  return <FishDex />;
}
