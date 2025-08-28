"use client"

import { useState, useEffect } from 'react';

export interface ToolStats {
  id: string;
  name: string;
  category: string;
  totalUses: number;
  weeklyGrowth: number;
  trending: boolean;
  popular: boolean;
  averageRating: number;
  lastUsed: string;
}

export interface ToolStatsOverview {
  totalUses: number;
  averageGrowth: number;
  trendingTools: number;
  popularTools: number;
  activeTools: number;
}

export interface ToolStatsResponse {
  overview: ToolStatsOverview;
  tools: ToolStats[];
  lastUpdated: string;
}

export function useToolStats() {
  const [stats, setStats] = useState<ToolStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tools/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to fetch stats');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching tool stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const trackUsage = async (toolId: string, action: string = 'use') => {
    try {
      await fetch('/api/tools/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId, action }),
      });
    } catch (err) {
      console.error('Error tracking usage:', err);
    }
  };

  const getToolStats = (toolId: string): ToolStats | undefined => {
    return stats?.tools.find(tool => tool.id === toolId);
  };

  const formatUsageCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getTrendingTools = (): ToolStats[] => {
    return stats?.tools.filter(tool => tool.trending) || [];
  };

  const getPopularTools = (): ToolStats[] => {
    return stats?.tools.filter(tool => tool.popular) || [];
  };

  const getToolsByCategory = (category: string): ToolStats[] => {
    return stats?.tools.filter(tool => tool.category === category) || [];
  };

  return {
    stats,
    loading,
    error,
    fetchStats,
    trackUsage,
    getToolStats,
    formatUsageCount,
    getTrendingTools,
    getPopularTools,
    getToolsByCategory,
  };
}