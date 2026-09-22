import type { Metadata } from 'next';
import HowToPlay from '../../components/HowToPlay/HowToPlay';

export const metadata: Metadata = {
  title: 'How to Play — Be Fish Wiki',
  description: 'Complete Be Fish guide — fish stats, boosts, passes, gems, and every UI element explained.',
};

export default function HowToPlayPage() {
  return <HowToPlay />;
}
