import React from 'react';
import { DateRange } from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/Button';

type Season = {
  seasonYear: string;
  tournaments?:
  | {
    LeagueName: string;
    leagueId?: string | null;
    id?: string | null;
  }[]
  | null;
  id?: string | null;
};

type LeagueOption = {
  id: string;
  name: string;
};


interface MatchFilterProps {
  isPlayedFilter: boolean;
  locationFilter: string | null;
  leagueFilter: string | null;
  selectedSeason: string | undefined;
  seasonOptions: Season[];
  leagueOptions: LeagueOption[];
  calendarOpen: boolean;
  selectedRange: DateRange | undefined;
  setCalendarOpen: (open: boolean) => void;
  handlePlayedFilterClick: () => void;
  handleLocationFilterClick: (value: 'home' | 'away') => void;
  handleLeagueChange: (value: string) => void;
  handleSeasonChange: (value: string) => void;
  handleDateChange: (range: DateRange | undefined) => void;
}

const MatchFilter: React.FC<MatchFilterProps> = ({
  locationFilter,
  leagueFilter,
  selectedSeason,
  seasonOptions,
  leagueOptions,
  handleLocationFilterClick,
  handleLeagueChange,
  handleSeasonChange,
}) => {

  const sortedSeasons = [...seasonOptions].sort((a, b) => Number(b.seasonYear) - Number(a.seasonYear));

  return (
    <div className="flex flex-col xl:flex-row gap-4 w-full">
      {/* Group for buttons and selects */}
      <div className="flex flex-col xl:flex-row gap-4 w-full xl:w-auto">
        {/* Home / Away Buttons */}
        <div className="grid grid-cols-2 xl:flex gap-2">
          <Button
            variant={locationFilter === 'home' ? 'white' : 'outline'}
            className={`text-sm whitespace-nowrap ${locationFilter === 'home' ? '' : 'text-white'}`}
            onClick={() => handleLocationFilterClick('home')}
          >
            Hemma
          </Button>
          <Button
            variant={locationFilter === 'away' ? 'white' : 'outline'}
            className={`text-sm whitespace-nowrap ${locationFilter === 'away' ? '' : 'text-white'}`}
            onClick={() => handleLocationFilterClick('away')}
          >
            Borta
          </Button>
        </div>

        {/* Season Select */}
        <div>
          <Select
            onValueChange={handleSeasonChange}
            value={selectedSeason ?? sortedSeasons[0]?.seasonYear}
          >
            <SelectTrigger className="p-6 border hover:bg-white/20! !bg-transparent  text-center w-full xl:w-fit border-white text-white rounded-lg text-sm">
              <SelectValue placeholder="Välj säsong" />
            </SelectTrigger>
            <SelectContent>
              {sortedSeasons
                .filter((season) => season.seasonYear === '2025') // Only show 2025 for now
                .map((season) => (
                  <SelectItem key={season.seasonYear} value={season.seasonYear}>
                    Säsong {season.seasonYear}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* League Select */}
        <div>
          <Select
            onValueChange={handleLeagueChange}
            value={leagueFilter ?? 'clear'}
          >
            <SelectTrigger className="p-6 border hover:bg-white/20! !bg-transparent  text-center w-full xl:w-fit border-white text-white rounded-lg text-sm">
              <SelectValue placeholder="Välj liga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clear">Alla turneringar</SelectItem>
              {leagueOptions.map((league) => (
                <SelectItem key={league.id} value={league.id}>
                  {league.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

    </div>

  );
};

export default MatchFilter;
