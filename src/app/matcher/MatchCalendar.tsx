"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import type { DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/app/components/ui/Button";
import { MatchCardData } from "@/types";
import { lowercase } from "@/utillities/lowercase";

type MatchCalendarProps = DayPickerProps & {
  matches?: MatchCardData[];
}

export function MatchCalendar({
  className,
  classNames,
  showOutsideDays = true,
  matches = [],
  ...props
}: MatchCalendarProps) {
  // Group matches by date
  const matchesByDate = React.useMemo(() => {
    const grouped = new Map<string, MatchCardData[]>();

    matches.forEach((match) => {
      try {
        // Parse kickoff consistently - extract just the date portion (YYYY-MM-DD)
        const kickoffStr = match.kickoff || '';
        const dateKey = kickoffStr.split(' ')[0]; // Extract "2025-11-09" from "2025-11-09 15:00"

        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(match);
      } catch (error) {
        console.error('Error parsing match date:', error);
      }
    });

    return grouped;
  }, [matches]);

  const getTeamLogoPath = (teamName: string) => {
    const formattedName = lowercase(teamName);
    return `/logos/${formattedName}.svg`;
  };

  // Custom day content renderer for v9
  const renderDayContent = (date: Date) => {
    // Format date as YYYY-MM-DD without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    const dayMatches = matchesByDate.get(dateKey) || [];

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-1">
        <span className="text-sm font-medium">{date.getDate()}</span>
        {dayMatches.length > 0 && (
          <div className="flex flex-col gap-1 items-center">
            {dayMatches.slice(0, 1).map((match, idx) => {
              const homeTeam = match.homeTeam;
              const awayTeam = match.awayTeam;

              return (
                <div
                  key={`${match.matchId}-${idx}`}
                  className="flex items-center gap-1"
                  title={`${homeTeam} vs ${awayTeam}`}
                >
                  {/* Home team logo */}
                  <div className="w-5 h-5 relative rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                    <Image
                      src={getTeamLogoPath(homeTeam)}
                      alt={homeTeam}
                      fill
                      className="object-contain p-0.5"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* VS indicator */}
                  <span className="text-[0.6rem] text-white/70 font-bold leading-none">VS</span>

                  {/* Away team logo */}
                  <div className="w-5 h-5 relative rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                    <Image
                      src={getTeamLogoPath(awayTeam)}
                      alt={awayTeam}
                      fill
                      className="object-contain p-0.5"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {dayMatches.length > 1 && (
              <span className="text-[0.55rem] text-white/70">+{dayMatches.length - 1}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
        ),
        month_grid: "w-full border-collapse space-x-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-16 font-normal text-sm",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-16 w-16 p-1 font-normal aria-selected:opacity-100"
        ),
        range_start: "day-range-start aria-selected:bg-white aria-selected:text-black",
        range_end: "day-range-end aria-selected:bg-white aria-selected:text-black",
        selected: "bg-white text-black hover:bg-white hover:text-black focus:bg-white focus:text-black",
        today: "bg-accent text-accent-foreground",
        outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-white/20 aria-selected:text-white",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (
          orientation === "left"
            ? <ChevronLeft className="size-4" />
            : <ChevronRight className="size-4" />
        ),
        DayButton: ({ day, modifiers: _modifiers, ...buttonProps }) => (
          <button {...buttonProps}>
            {renderDayContent(day.date)}
          </button>
        ),
      }}
      {...props}
    />
  );
}
