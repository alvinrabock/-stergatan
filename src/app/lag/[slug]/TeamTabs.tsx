'use client';

import { useCallback, lazy, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import NyheterItem from "@/app/components/Nyheter/nyheterItem";
import MiniNyheterItem from "@/app/components/Nyheter/miniNyheterItem";
import { PlayerCardCMS } from "@/app/components/Player/PlayerCardCMS";
import { StaffSection } from "@/app/components/Player/StaffSection";
import type { Post, TruppPlayers, SuperAdminTeamStats } from "@/types";
import { Newspaper, Clock, Users, Calendar, BarChart3, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import type { FrontspaceSpelare } from "@/lib/frontspace/adapters/spelare";
import type { FrontspaceStab } from "@/lib/frontspace/adapters/stab";

// Lazy load heavy components for better performance
const StandingsTable = lazy(() => import('@/app/components/Lag/StandingsTable'));
const KommandeMatcher = lazy(() => import('@/app/components/KommandeMatcher'));
const LagSenastSpeladeMatcher = lazy(() => import('@/app/components/LagSenastSpeladeMatcher'));
const FunStats = lazy(() => import('@/app/components/Player/FunStats'));
const TeamStatsOverview = lazy(() => import('@/app/components/Lag/TeamStatsOverview'));

const TabContentSkeleton = () => (
    <div className="animate-pulse p-8">
        <div className="h-8 bg-gray-300/20 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300/20 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300/20 rounded w-5/6"></div>
        </div>
    </div>
);

// Formatted training session type (after processing in page.tsx)
interface FormattedTrainingSession {
    _entryId?: string;
    _entryNumber?: number;
    datum: string;
    startid: string;
    sluttid: string;
    plats?: string;
    notering?: string;
    formattedDag: string;
    formattedStartTid: string;
    formattedSlutTid: string;
}

interface TeamTabsProps {
    teamTitle: string;
    teamNews: Post[];
    hasTraining: boolean;
    upcomingTraining: FormattedTrainingSession[];
    currentTab: string;
    slug: string;
    // New props for SMC/Fogis integration
    isSEFTeam?: boolean; // Team has fetchfromsefapi=true
    players?: FrontspaceSpelare[];
    staff?: FrontspaceStab[];
    smcTeamId?: string;
    fogisTeamId?: string;
    fogisTeamSlug?: string;
    // Stats data from SMC API
    squad?: TruppPlayers[];
    teamStats?: SuperAdminTeamStats | null;
}

// Tab trigger class for consistency
const tabTriggerClass = `
    transition-all duration-200 border-b-2 border-transparent
    hover:bg-custom_red/20 rounded-xl
    text-xs sm:text-[15px] text-center whitespace-nowrap px-4 py-2
    shadow-none text-white font-bold
    data-[state=active]:text-white
    data-[state=active]:border-white
    data-[state=active]:bg-transparent
    data-[state=active]:shadow-none
    data-[state=active]:rounded-none
    flex items-center justify-center gap-2
`;

export default function TeamTabs({
    teamTitle,
    teamNews,
    hasTraining,
    upcomingTraining,
    currentTab,
    slug,
    isSEFTeam = false,
    players = [],
    staff = [],
    smcTeamId,
    squad = [],
    teamStats,
}: TeamTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const hasPlayers = players.length > 0;
    const hasStaff = staff.length > 0;
    const hasTrupp = hasPlayers || hasStaff;

    const handleTabChange = useCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === 'nyheter') {
            params.delete('tab');
        } else {
            params.set('tab', value);
        }

        const newUrl = params.toString()
            ? `/lag/${slug}?${params.toString()}`
            : `/lag/${slug}`;

        router.push(newUrl, { scroll: false });
    }, [router, searchParams, slug]);

    // Position order for sorting players (case-insensitive matching)
    const getPositionOrder = (position: string): number => {
        const pos = position.toLowerCase();
        if (pos.includes('målvakt') || pos.includes('keeper') || pos === 'mv') return 1;
        if (pos.includes('försvarare') || pos.includes('back') || pos === 'b') return 2;
        if (pos.includes('mittfältare') || pos.includes('mitt') || pos === 'mf') return 3;
        if (pos.includes('anfallare') || pos.includes('forward') || pos.includes('anfall') || pos === 'a') return 4;
        return 99; // Unknown positions go to the end
    };

    // Get pluralized display name for position titles
    const getPositionDisplayName = (position: string): string => {
        const pos = position.toLowerCase();
        if (pos.includes('målvakt') || pos.includes('keeper') || pos === 'mv') return 'Målvakter';
        if (pos.includes('försvarare') || pos.includes('back') || pos === 'b') return 'Backar';
        if (pos.includes('mittfältare') || pos.includes('mitt') || pos === 'mf') return 'Mittfältare';
        if (pos.includes('anfallare') || pos.includes('forward') || pos.includes('anfall') || pos === 'a') return 'Anfallare';
        return position; // Return original if unknown
    };

    // Transform FrontspaceSpelare to PlayerCardCMS format
    const transformToPlayerCard = (player: FrontspaceSpelare) => ({
        title: player.title,
        image: player.content.bild || null,
        number: player.content.trojnummer || null,
        position: player.content.position || null,
        land: player.content.land || null,
        utlanad: player.content.utlanad === 'true',
        kommentar: player.content.kommentar || null,
    });

    // Sort players by position and memoize
    const sortedPlayers = useMemo(() => {
        return [...players].sort((a, b) => {
            const posA = getPositionOrder(a.content.position || '');
            const posB = getPositionOrder(b.content.position || '');
            if (posA !== posB) return posA - posB;
            // Then by jersey number
            const numA = parseInt(a.content.trojnummer || '999', 10);
            const numB = parseInt(b.content.trojnummer || '999', 10);
            return numA - numB;
        });
    }, [players]);

    // Group players by position
    const playersByPosition = useMemo(() => {
        return sortedPlayers.reduce((acc, player) => {
            const position = player.content.position || 'Övriga';
            if (!acc[position]) acc[position] = [];
            acc[position].push(player);
            return acc;
        }, {} as Record<string, FrontspaceSpelare[]>);
    }, [sortedPlayers]);

    return (
        <div className="bg-custom_dark_dark_red">
            <Tabs value={currentTab || 'nyheter'} defaultValue="nyheter" onValueChange={handleTabChange} className="w-full z-10 relative">
                <MaxWidthWrapper>
                    <TabsList className="w-full justify-start px-2 py-8 sm:p-8 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent bg-custom_dark_red gap-2">
                        <TabsTrigger value="nyheter" className={tabTriggerClass}>
                            <Newspaper className="w-6 h-6 sm:w-8 sm:h-8" />
                            Nyheter
                        </TabsTrigger>

                        {hasTrupp && (
                            <TabsTrigger value="truppen" className={tabTriggerClass}>
                                <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                                Truppen
                            </TabsTrigger>
                        )}

                        {hasTraining && (
                            <TabsTrigger value="traning" className={tabTriggerClass}>
                                <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
                                Träning
                            </TabsTrigger>
                        )}

                        {isSEFTeam && (
                            <>
                                <TabsTrigger value="matcher" className={tabTriggerClass}>
                                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
                                    Matcher
                                </TabsTrigger>

                                <TabsTrigger value="statistik" className={tabTriggerClass}>
                                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
                                    Statistik
                                </TabsTrigger>

                                <TabsTrigger value="tabell" className={tabTriggerClass}>
                                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
                                    Tabell
                                </TabsTrigger>
                            </>
                        )}
                    </TabsList>
                </MaxWidthWrapper>

                {/* Nyheter Tab */}
                <TabsContent value="nyheter" className="mt-0">
                    <MaxWidthWrapper>
                        <div className="pt-10 pb-20">
                            {teamNews.length > 0 ? (
                                <div className='text-white'>
                                    <h2 className="text-3xl font-bold mb-8 text-white">Nyheter om {teamTitle}</h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10">
                                        <NyheterItem key={teamNews[0].id} post={teamNews[0]} />
                                        <div className="space-y-6">
                                            {teamNews.slice(1).map((post: Post) => (
                                                <MiniNyheterItem key={post.id} post={post} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-white text-center py-20">
                                    <h2 className="text-3xl font-bold mb-4">Inga nyheter än</h2>
                                    <p className="text-gray-300">Det finns inga nyheter om {teamTitle} just nu.</p>
                                </div>
                            )}
                        </div>
                    </MaxWidthWrapper>
                </TabsContent>

                {/* Truppen Tab */}
                {hasTrupp && (
                    <TabsContent value="truppen" className="mt-0">
                        <MaxWidthWrapper>
                            <div className="pt-10 pb-20">
                                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
                                    {/* Players Section */}
                                    {hasPlayers && (
                                        <div>
                                            <h2 className="text-3xl font-bold mb-8 text-white">Spelare</h2>
                                            {Object.entries(playersByPosition)
                                                .sort(([a], [b]) => getPositionOrder(a) - getPositionOrder(b))
                                                .map(([position, positionPlayers]) => (
                                                <div key={position} className="mb-10">
                                                    <h3 className="text-xl font-semibold mb-6 text-white/80">{getPositionDisplayName(position)}</h3>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                        {positionPlayers.map((player) => (
                                                            <PlayerCardCMS
                                                                key={player.id}
                                                                person={transformToPlayerCard(player)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Staff Section */}
                                    {hasStaff && (
                                        <StaffSection
                                            staff={staff.map((member) => ({
                                                name: member.title,
                                                role: member.content.roll,
                                                image: member.content.bild || null,
                                                epost: member.content.epost || null,
                                                telefon: member.content.telefon || null,
                                            }))}
                                        />
                                    )}
                                </div>
                            </div>
                        </MaxWidthWrapper>
                    </TabsContent>
                )}

                {/* Träning Tab */}
                {hasTraining && (
                    <TabsContent value="traning">
                        <MaxWidthWrapper>
                            <div className="pt-10 pb-20">
                                <h2 className="text-3xl font-bold mb-8 text-left text-white">Kommande träningar</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {upcomingTraining.map((traning, index) => (
                                        <div
                                            key={traning._entryId || index}
                                            className="relative rounded-xl p-6 pt-16 shadow-md border border-white/20 hover:border-white/40 hover:shadow-xl transition-all duration-300 group"
                                        >
                                            <p className="absolute top-0 left-0 bg-custom_dark_red p-2 font-bold capitalize tracking-tight text-white rounded-tl-xl rounded-br-xl">
                                                {traning.formattedDag}
                                            </p>
                                            <div className="flex items-start gap-3">
                                                <p className="absolute top-0 right-0 text-white text-sm px-3 py-2">
                                                    {traning.formattedStartTid} – {traning.formattedSlutTid}
                                                </p>
                                            </div>
                                            <div className="space-y-4 text-sm text-white">
                                                {traning.plats && <p>{traning.plats}</p>}
                                                {traning.notering && (
                                                    <div className="bg-white/10 p-4 rounded-lg">
                                                        <p className="text-white/80 whitespace-pre-line text-sm">
                                                            {traning.notering}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {upcomingTraining.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-white/80 text-lg">
                                            Inga kommande träningar schemalagda just nu.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </MaxWidthWrapper>
                    </TabsContent>
                )}

                {/* Matcher Tab (SEF Teams only) */}
                {isSEFTeam && (
                    <TabsContent value="matcher" className="mt-0">
                        <MaxWidthWrapper>
                            <div className="pt-10 pb-20">
                                <h2 className="text-3xl font-bold mb-8 text-white">Kommande matcher</h2>
                                <Suspense fallback={<TabContentSkeleton />}>
                                    <KommandeMatcher maxMatches={5} />
                                </Suspense>
                            </div>
                        </MaxWidthWrapper>
                    </TabsContent>
                )}

                {/* Statistik Tab (SEF Teams only) */}
                {isSEFTeam && (
                    <TabsContent value="statistik" className="mt-0">
                        <MaxWidthWrapper>
                            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-10 mt-10 mb-10">
                                {squad.length > 0 && (
                                    <Suspense fallback={<TabContentSkeleton />}>
                                        <FunStats players={squad} />
                                    </Suspense>
                                )}
                                <div className="col-span-3 sm:col-span-1 lg:col-span-2 text-white">
                                    <Suspense fallback={<TabContentSkeleton />}>
                                        <LagSenastSpeladeMatcher />
                                    </Suspense>
                                </div>
                            </div>
                        </MaxWidthWrapper>
                        <div className="mb-10 w-full bg-custom_dark_red">
                            <MaxWidthWrapper>
                                <Suspense fallback={<TabContentSkeleton />}>
                                    <TeamStatsOverview stats={teamStats || null} />
                                </Suspense>
                            </MaxWidthWrapper>
                        </div>
                    </TabsContent>
                )}

                {/* Tabell Tab (SEF Teams only) */}
                {isSEFTeam && (
                    <TabsContent value="tabell" className="mt-0">
                        <MaxWidthWrapper>
                            <div className="pt-10 pb-20">
                                <h2 className="text-3xl font-bold mb-8 text-white">Tabell</h2>
                                <Suspense fallback={<TabContentSkeleton />}>
                                    <StandingsTable
                                        config={{
                                            highlightTeams: smcTeamId ? [parseInt(smcTeamId, 10)] : [19],
                                            theme: 'dark',
                                        }}
                                    />
                                </Suspense>
                            </div>
                        </MaxWidthWrapper>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
