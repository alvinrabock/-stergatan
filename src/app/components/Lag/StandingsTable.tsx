'use client';

import { fetchStandings } from '@/lib/Superadmin/fetchStandings';
import { StandingsTeamStats, StandingsTypes } from '@/types';
import Image from 'next/image';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import StandingsSkeleton from '../Skeletons/StadingsSkeleton';

// Configuration interfaces
interface StandingsConfig {
  showColumns?: {
    position?: boolean;
    team?: boolean;
    gamesPlayed?: boolean;
    wins?: boolean;
    draws?: boolean;
    losses?: boolean;
    goalsFor?: boolean;
    goalsAgainst?: boolean;
    goalDifference?: boolean;
    points?: boolean;
    form?: boolean;
  };
  formLength?: number;
  highlightTeams?: number[];
  sortBy?: 'position' | 'points' | 'goalDifference' | 'goalsFor';
  sortOrder?: 'asc' | 'desc';
  filterBy?: {
    minPosition?: number;
    maxPosition?: number;
    minPoints?: number;
    maxPoints?: number;
  };
  theme?: 'dark' | 'light' | 'custom';
  compact?: boolean;
  showTeamLogos?: boolean;
  customColors?: {
    highlightBg?: string;
    highlightBorder?: string;
    evenRowBg?: string;
    textColor?: string;
    headerBg?: string;
  };
  teamNameHandling?: {
    maxLength?: number;
    truncateWith?: string;
    showFullOnHover?: boolean;
    minWidth?: string;
    breakWords?: boolean;
  };
}

interface StandingsTableProps {
  leagueId?: string;
  homeTeamId?: number;
  awayTeamId?: number;
  config?: StandingsConfig;
  onTeamClick?: (team: StandingsTeamStats) => void;
  onError?: (error: string) => void;
  refreshInterval?: number;
  className?: string;
}

// Default configuration
const defaultConfig: Required<StandingsConfig> = {
  showColumns: {
    position: true,
    team: true,
    gamesPlayed: true,
    wins: true,
    draws: true,
    losses: true,
    goalsFor: true,
    goalsAgainst: true,
    goalDifference: true,
    points: true,
    form: true,
  },
  formLength: 5,
  highlightTeams: [],
  sortBy: 'position',
  sortOrder: 'asc',
  filterBy: {},
  theme: 'light',
  compact: false,
  showTeamLogos: true,
  customColors: {
    highlightBg: 'bg-red-50',
    highlightBorder: 'border-red-400',
    evenRowBg: 'even:bg-custom_dark_red/30',
    textColor: 'text-white',
    headerBg: 'bg-custom_dark_red',
  },
  teamNameHandling: {
    maxLength: 25,
    truncateWith: '...',
    showFullOnHover: true,
    minWidth: '120px',
    breakWords: false,
  },
};

// Type for the getStatValue function
type GetStatValueFunction = (stats: StandingsTeamStats['stats'], statName: string) => number;

// Column definitions for dynamic rendering
const columnDefinitions = [
  { key: 'position', label: '#', accessor: (team: StandingsTeamStats) => team.position },
  { key: 'team', label: 'Team', accessor: (team: StandingsTeamStats) => team.displayName },
  { key: 'gamesPlayed', label: 'GP', accessor: (team: StandingsTeamStats, getStatValue: GetStatValueFunction) => getStatValue(team.stats, 'gp') },
  { key: 'wins', label: 'W', accessor: (team: StandingsTeamStats, getStatValue: GetStatValueFunction) => getStatValue(team.stats, 'w') },
  { key: 'draws', label: 'D', accessor: (team: StandingsTeamStats, getStatValue: GetStatValueFunction) => getStatValue(team.stats, 't') },
  { key: 'losses', label: 'L', accessor: (team: StandingsTeamStats, getStatValue: GetStatValueFunction) => getStatValue(team.stats, 'l') },
  { key: 'goalsFor', label: 'GF', accessor: (team: StandingsTeamStats, getStatValue: GetStatValueFunction) => getStatValue(team.stats, 'gf') },
  { key: 'goalsAgainst', label: 'GA', accessor: (team: StandingsTeamStats, getStatValue: GetStatValueFunction) => getStatValue(team.stats, 'ga') },
  { key: 'goalDifference', label: 'GD', accessor: (team: StandingsTeamStats, getStatValue: GetStatValueFunction) => {
    const gf = getStatValue(team.stats, 'gf');
    const ga = getStatValue(team.stats, 'ga');
    return gf - ga;
  }},
  { key: 'points', label: 'Pts', accessor: (team: StandingsTeamStats, getStatValue: GetStatValueFunction) => getStatValue(team.stats, 'pts') },
  { key: 'form', label: 'Form', accessor: (team: StandingsTeamStats) => team.form },
];

const getStatValue = (stats: StandingsTeamStats['stats'], statName: string): number => {
  const stat = stats.find((s) => s.name === statName);
  return stat ? stat.value || 0 : 0;
};

