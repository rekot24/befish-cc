import type { Metadata } from 'next';
import Mechanics from '../../components/Mechanics/Mechanics';

export const metadata: Metadata = {
  title: 'Game Mechanics — Be Fish Wiki',
  description: 'How growth, speed, luck, and loot actually work — formulas, odds tables, merging math, and every mechanic explained.',
};

export default function MechanicsPage() {
  return <Mechanics />;
}
