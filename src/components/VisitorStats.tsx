import React from 'react';
import type { StatsPayload } from '../services/analyticsService';
import './VisitorStats.css';

interface VisitorStatsProps {
  stats: StatsPayload;
  ready: boolean;
  configEnabled: boolean;
}

function formatNumber(n: number): string {
  if (n === 0) return '—';
  return n.toLocaleString('en-IN');
}

interface StatItemProps {
  label: string;
  value: string;
  accent?: boolean;
  live?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, accent, live }) => (
  <div className={`vs-item${accent ? ' vs-item--accent' : ''}`}>
    <div className="vs-value" aria-live={live ? 'polite' : undefined}>
      {live && value !== '—' && <span className="vs-live-dot" aria-hidden="true" />}
      {value}
    </div>
    <div className="vs-label">{label}</div>
  </div>
);

export const VisitorStats: React.FC<VisitorStatsProps> = ({ stats, ready, configEnabled }) => {
  // If analytics is not configured, render nothing
  if (!configEnabled) return null;

  const showSkeleton = !ready;

  return (
    <section className="visitor-stats" aria-label="Visitor statistics">
      <div className="vs-rule" aria-hidden="true" />
      <div className="vs-inner">
        <p className="vs-eyebrow" aria-hidden="true">
          <span className="vs-eyebrow-dot" />
          Portfolio Activity
        </p>
        <div className="vs-grid" role="list">
          <div role="listitem">
            <StatItem
              label="Live Now"
              value={showSkeleton ? '…' : formatNumber(stats.liveVisitors)}
              accent
              live
            />
          </div>
          <div role="listitem">
            <StatItem
              label="Total Visits"
              value={showSkeleton ? '…' : formatNumber(stats.totalVisits)}
            />
          </div>
          <div role="listitem">
            <StatItem
              label="Unique Visitors"
              value={showSkeleton ? '…' : formatNumber(stats.uniqueVisitors)}
            />
          </div>
          <div role="listitem">
            <StatItem
              label="Today"
              value={showSkeleton ? '…' : formatNumber(stats.todayVisits)}
            />
          </div>
        </div>
        <p className="vs-disclaimer">
          "Live Now" counts active sessions within the last 2 minutes and is not an exact headcount.
          Anonymous sessions are included in total and today counts.
        </p>
      </div>
    </section>
  );
};
