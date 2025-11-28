// app/matcher/[leagueID]/[id]/page.tsx
import { getSingleMatch } from "@/lib/fetchSingleMatch";
import type { Metadata } from 'next';
import MatchClient from "./MatchClient";
import { cache } from 'react';

type PageProps = {
    params: Promise<{ leagueID: string; id: string }>;
};

// Cache the getSingleMatch function for better performance
const getCachedMatch = cache(getSingleMatch);

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const { leagueID, id } = resolvedParams;

    // Support both string IDs (SMC API 2.0 ULIDs) and numeric IDs (Fogis)
    if (!leagueID || !id) {
        return {
            title: 'Match inte hittad - Östers IF',
            description: 'Den begärda matchen kunde inte hittas.',
        };
    }

    try {
        const matchDetails = await getCachedMatch(leagueID, id);

        if (!matchDetails) {
            return {
                title: 'Match inte hittad - Östers IF',
                description: 'Den begärda matchen kunde inte hittas.',
            };
        }

        const { homeTeam, awayTeam, kickoff, status, leagueName } = matchDetails;
        
        // Format match date
        const formatMatchDate = (dateString: string) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('sv-SE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Stockholm',
            }).format(date);
        };

        const formattedDate = formatMatchDate(kickoff);
        
        // Extract year from kickoff date
        const getYearFromDate = (dateString: string) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.getFullYear().toString();
        };

        const matchYear = getYearFromDate(kickoff);
        
        // Create match title with league name and year
        const baseMatchTitle = `${homeTeam} - ${awayTeam}`;
        const leagueAndYear = [leagueName, matchYear].filter(Boolean).join(' ');
        const matchTitle = leagueAndYear ? `${baseMatchTitle} - ${leagueAndYear}` : baseMatchTitle;
        
        // Determine match status for description
        const getMatchStatusText = (status: string) => {
            switch (status?.toLowerCase()) {
                case 'finished':
                case 'slutspelad':
                    return 'Slutspelad match';
                case 'live':
                case 'in progress':
                case 'pågår':
                    return 'Live match';
                case 'upcoming':
                case 'kommande':
                    return 'Kommande match';
                default:
                    return 'Match';
            }
        };

        const statusText = getMatchStatusText(status);
        const description = `${statusText} mellan ${homeTeam} och ${awayTeam}${leagueName ? ` i ${leagueName}` : ''}${formattedDate ? ` - ${formattedDate}` : ''}. Se laguppställning, liverapportering, statistik och tabellställning.`;

        // Determine if this is an Östers IF match
        const isOstersMatch = homeTeam?.toLowerCase().includes('öster') || awayTeam?.toLowerCase().includes('öster');
        const titleSuffix = isOstersMatch ? ' - Östers IF' : ' - Fotbollsmatch';

        return {
            title: `${matchTitle}${titleSuffix}`,
            description,
            keywords: `${homeTeam}, ${awayTeam}, fotboll, match, ${leagueName || ''}, ${isOstersMatch ? 'Östers IF, Växjö, Superettan,' : ''} laguppställning, liverapportering, statistik`,
            openGraph: {
                title: `${matchTitle}${titleSuffix}`,
                description,
                type: 'website',
                locale: 'sv_SE',
                siteName: isOstersMatch ? 'Östers IF' : 'Fotboll',
                ...(formattedDate && { 
                    article: {
                        publishedTime: kickoff,
                        section: 'Sport',
                        tags: [homeTeam, awayTeam, leagueName || 'Fotboll'].filter(Boolean),
                    }
                }),
            },
            alternates: {
                canonical: `/matcher/${leagueID}/${id}`,
                languages: {
                    'sv-SE': `/matcher/${leagueID}/${id}`,
                },
            },
            other: {
                'match:home_team': homeTeam,
                'match:away_team': awayTeam,
                'match:league': leagueName || '',
                'match:date': kickoff,
                'match:status': status,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Match - Östers IF',
            description: 'Matchinformation från Östers IF',
        };
    }
}

// Server component wrapper
export default function Page() {
    return <MatchClient />;
}