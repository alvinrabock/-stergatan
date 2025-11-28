import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import YellowCard from '../Icons/YellowCard';
import RedCard from '../Icons/RedCard';
import { ResponsiveContainer } from 'recharts';
import type { LiveStats, MatchLineup } from '@/types';
import Image from 'next/image';
import { getTeamLogoPath } from '@/utils/getTeamLogoPath';
import PlayerStats from './PlayerStats';

interface LiveStatsProps {
  leagueId: number | string;
  matchId: number | string;
  homeTeam: string;
  awayTeam: string;
  lineupData: MatchLineup | null;
  liveStats: LiveStats | null
}

const LiveStats = ({ homeTeam, awayTeam, lineupData, liveStats }: LiveStatsProps) => {
  // Helper function to safely convert any value to number
  const safeNumber = (value: string | number | null | undefined): number => {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to safely format numbers with fallback
  const formatStat = (value: string | number | null | undefined, suffix: string = '', fallback: string = 'N/A'): string => {
    const num = safeNumber(value);
    return num > 0 ? `${num}${suffix}` : fallback;
  };

  // Safe percentage calculation
  function calculatePercentage(value: string | number | null | undefined, otherValue: string | number | null | undefined): number {
    const val1 = safeNumber(value);
    const val2 = safeNumber(otherValue);
    const total = val1 + val2;
    if (total === 0) return 50; // Equal when no data
    return (val1 / total) * 100;
  }

  // Safe shot accuracy calculation
  function calculateShotAccuracy(shotsOnTarget: string | number | null | undefined, totalShots: string | number | null | undefined): number | null {
    const onTarget = safeNumber(shotsOnTarget);
    const total = safeNumber(totalShots);
    if (total === 0) return null; // No shots taken
    return Math.floor((onTarget / total) * 100);
  }

  function getTotalDistance(team: "home" | "away"): number {
    const data = liveStats?.["livetrack-statistics"]?.[`${team}-team-distance`];
    const firstHalf = safeNumber(data?.["1st-half"]);
    const secondHalf = safeNumber(data?.["2nd-half"]);
    return firstHalf + secondHalf;
  }

  // Check if we have any meaningful data to display
  const hasData =
    liveStats?.["livetrack-statistics"]?.["home-team-possession"]?.["game-total"] ||
    liveStats?.["livetrack-statistics"]?.["away-team-possession"]?.["game-total"] ||
    liveStats?.statistics?.["total-shots"]?.["home-team"] ||
    liveStats?.statistics?.["total-shots"]?.["visiting-team"] ||
    liveStats?.statistics?.["shots-on-target"]?.["home-team"] ||
    liveStats?.statistics?.["shots-on-target"]?.["visiting-team"] ||
    liveStats?.statistics?.corners ||
    liveStats?.statistics?.["fouls-committed"] ||
    liveStats?.statistics?.["yellow-cards"] ||
    liveStats?.statistics?.["red-cards"];

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center p-6 text-white">
        <h5 className="text-2xl font-semibold">
          Ingen statistik tillgänglig
        </h5>
        <p className="text-lg">
          Antingen har matchen inte startat eller så är inte statistik tillgänglig för den här matchen.
        </p>
      </div>
    );
  }

  // Safe extraction of possession data
  const homeFirstHalf = safeNumber(liveStats?.["livetrack-statistics"]?.["home-team-possession"]?.["1st-half"]);
  const homeSecondHalf = safeNumber(liveStats?.["livetrack-statistics"]?.["home-team-possession"]?.["2nd-half"]);
  const awayFirstHalf = safeNumber(liveStats?.["livetrack-statistics"]?.["away-team-possession"]?.["1st-half"]);
  const awaySecondHalf = safeNumber(liveStats?.["livetrack-statistics"]?.["away-team-possession"]?.["2nd-half"]);

  // Safe extraction of match statistics
  const homeCorners = safeNumber(liveStats?.statistics?.corners?.["home-team"]);
  const awayCorners = safeNumber(liveStats?.statistics?.corners?.["visiting-team"]);

  const homeOffsides = safeNumber(liveStats?.statistics?.offsides?.["home-team"]);
  const awayOffsides = safeNumber(liveStats?.statistics?.offsides?.["visiting-team"]);

  const homeFouls = safeNumber(liveStats?.statistics?.["fouls-committed"]?.["home-team"]);
  const awayFouls = safeNumber(liveStats?.statistics?.["fouls-committed"]?.["visiting-team"]);

  const yellowHome = safeNumber(liveStats?.statistics?.["yellow-cards"]?.["home-team"]);
  const yellowAway = safeNumber(liveStats?.statistics?.["yellow-cards"]?.["visiting-team"]);

  const redHome = safeNumber(liveStats?.statistics?.["red-cards"]?.["home-team"]);
  const redAway = safeNumber(liveStats?.statistics?.["red-cards"]?.["visiting-team"]);

  // Shot statistics with safe calculations
  const homeTotalShots = safeNumber(liveStats?.statistics?.["total-shots"]?.["home-team"]);
  const awaytotalShots = safeNumber(liveStats?.statistics?.["total-shots"]?.["visiting-team"]);
  const homeShotsOnTarget = safeNumber(liveStats?.statistics?.["shots-on-target"]?.["home-team"]);
  const awayShotsOnTarget = safeNumber(liveStats?.statistics?.["shots-on-target"]?.["visiting-team"]);

  const homeAccuracy = calculateShotAccuracy(homeShotsOnTarget, homeTotalShots);
  const awayAccuracy = calculateShotAccuracy(awayShotsOnTarget, awaytotalShots);

  return (
    <div className="w-full p-6 space-y-4 rounded-md text-white">
      {/* Match Clock & Attendees */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Section */}
        <div className='flex flex-col gap-2'>
          <div className="grid grid-cols-2 gap-4 sm:gap-10">
            {liveStats?.["game-clock-in-sec"] != null && (
              <div className="border-b pb-2 border-white/20">
                <h3 className="text-lg sm:text-2xl font-semibold mb-2 flex items-center uppercase">
                  Matchtid
                </h3>
                <p className="text-2xl sm:text-3xl font-medium oswald-font">
                  {`${safeNumber(liveStats["game-clock-in-min"])}:${String(safeNumber(liveStats["game-clock-in-sec"])).padStart(2, '0')}`}
                </p>
              </div>
            )}

            {liveStats?.attendees != null && (
              <div className="border-b pb-2 border-white/20">
                <h3 className="text-lg sm:text-2xl font-semibold mb-2 flex items-center uppercase">
                  Publik
                </h3>
                <p className="text-2xl sm:text-3xl font-medium oswald-font">
                  {formatStat(liveStats.attendees)}
                </p>
              </div>
            )}
          </div>
          <div>
            <PlayerStats lineupData={lineupData} />
          </div>
        </div>

        {/* Right Section (Possession Chart) */}
        <Card className="bg-custom_dark_red text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl sm:text-4xl font-semibold mb-2 flex items-center">
              Bollinnehav
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-custom_dark_dark_red"></div>
                    <span className="font-medium uppercase oswald-font text-white">{homeTeam}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium uppercase oswald-font text-white">{awayTeam}</span>
                    <div className="h-4 w-4 rounded-full bg-custom_dark_red border"></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium uppercase oswald-font text-white mb-2 ">FÖRSTA HALVLEK</h3>
                  <div className="relative h-8 w-full">
                    <div className="absolute left-0 top-0 h-full bg-custom_dark_dark_red rounded-l-full transition-all duration-500 ease-in-out" style={{ width: `${homeFirstHalf}%` }}>
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-primary-foreground md:text-sm">
                        {homeFirstHalf}%
                      </span>
                    </div>
                    <div className="absolute right-0 top-0 h-full bg-custom_dark_red rounded-r-full border transition-all duration-500 ease-in-out" style={{ width: `${awayFirstHalf}%` }}>
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white md:text-sm">
                        {awayFirstHalf}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium uppercase oswald-font text-white mb-2">ANDRA HALVLEK</h3>
                  <div className="relative h-8 w-full">
                    <div className="absolute left-0 top-0 rounded-l-full h-full bg-custom_dark_dark_red transition-all duration-500 ease-in-out" style={{ width: `${homeSecondHalf}%` }}>
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-primary-foreground md:text-sm">
                        {homeSecondHalf}%
                      </span>
                    </div>
                    <div className="absolute right-0 top-0 h-full rounded-r-full bg-custom_dark_red border transition-all duration-500 ease-in-out" style={{ width: `${awaySecondHalf}%` }}>
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white md:text-sm">
                        {awaySecondHalf}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className='w-full flex flex-row justify-between border-b border-white/20 pb-4 mt-20'>
        <div className="flex items-center gap-4">
          <div className='aspect-square flex items-center justify-center'>
            <div className="w-12 h-12 relative">
              <Image
                src={getTeamLogoPath(homeTeam)}
                alt={`${homeTeam} logo`}
                fill
                className="object-contain !m-0"
              />
            </div>
          </div>
          <h2 className="hidden sm:flex text-2xl font-bold uppercase">{homeTeam}</h2>
        </div>
        <div className="flex items-center gap-4">
          <h2 className="hidden sm:flex text-2xl font-bold uppercase">{awayTeam}</h2>
          <div className='aspect-square flex items-center justify-center'>
            <div className="w-12 h-12 relative">
              <Image
                src={getTeamLogoPath(awayTeam)}
                alt={`${awayTeam} logo`}
                fill
                className="object-contain !m-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-10'>
        {/* Shots Accuracy */}
        {(homeTotalShots > 0 || awaytotalShots > 0 || homeShotsOnTarget > 0 || awayShotsOnTarget > 0) && (
          <div className="w-full mb-8">
            <h3 className="w-full text-2xl text-center font-semibold uppercase mb-4">
              Skott
            </h3>
            <div className="flex gap-10 text-white">
              {/* Home team */}
              <div className="flex flex-col flex-1">
                <div className="text-left mb-2">
                  <span className="text-xl uppercase oswald-font">
                    {homeAccuracy !== null ? `${homeAccuracy} % av skotten sköts mot mål` : "Inga skott ännu"}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 flex rounded bg-custom_red/20">
                    <div
                      style={{ width: `${homeAccuracy ?? 0}%` }}
                      className="flex justify-center bg-custom_red"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-md uppercase oswald-font">
                    {formatStat(homeShotsOnTarget, ' skott på mål', '0 skott på mål')}
                  </span>
                  <span className="text-md uppercase oswald-font">
                    {formatStat(homeTotalShots, ' skott', '0 skott')}
                  </span>
                </div>
              </div>

              {/* Away team */}
              <div className="flex flex-col flex-1">
                <div className="text-right mb-2">
                  <span className="text-xl uppercase oswald-font">
                    {awayAccuracy !== null ? `${awayAccuracy} % av skotten sköts mot mål` : "Inga skott ännu"}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 flex rounded bg-custom_red/20">
                    <div
                      style={{ width: `${awayAccuracy ?? 0}%` }}
                      className="flex justify-center bg-custom_red"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-md uppercase oswald-font">
                    {formatStat(awayShotsOnTarget, ' skott på mål', '0 skott på mål')}
                  </span>
                  <span className="text-md uppercase oswald-font">
                    {formatStat(awaytotalShots, ' skott', '0 skott')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(homeCorners > 0 || awayCorners > 0) && (
          <div className="mb-8">
            <h3 className="text-2xl text-center font-semibold uppercase mb-4">HÖRNOR</h3>
            <div className="relative h-2 w-full overflow-hidden rounded-full">
              <div
                className="absolute left-0 top-0 h-full bg-custom_red"
                style={{ width: `${calculatePercentage(homeCorners, awayCorners)}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-white/70"
                style={{ width: `${calculatePercentage(awayCorners, homeCorners)}%` }}
              />
            </div>
            <div className="flex justify-between text-lg font-semibold oswald-font">
              <span>{homeCorners}</span>
              <span>{awayCorners}</span>
            </div>
          </div>
        )}

        {(homeFouls > 0 || awayFouls > 0) && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-center uppercase mb-4">Fouls</h3>
            <div className="relative h-2 w-full overflow-hidden rounded-full">
              <div
                className="absolute left-0 top-0 h-full bg-custom_red"
                style={{ width: `${calculatePercentage(homeFouls, awayFouls)}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-white/70"
                style={{ width: `${calculatePercentage(awayFouls, homeFouls)}%` }}
              />
            </div>
            <div className="flex justify-between text-lg font-semibold oswald-font">
              <span>{homeFouls}</span>
              <span>{awayFouls}</span>
            </div>
          </div>
        )}

        {(yellowHome > 0 || yellowAway > 0 || redHome > 0 || redAway > 0) && (
          <div className="mb-8">
            {(yellowHome > 0 || yellowAway > 0) && (
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-center uppercase mb-4">Gula Kort</h3>
                <div className='w-full flex justify-between'>
                  <div className="flex items-center gap-2 text-xl uppercase oswald-font mb-2">
                    <YellowCard className="w-6 h-6" />
                    <span className='sr-only'>Gula Kort hemmalag</span>
                  </div>
                  <div className="flex items-center gap-2 text-xl uppercase oswald-font mb-2">
                    <YellowCard className="w-6 h-6" />
                    <span className='sr-only'>Gula Kort bortalag</span>
                  </div>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full mb-2">
                  <div
                    className="absolute left-0 top-0 h-full bg-custom_red"
                    style={{ width: `${calculatePercentage(yellowHome, yellowAway)}%` }}
                  />
                  <div
                    className="absolute right-0 top-0 h-full bg-white/70"
                    style={{ width: `${calculatePercentage(yellowAway, yellowHome)}%` }}
                  />
                </div>
                <div className="flex justify-between text-lg font-semibold oswald-font">
                  <span>{yellowHome}</span>
                  <span>{yellowAway}</span>
                </div>
              </div>
            )}

            {(redHome > 0 || redAway > 0) && (
              <div>
                <h3 className="text-2xl font-semibold text-center uppercase mb-4">Röda Kort</h3>
                <div className='w-full flex justify-between'>
                  <div className="flex items-center gap-2 text-xl uppercase oswald-font mb-2">
                    <RedCard className="w-6 h-6" />
                    <span className='sr-only'>Röda Kort hemmalag</span>
                  </div>
                  <div className="flex items-center gap-2 text-xl uppercase oswald-font mb-2">
                    <RedCard className="w-6 h-6" />
                    <span className='sr-only'>Röda Kort bortalag</span>
                  </div>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full mb-2">
                  <div
                    className="absolute left-0 top-0 h-full bg-custom_red"
                    style={{ width: `${calculatePercentage(redHome, redAway)}%` }}
                  />
                  <div
                    className="absolute right-0 top-0 h-full bg-white/70"
                    style={{ width: `${calculatePercentage(redAway, redHome)}%` }}
                  />
                </div>
                  <div className="flex justify-between text-lg font-semibold oswald-font">
                    <span>{redHome}</span>
                    <span>{redAway}</span>
                  </div>
                </div>
            )}
          </div>
        )}

        {(homeOffsides > 0 || awayOffsides > 0) && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-center uppercase mb-4">OFFSIDES</h3>
            <div className="relative h-2 w-full overflow-hidden rounded-full">
              <div
                className="absolute left-0 top-0 h-full bg-custom_red"
                style={{ width: `${calculatePercentage(homeOffsides, awayOffsides)}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-white/70"
                style={{ width: `${calculatePercentage(awayOffsides, homeOffsides)}%` }}
              />
            </div>
            <div className="flex justify-between text-lg font-semibold oswald-font">
              <span>{homeOffsides}</span>
              <span>{awayOffsides}</span>
            </div>
          </div>
        )}

        {(getTotalDistance("home") > 0 || getTotalDistance("away") > 0) && (
          <div className="space-y-6">
            {/* Title */}
            <h3 className="text-2xl font-semibold mb-2 text-center uppercase mb-8">
              DISTANS
            </h3>

            {/* Progress Bar */}
            <div className="relative h-2 w-full overflow-hidden rounded-full">
              <div
                className="absolute left-0 top-0 h-full bg-custom_red transition-all duration-500 ease-in-out rounded-l"
                style={{
                  width: `${calculatePercentage(
                    getTotalDistance("home"),
                    getTotalDistance("away")
                  )}%`,
                }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-white/70 transition-all duration-500 ease-in-out rounded-r"
                style={{
                  width: `${calculatePercentage(
                    getTotalDistance("away"),
                    getTotalDistance("home")
                  )}%`,
                }}
              />
            </div>

            {/* Breakdown by halves with total above */}
            <div className="grid grid-cols-2 gap-4 text-sm md:text-lg mt-2">
              {/* Home team */}
              <div className="text-left">
                <p className="oswald-font font-semibold">
                  Totalt: {formatStat(getTotalDistance("home"), ' m', '0 m')}
                </p>
                <p className="oswald-font">
                  1:a halvlek: {formatStat(liveStats?.["livetrack-statistics"]?.["home-team-distance"]?.["1st-half"], ' m', '0 m')}
                </p>
                <p className="oswald-font">
                  2:a halvlek: {formatStat(liveStats?.["livetrack-statistics"]?.["home-team-distance"]?.["2nd-half"], ' m', '0 m')}
                </p>
              </div>

              {/* Away team */}
              <div className="text-right">
                <p className="oswald-font font-semibold">
                  Totalt: {formatStat(getTotalDistance("away"), ' m', '0 m')}
                </p>
                <p className="oswald-font">
                  1:a halvlek: {formatStat(liveStats?.["livetrack-statistics"]?.["away-team-distance"]?.["1st-half"], ' m', '0 m')}
                </p>
                <p className="oswald-font">
                  2:a halvlek: {formatStat(liveStats?.["livetrack-statistics"]?.["away-team-distance"]?.["2nd-half"], ' m', '0 m')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStats;