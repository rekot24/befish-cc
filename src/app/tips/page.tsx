import type { Metadata } from 'next';
import Tips from '../../components/Tips/Tips';

export const metadata: Metadata = {
  title: 'Tips & Tricks — Be Fish Wiki',
  description: 'Advanced strategies for collecting rare fish, growing fast, and climbing the leaderboard.',
};

export default function TipsPage() {
  return <Tips />;
}
