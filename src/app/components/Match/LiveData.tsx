"use client"
import { Event, GoalEvent, Player } from '@/types';
import { useMemo, useCallback } from 'react';
import FlagIcon from '../Icons/FlagIcon';
import FootballKick from '../Icons/FootballKick';
import GoalIcon from '../Icons/GoalIcon';
import { KickIcon } from '../Icons/KickIcon';
import MedicalIcon from '../Icons/MedicalIcon';
import PenaltyIcon from '../Icons/PenaltyIcon';
import RedCard from '../Icons/RedCard';
import TransferIcon from '../Icons/TransferIcon';
import WhistleIcon from '../Icons/WhistleIcon';
import YellowCard from '../Icons/YellowCard';

export interface OptimizedLiveDataProps {
  leagueId: number | string;
  matchId: number | string;
  homeLineup: { formation?: string; players: Player[] };
  awayLineup: { formation?: string; players: Player[] };
  events: Event[] | null;
  goals?: GoalEvent[] | null;
  loading?: boolean;
  error?: string | null;
}

// Optimized loading skeleton for live data
const LiveDataSkeleton = () => (
  <div className='relative pt-6'>
    <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-600 animate-pulse"></div>
    {[...Array(6)].map((_, index) => (
      <div key={index} className="relative flex items-center mb-6">
        {/* Timeline Dot Skeleton */}
        <div className="absolute left-6 -translate-x-1/2 flex items-center justify-center w-12 h-12 bg-gray-600 rounded-full z-10 animate-pulse"></div>

        {/* Horizontal Line Skeleton */}
        <div className="absolute left-6 top-1/2 w-10 h-0.5 bg-gray-600 animate-pulse"></div>

        {/* Event Content Skeleton */}
        <div className="ml-16 p-3 w-full bg-gray-700 rounded-md animate-pulse">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-600 rounded w-12 ml-4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
LiveDataSkeleton.displayName = "LiveDataSkeleton";

const OptimizedLiveData: React.FC<OptimizedLiveDataProps> = ({
  homeLineup,
  awayLineup,
  events,
  goals,
  loading = false,
  error = null
}) => {

  // Memoize merged event data
  const mergedEvents = useMemo(() => {
    if (!events) return [];

    const combinedEvents: Event[] = [];

    events.forEach((event) => {
      const mergedEvent = { ...event };

      if (goals && goals.length > 0) {
        const matchedGoal = goals.find(
          (goalEvent) =>
            goalEvent['general-event-data'] &&
            goalEvent['general-event-data']['event-timestamp'] === event['event-timestamp']
        );

        if (matchedGoal) {
          mergedEvent.goal = {
            ...matchedGoal,
            "player-id": matchedGoal["player-id"],
            "player-id-assist": matchedGoal["player-id-assist"],
            "goal-type": matchedGoal["goal-type"],
            "shot-position": matchedGoal["shot-position"],
            "goal-position": matchedGoal["goal-position"],
            "after-set-piece": matchedGoal["after-set-piece"],
          };
        }
      }

      combinedEvents.push(mergedEvent);
    });

    return [...combinedEvents].reverse(); // Reverse to show latest first
  }, [events, goals]);

  type EventName =
    | "yellow-card"
    | "red-card"
    | "free-kick"
    | "medical-treatment"
    | "penalty"
    | "shot"
    | "match-phase"
    | "goal"
    | "corner"
    | "substitution";

  // Define the function outside useMemo and use useCallback instead
  const getEventIcon = useCallback((type: EventName) => {
    switch (type) {
      case "yellow-card":
        return <YellowCard className="h-8 w-8 text-orange-300" />;
      case "red-card":
        return <RedCard className="h-8 w-8" />;
      case "free-kick":
        return <KickIcon className="h-8 w-8" />;
      case "medical-treatment":
        return <MedicalIcon className="h-8 w-8" />;
      case "penalty":
        return <PenaltyIcon className="h-8 w-8" />;
      case "shot":
        return <FootballKick className="h-8 w-8" />;
      case "match-phase":
        return <WhistleIcon className="h-8 w-8 fill-white" />;
      case "goal":
        return <GoalIcon className="h-8 w-8" />;
      case "corner":
        return <FlagIcon className="h-8 w-8" />;
      case "substitution":
        return <TransferIcon className="h-8 w-8" />;
      default:
        return <div className="h-8 w-8 rounded-full bg-gray-400" />;
    }
  }, []);

  const getGameClock = useCallback((minute: string | number, second: string | number) => {
    if (minute) {
      return `${minute}m`;
    } else if (second) {
      return `${second}s`;
    }
    return 'N/A';
  }, []);

  const isMatchPhaseEvent = useCallback((eventName: string) => {
    return eventName === "match-phase";
  }, []);
  
  // Define the function normally
const renderGoalCardContent = (
  event: Event,
  player: Player | null,
  assistPlayer: Player | null
) => (
  <div>
    <p className="font-semibold text-lg text-gray-800">
      {event["home-team-score"]} - {event["away-team-score"]} MÅL: {player ? player["player-name"] : 'Spelare ej tillgänglig'}
    </p>
    {assistPlayer && (
      <p className="text-sm text-gray-700">
        Assist: {assistPlayer["player-name"] || 'Ingen assist'}
      </p>
    )}
    <p className="text-xs text-gray-600 mt-1">{event.description}</p>
  </div>
);

  // Memoize processed events for better performance
  const processedEvents = useMemo(() => {
    return mergedEvents.map((event, index) => {
      let player = null;
      let assistPlayer = null;

      if (event.goal) {
        player = [...(Array.isArray(homeLineup?.players) ? homeLineup.players : []),
        ...(Array.isArray(awayLineup?.players) ? awayLineup.players : [])]
          .find((p) => p["player-id"] === event.goal?.["player-id"]) || null;

        assistPlayer = [...(Array.isArray(homeLineup?.players) ? homeLineup.players : []),
        ...(Array.isArray(awayLineup?.players) ? awayLineup.players : [])]
          .find((p) => p["player-id"] === event.goal?.["player-id-assist"]) || null;
      }

      return {
        ...event,
        id: `${event['event-timestamp']}-${index}`,
        player,
        assistPlayer,
        icon: getEventIcon(event["event-name"] as EventName),
        gameClock: getGameClock(event["game-clock-in-min"], event["game-clock-in-sec"]),
        isMatchPhase: isMatchPhaseEvent(event["event-name"]),
      };
    });
  }, [mergedEvents, homeLineup, awayLineup, getEventIcon, getGameClock, isMatchPhaseEvent]);

  // Show loading skeleton while data is being fetched
  if (loading) {
    return <LiveDataSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p className="text-lg font-semibold">{error}</p>
        <p className="text-sm mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  // Show empty state when events are loaded but empty
  if (events !== null && processedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center p-6 text-white">
        <h5 className="text-2xl font-semibold">
          Ingen rapportering tillgänglig
        </h5>
        <p className="text-lg">
          Antingen har matchen inte startat eller så är inte rapportering tillgänglig för den här matchen.
        </p>
      </div>
    );
  }

  // Show content with events
  return (
    <div className='relative pt-6'>
      <div className="absolute left-6 top-0 h-[99.5%] w-0.5 bg-gray-300"></div>
      {processedEvents.map((event) => (
        <div key={event.id} className="relative flex items-center mb-6">
          {/* Timeline Dot */}
          <div className="absolute left-6 -translate-x-1/2 flex items-center justify-center w-12 h-12 p-2 fill-white bg-custom-dark-red rounded-full z-10">
            {event.icon}
          </div>

          {/* Horizontal Line */}
          <div className="absolute left-6 top-1/2 w-10 h-0.5 bg-gray-300"></div>

          {/* Event Content */}
          <div
            className={`ml-16 p-3 w-full flex justify-between rounded-md border ${event.isMatchPhase
                ? "bg-blue-100 border-blue-500 p-4"
                : "bg-white border-gray-200"
              }`}
          >
            <div className="flex flex-col w-full">
              {/* Only render regular description if it's not a goal event */}
              {event.goal ? null : (
                <p className="text-gray-800 text-xl">{event.description}</p>
              )}

              {/* Only render the goal card content if it's a goal event */}
              {event.goal && renderGoalCardContent(event, event.player, event.assistPlayer)}
            </div>

            {/* Always render the game clock on the right */}
            <p className="text-xl text-custom-red font-bold oswald-font">
              {event.gameClock}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OptimizedLiveData;