'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { MatchCardData } from '@/types';
import { SeasonGroup } from '@/lib/leagueCache';
import { getMatches } from '@/lib/fetchMatches';

import MatchCard from '../components/Match/MatchCard';
import { MatchCardSkeleton } from '../components/Skeletons/MatchCardSkeleton';

import { Button } from '../components/ui/Button';
import MatchFilter from './MatchFilters';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../../components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import CalenderIcon from '../components/Icons/CalenderIcon';
import { MatchCalendar } from './MatchCalendar';
import { SortIcon } from '../components/Icons/SortIcon';

interface MatchFiltersProps {
    seasons: SeasonGroup[];
}

const OSTERS_TEAM_ID = '01JVVHS4ESCV6K0GYXXB0K1NHS';

const MatchArchive: React.FC<MatchFiltersProps> = ({ seasons }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isPlayedFilter = searchParams.get('status') === 'Over';
    const locationFilter = searchParams.get('location');
    const leagueFilter = searchParams.get('league');
    const dateFromParam = searchParams.get('dateFrom');
    const dateToParam = searchParams.get('dateTo');
    const seasonFilter = searchParams.get('season');

    const [matches, setMatches] = useState<MatchCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(() => {
        if (dateFromParam && dateToParam) {
            return {
                from: parseISO(dateFromParam),
                to: parseISO(dateToParam),
            };
        }
        return undefined;
    });

    // Season options directly from cache
    const seasonOptions = seasons.map(s => ({
        seasonYear: s.seasonYear,
        tournaments: s.tournaments
    }));

    const defaultSeason = seasons[0]?.seasonYear;
    const selectedSeason = seasonFilter || defaultSeason;

    // League options for selected season
    const leagueOptions = selectedSeason
        ? seasons
            .find(s => s.seasonYear === selectedSeason)
            ?.tournaments.map(t => ({
                id: String(t.leagueId),
                name: t.LeagueName,
            })) || []
        : [];

    // OPTIMIZATION 1: Only fetch specific league when filtered
    const leagueIdsToFetch = useMemo(() => {
        const selectedSeasonData = seasons.find(s => s.seasonYear === selectedSeason);

        console.log('🔍 Debug:', {
            selectedSeason,
            hasSeasonData: !!selectedSeasonData,
            tournamentsCount: selectedSeasonData?.tournaments.length,
            leagueFilter
        });

        // If a specific league is filtered, only fetch that league
        if (leagueFilter) {
            console.log(`🎯 Fetching specific league: ${leagueFilter}`);
            return [leagueFilter];
        }

        // Fetch all leagues for the selected season
        const allLeagueIds = selectedSeasonData?.tournaments.map(t => t.leagueId) || [];
        console.log(`📅 Fetching all ${allLeagueIds.length} leagues for season ${selectedSeason}`);
        return allLeagueIds;
    }, [seasons, selectedSeason, leagueFilter]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        const fetchMatches = async () => {
            setLoading(true);

            try {
                // Fetch matches using optimized league IDs and Östers IF team filter
                const allMatches = await getMatches(
                    leagueIdsToFetch,
                    OSTERS_TEAM_ID, // Pass Östers IF team ID to API
                    undefined, // dateFrom
                    undefined, // dateTo
                    locationFilter as "home" | "away" | undefined // location filter
                );

                // Filter matches client-side (minimal filtering now since API does most of it)
                const filtered = allMatches.filter(match => {
                    // Parse kickoff as Swedish local time by replacing space with 'T'
                    const kickoffStr = match.kickoff ?? '';
                    const matchDate = new Date(kickoffStr.replace(' ', 'T'));

                    console.log('🔍 Filtering match:', {
                        matchId: match.matchId,
                        kickoffStr,
                        matchDate: matchDate.toISOString(),
                        homeTeam: match.homeTeam,
                        awayTeam: match.awayTeam,
                    });

                    // League filtering is already handled by leagueIdsToFetch, but double-check
                    if (leagueFilter && String(match.leagueId) !== leagueFilter) {
                        console.log('❌ Filtered out by league filter');
                        return false;
                    }

                    // Filter by date range from URL params
                    if (dateFromParam) {
                        const fromDate = new Date(dateFromParam);
                        fromDate.setHours(0, 0, 0, 0);
                        console.log('📅 URL dateFrom check:', {
                            fromDate: fromDate.toISOString(),
                            matchDate: matchDate.toISOString(),
                            passes: matchDate >= fromDate
                        });
                        if (matchDate < fromDate) {
                            console.log('❌ Filtered out by dateFrom URL param');
                            return false;
                        }
                    }
                    if (dateToParam) {
                        const toDate = new Date(dateToParam);
                        toDate.setHours(23, 59, 59, 999);
                        console.log('📅 URL dateTo check:', {
                            toDate: toDate.toISOString(),
                            matchDate: matchDate.toISOString(),
                            passes: matchDate <= toDate
                        });
                        if (matchDate > toDate) {
                            console.log('❌ Filtered out by dateTo URL param');
                            return false;
                        }
                    }

                    // Filter by calendar date range
                    if (selectedRange?.from && selectedRange?.to) {
                        const rangeFrom = new Date(selectedRange.from);
                        rangeFrom.setHours(0, 0, 0, 0);
                        const rangeTo = new Date(selectedRange.to);
                        rangeTo.setHours(23, 59, 59, 999);
                        console.log('📅 Calendar range check:', {
                            rangeFrom: rangeFrom.toISOString(),
                            rangeTo: rangeTo.toISOString(),
                            matchDate: matchDate.toISOString(),
                            passes: matchDate >= rangeFrom && matchDate <= rangeTo
                        });
                        if (matchDate < rangeFrom || matchDate > rangeTo) {
                            console.log('❌ Filtered out by calendar date range');
                            return false;
                        }
                    }

                    console.log('✅ Match passed all filters');
                    return true;
                });

                let sortedMatches: MatchCardData[] = [];

                if (isPlayedFilter) {
                    sortedMatches = filtered
                        .filter(match => match.status === 'Over')
                        .sort((a, b) => new Date(b.kickoff ?? '').getTime() - new Date(a.kickoff ?? '').getTime());
                } else {
                    const upcoming = filtered
                        .filter(
                            match =>
                                match.status !== 'Over' &&
                                (new Date(match.kickoff ?? '').getTime() > Date.now() || match.status === 'In progress')
                        )
                        .sort((a, b) => new Date(a.kickoff ?? '').getTime() - new Date(b.kickoff ?? '').getTime());

                    const played = filtered
                        .filter(match => match.status === 'Over')
                        .sort((a, b) => new Date(b.kickoff ?? '').getTime() - new Date(a.kickoff ?? '').getTime());

                    sortedMatches = [...upcoming, ...played];
                }

                setMatches(sortedMatches);

                // OPTIMIZATION 2: Stop polling if no live matches
                const hasLiveMatch = sortedMatches.some(match => match.status === 'In progress');
                if (!hasLiveMatch && intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }

                return hasLiveMatch;

            } catch (error) {
                console.error('Error fetching matches:', error);
                setMatches([]);
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                return false;
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchMatches().then(hasLiveMatch => {
            // OPTIMIZATION 2: Only set up polling if there are live matches
            if (hasLiveMatch) {
                intervalId = setInterval(() => {
                    fetchMatches();
                }, 60000);
            }
        });

        // Cleanup interval on unmount or dependency change
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [seasons, isPlayedFilter, locationFilter, leagueFilter, leagueIdsToFetch, selectedRange, dateFromParam, dateToParam, selectedSeason]);


    const updateQueryParam = (key: string, value?: string) => {
        const current = new URLSearchParams(searchParams.toString());
        if (value === undefined || current.get(key) === value) {
            current.delete(key);
        } else {
            current.set(key, value);
        }
        router.push(`/matcher?${current.toString()}`);
    };

    const handlePlayedFilterClick = () => updateQueryParam('status', 'Over');
    const handleLocationFilterClick = (value: 'home' | 'away') => updateQueryParam('location', value);
    const handleLeagueChange = (value: string) => updateQueryParam('league', value === 'clear' ? undefined : value);
    const handleSeasonChange = (value: string) => {
        const current = new URLSearchParams(searchParams.toString());
        if (value) current.set('season', value);
        else current.delete('season');
        current.delete('league');
        router.push(`/matcher?${current.toString()}`);
    };

    const handleDateChange = (range: DateRange | undefined) => {
        setSelectedRange(range);
        const current = new URLSearchParams(searchParams.toString());

        if (range?.from) current.set('dateFrom', format(range.from, 'yyyy-MM-dd'));
        else current.delete('dateFrom');

        if (range?.to) current.set('dateTo', format(range.to, 'yyyy-MM-dd'));
        else current.delete('dateTo');

        router.push(`/matcher?${current.toString()}`);
        if (range?.from && range?.to) setCalendarOpen(false);
    };

    const handleClearFilters = () => {
        router.push('/matcher');
        setSelectedRange(undefined);
    };

    const hasAnyFilter = searchParams.toString().length > 0;

    const getHeadingText = () => {
        if (isPlayedFilter) return 'Spelade matcher';
        if (leagueFilter) {
            const league = leagueOptions.find(league => league.id === leagueFilter);
            return league ? league.name : leagueFilter;
        }
        if (locationFilter) return `${locationFilter === 'home' ? 'Hemma' : 'Borta'}matcher`;
        return 'Kommande matcher';
    };

    // OPTIMIZATION 3: Memoize league name lookups to avoid recalculating on every render
    const leagueNameMap = useMemo(() => {
        const map = new Map<string, string>();
        seasons.forEach(s => {
            s.tournaments.forEach(t => {
                map.set(String(t.leagueId), t.LeagueName);
            });
        });
        return map;
    }, [seasons]);

    console.log(matches)

    return (
        <div className="space-y-6 text-white">
            <h1 className="text-6xl font-bold mb-6">{getHeadingText()}</h1>
            <div className='flex flex-wrap xl:flex-nowrap gap-4 xl:gap-10 flex-row items-center justify-between  border-t pt-6 mt-6 border-slate-400 pt-4'>
                <div className='grid grid-cols-2 xl:flex w-full gap-4 justify-between'>
                    <div>
                        <Button
                            variant={isPlayedFilter ? 'white' : 'outline'}
                            onClick={handlePlayedFilterClick}
                            className={`text-xs sm:text-sm w-full xl:w-fit ${isPlayedFilter ? '' : 'text-white'}`}
                        >
                            Visa spelade matcher
                        </Button>
                    </div>

                    {/* === Desktop static sidebar === */}
                    <div className="hidden xl:block">
                        <MatchFilter
                            isPlayedFilter={isPlayedFilter}
                            locationFilter={locationFilter}
                            leagueFilter={leagueFilter}
                            selectedSeason={selectedSeason}
                            seasonOptions={seasonOptions}
                            leagueOptions={leagueOptions}
                            calendarOpen={calendarOpen}
                            selectedRange={selectedRange}
                            setCalendarOpen={setCalendarOpen}
                            handlePlayedFilterClick={handlePlayedFilterClick}
                            handleLocationFilterClick={handleLocationFilterClick}
                            handleLeagueChange={handleLeagueChange}
                            handleSeasonChange={handleSeasonChange}
                            handleDateChange={handleDateChange}
                        />
                    </div>

                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`p-2 text-xs sm:text-sm flex gap-2 items-center ${calendarOpen ? "!bg-custom_white bg-white/20   " : ""
                                    }`}
                            >
                                <CalenderIcon className=" hidden xs:block h-2 w-2 sm:h-4 sm:w-4" />
                                {selectedRange?.from && selectedRange?.to
                                    ? `${format(selectedRange.from, 'yyyy-MM-dd')} – ${format(selectedRange.to, 'yyyy-MM-dd')}`
                                    : 'Välj datum'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto bg-custom_dark_dark_red border-slate-400 text-white"
                            side="bottom"
                            align="start"
                            avoidCollisions
                            sideOffset={8} // adds space from the trigger
                        >
                            <MatchCalendar
                                mode="range"
                                defaultMonth={selectedRange?.from}
                                selected={selectedRange}
                                onSelect={handleDateChange}
                                numberOfMonths={2}
                                className="text-white"
                                matches={matches}
                            />
                        </PopoverContent>

                    </Popover>
                </div>

                {/* === Mobile filter trigger with Drawer === */}
                <div className="w-full xl:hidden">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className='w-full flex flex-row items-center'>
                                <SortIcon className='w-4 h-4' />
                                Fler filter
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="p-4 space-y-4 bg-custom_dark_dark_red border-none">
                            <DrawerHeader className='p-0'>
                                <DrawerTitle className="text-white">Fler filter</DrawerTitle>
                            </DrawerHeader>

                            <MatchFilter
                                isPlayedFilter={isPlayedFilter}
                                locationFilter={locationFilter}
                                leagueFilter={leagueFilter}
                                selectedSeason={selectedSeason}
                                seasonOptions={seasonOptions}
                                leagueOptions={leagueOptions}
                                calendarOpen={calendarOpen}
                                selectedRange={selectedRange}
                                setCalendarOpen={setCalendarOpen}
                                handlePlayedFilterClick={handlePlayedFilterClick}
                                handleLocationFilterClick={handleLocationFilterClick}
                                handleLeagueChange={handleLeagueChange}
                                handleSeasonChange={handleSeasonChange}
                                handleDateChange={handleDateChange}

                            />

                            <DrawerFooter className='p-0'>
                                <DrawerClose>
                                    <Button variant="default" className='w-full'>Visa resultat</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>

            <div className="mt-4">
                {hasAnyFilter && (
                    <Button
                        variant="ghost"
                        onClick={handleClearFilters}
                        className="text-sm underline text-white flex items-center gap-1 mb-4"
                    >
                        <span aria-hidden="true" className="font-bold">×</span> Rensa filter
                    </Button>

                )}

                {loading ? (
                    <ul className="space-y-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <MatchCardSkeleton key={index} />
                        ))}
                    </ul>
                ) : matches.length > 0 ? (
                    <ul className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-1  gap-6">
                        {matches.map(match => {
                            // Use memoized league name lookup (O(1) instead of O(n))
                            const leagueName = leagueNameMap.get(String(match.leagueId));

                            return (
                                <li key={match.matchId}>
                                    <MatchCard match={match} colorTheme="red" leagueName={leagueName} />
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Inga matcher hittades.</p>
                )}
            </div>
        </div>
    );
};

export default MatchArchive;