const getFormColor = (result: string) => {
  switch (result) {
    case 'W': return 'bg-green-500';
    case 'D': return 'bg-yellow-400';
    case 'L': return 'bg-red-500';
    default: return 'bg-gray-300';
  }
};

const StandingsTable = ({
  leagueId,
  homeTeamId,
  awayTeamId,
  config = {},
  onTeamClick,
  onError,
  refreshInterval,
  className = ''
}: StandingsTableProps) => {
  const [teams, setTeams] = useState<StandingsTypes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: config.sortBy || 'position',
    direction: config.sortOrder || 'asc'
  });

  // Merge config with defaults
  const mergedConfig = useMemo(() => ({
    ...defaultConfig,
    ...config,
    showColumns: { ...defaultConfig.showColumns, ...config.showColumns },
    customColors: { ...defaultConfig.customColors, ...config.customColors },
    teamNameHandling: { ...defaultConfig.teamNameHandling, ...config.teamNameHandling },
  }), [config]);

  const loadStandings = useCallback(async () => {
    try {
      setLoading(true);

      // Extract league name and season from leagueId
      // leagueId format examples: "allsvenskan", "superettan", or ULID from SMC API
      let league = 'allsvenskan'; // default
      const season = '2025'; // default

      if (leagueId) {
        // Normalize league name to lowercase
        const normalizedLeagueId = leagueId.toLowerCase();

        // Check if it's a known league
        if (normalizedLeagueId.includes('allsvenskan')) {
          league = 'allsvenskan';
        } else if (normalizedLeagueId.includes('superettan')) {
          league = 'superettan';
        } else if (normalizedLeagueId.includes('ettan')) {
          league = 'ettan';
        }
        // If it's a ULID or unknown format, it will use the default (allsvenskan)
      }

      const data = await fetchStandings(league, season);
      const filtered = (data as StandingsTypes)
        .filter(
          (team): team is StandingsTeamStats =>
            !!team &&
            typeof team.id === 'string' &&
            typeof team.position === 'number' &&
            !!team.displayName &&
            Array.isArray(team.stats)
        );

      setTeams(filtered);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [leagueId, onError]);

  useEffect(() => {
    loadStandings();
    
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(loadStandings, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadStandings, refreshInterval]);

  // Dynamic sorting
  const sortedTeams = useMemo(() => {
    if (!teams) return [];

    let sorted = [...teams];

    // Apply filters
    if (mergedConfig.filterBy.minPosition || mergedConfig.filterBy.maxPosition) {
      sorted = sorted.filter(team => {
        const pos = team.position;
        return (!mergedConfig.filterBy.minPosition || pos >= mergedConfig.filterBy.minPosition) &&
               (!mergedConfig.filterBy.maxPosition || pos <= mergedConfig.filterBy.maxPosition);
      });
    }

    if (mergedConfig.filterBy.minPoints || mergedConfig.filterBy.maxPoints) {
      sorted = sorted.filter(team => {
        const pts = getStatValue(team.stats, 'pts');
        return (!mergedConfig.filterBy.minPoints || pts >= mergedConfig.filterBy.minPoints) &&
               (!mergedConfig.filterBy.maxPoints || pts <= mergedConfig.filterBy.maxPoints);
      });
    }

    // Apply sorting
    sorted.sort((a, b) => {
      let aValue: number, bValue: number;

      switch (sortConfig.key) {
        case 'position':
          aValue = a.position;
          bValue = b.position;
          break;
        case 'points':
          aValue = getStatValue(a.stats, 'pts');
          bValue = getStatValue(b.stats, 'pts');
          break;
        case 'goalDifference':
          aValue = getStatValue(a.stats, 'gf') - getStatValue(a.stats, 'ga');
          bValue = getStatValue(b.stats, 'gf') - getStatValue(b.stats, 'ga');
          break;
        case 'goalsFor':
          aValue = getStatValue(a.stats, 'gf');
          bValue = getStatValue(b.stats, 'gf');
          break;
        default:
          aValue = a.position;
          bValue = b.position;
      }

      if (sortConfig.direction === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return sorted;
  }, [teams, sortConfig, mergedConfig.filterBy]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleTeamClick = (team: StandingsTeamStats) => {
    onTeamClick?.(team);
  };

  const truncateTeamName = (name: string) => {
    if (!mergedConfig.teamNameHandling.maxLength || name.length <= mergedConfig.teamNameHandling.maxLength) {
      return name;
    }
    return name.substring(0, mergedConfig.teamNameHandling.maxLength) + mergedConfig.teamNameHandling.truncateWith;
  };

  // Get visible columns - Fixed dependency array
  const visibleColumns = useMemo(() => 
    columnDefinitions.filter(col => mergedConfig.showColumns[col.key as keyof typeof mergedConfig.showColumns])
  , [mergedConfig]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center p-6 text-white">
        <h5 className="text-2xl font-semibold">
          Tabell inte tillgänglig
        </h5>
        <p className="text-lg">
          {error.includes('404') || error.includes('API error: 404')
            ? 'Tabelldata finns inte tillgänglig för denna liga.'
            : `Ett fel uppstod: ${error}`}
        </p>
        <button
          onClick={loadStandings}
          className="mt-4 px-4 py-2 bg-custom_red text-white rounded hover:bg-custom_dark_red transition-colors"
        >
          Försök igen
        </button>
      </div>
    );
  }

  if (loading) {
    return <StandingsSkeleton />;
  }

  const textSizeClass = mergedConfig.compact ? 'text-xs' : 'text-xs sm:text-sm';
  const paddingClass = mergedConfig.compact ? 'px-1 py-1' : 'px-2 sm:px-4 py-2';

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <table className={`min-w-full ${textSizeClass} text-left border-collapse`}>
          <thead className={`${mergedConfig.customColors.textColor} sticky top-0 z-10 border-b ${mergedConfig.customColors.headerBg}`}>
            <tr>
              {visibleColumns.map(column => (
                <th 
                  key={column.key}
                  className={`${paddingClass} cursor-pointer transition-colors whitespace-nowrap ${
                    sortConfig.key === column.key ? 'bg-custom_dark_red/80' : ''
                  } ${column.key === 'team' ? 'min-w-[160px]' : 'w-auto'}`}
                  onClick={() => column.key !== 'team' && column.key !== 'form' && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortConfig.key === column.key && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team) => {
              const stats = team.stats ?? [];
              const gf = getStatValue(stats, 'gf');
              const ga = getStatValue(stats, 'ga');
              const gd = gf - ga;

              const isHighlighted = 
                team.teamId === Number(homeTeamId) ||
                team.teamId === Number(awayTeamId) ||
                mergedConfig.highlightTeams.includes(team.teamId);

              return (
                <tr
                  key={team.id}
                  className={`${mergedConfig.customColors.evenRowBg} odd:bg-transparent transition-colors cursor-pointer
                    ${isHighlighted ? `${mergedConfig.customColors.highlightBg} border-l-4 ${mergedConfig.customColors.highlightBorder}` : ''}`}
                  onClick={() => handleTeamClick(team)}
                >
                  {visibleColumns.map(column => {
                    const value = column.accessor(team, getStatValue);
                    
                    return (
                      <td key={column.key} className={`${paddingClass} ${mergedConfig.customColors.textColor} whitespace-nowrap`}>
                        {column.key === 'position' && (
                          <span className="font-semibold text-white">
                            {team.position}
                          </span>
                        )}
                        
                        {column.key === 'team' && (
                          <div 
                            className="flex items-center gap-2 min-w-0"
                            title={mergedConfig.teamNameHandling.showFullOnHover ? team.displayName : undefined}
                          >
                            {mergedConfig.showTeamLogos && (
                              <Image
                                src={team.logoImageUrl}
                                alt={team.displayName}
                                width={30}
                                height={30}
                                className={`object-contain flex-shrink-0 ${mergedConfig.compact ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6'}`}
                              />
                            )}
                            <span className="font-medium text-white truncate flex-1">
                              {mergedConfig.teamNameHandling.maxLength ? truncateTeamName(team.displayName) : team.displayName}
                            </span>
                          </div>
                        )}
                        
                        {column.key === 'goalDifference' && (
                          <span className="font-semibold text-white">
                            {gd > 0 ? '+' : ''}{gd}
                          </span>
                        )}
                        
                        {column.key === 'points' && (
                          <span className="font-bold text-white">
                            {typeof value === 'number' || typeof value === 'string' ? value : '-'}
                          </span>
                        )}
                        
                        {column.key === 'form' && (
                          <div className="flex space-x-0.5 sm:space-x-1">
                            {(Array.isArray(team.form) ? [...team.form.slice(0, mergedConfig.formLength)].reverse() : []).map((match, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center justify-center ${
                                  mergedConfig.compact ? 'w-3 h-3 text-[8px]' : 'w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs'
                                } rounded-full text-white ${getFormColor(match.matchResult)} flex-shrink-0`}
                                title={`${match.homeTeamAbbrv} ${match.homeTeamScore} - ${match.visitingTeamScore} ${match.visitingTeamAbbrv}`}
                              >
                                {match.matchResult}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {!['position', 'team', 'goalDifference', 'points', 'form'].includes(column.key) && (
                          <span className="text-white">
                            {typeof value === 'number' || typeof value === 'string' ? value : '-'}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Summary statistics */}
      <div className="mt-4 text-xs text-gray-400 flex gap-4">
        <span>Senast uppdaterad: {new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
        {refreshInterval && <span>Uppdateras automatiskt: {refreshInterval / 1000}s</span>}
      </div>
    </div>
  );
};

export default StandingsTable;