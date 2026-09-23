import type { Metadata } from 'next';
import FishTracker from '../../components/FishTracker/FishTracker';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Fish Tracker — Be Fish Wiki',
  description: 'Track your Be Fish catches, watch tier-craft progress toward the next tier, and get time-to-next-catch predictions based on your own catch history.',
};

export default function FishTrackerPage() {
  return (
    <ErrorBoundary>
      <FishTracker />
    </ErrorBoundary>
  );
}
