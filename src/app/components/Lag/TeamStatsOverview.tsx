import { SuperAdminTeamStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function TeamStatsOverview({ stats }: { stats: SuperAdminTeamStats | null }) {
  if (!stats) {
    return <div className="text-white">Loading...</div>; 
  }

  return (
    <div className="text-white p-6 relative bg-custom_dark_red py-16">
      <div className="relative mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight pb-2">
          LAGSTATISTIK
        </h1>
      </div>

      {/* Key Stats - Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ">
        {/* Mål */}
        <Card className="rounded-xl border-whtie/10 bg-transparent text-white ">
          <CardHeader>
            <div className="text-7xl font-extrabold text-white">{stats.goals}</div>
            <CardTitle className="text-xl text-white font-semibold uppercase tracking-wider">
              Mål
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { label: "Straffmål", value: stats.penaltyGoals },
                { label: "Nickmål", value: stats.headerGoals },
                { label: "Frisparksmål", value: stats.freekickGoals }
              ].map((item, index) => (
                <div key={index}>
                  <div className="text-xs text-white font-medium">{item.label}</div>
                  <div className="text-lg font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hörnor */}
        <Card className="rounded-xl border-whtie/10 bg-transparent text-white ">
          <CardHeader>
            <div className="text-7xl text-white font-extrabold">{stats.corners}</div>
            <CardTitle className="text-xl text-white font-semibold uppercase tracking-wider">
              Hörnor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-xs text-white font-medium">Mål på hörna</div>
                <div className="text-lg font-bold text-white">{stats.allCornerGoals}</div>
              </div>
              <div>
                <div className="text-xs text-white font-medium">Nickmål på hörna</div>
                <div className="text-lg font-bold text-white">{stats.cornerHeaderGoals}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Possession */}
        <Card className="rounded-xl border-whtie/10 bg-transparent text-white ">
          <CardHeader className="pb-2 relative">
            <div className="absolute top-2 right-2">
            </div>
            <div className="text-6xl font-extrabold text-white flex items-baseline gap-1">
              ≈ {stats.averagePossesion}%
            </div>
            <CardTitle className="text-xl text-white font-semibold">
              Bollkontroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                {/* First Half Possession */}
                <div>
                  <div className="text-xs text-white font-medium">Första halvlek</div>
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-bold text-white">
                      {stats.homeTeamFirstPeriodAveragePossesion}% (Hemmalag)
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-bold text-white">
                      {stats.visitingTeamFirstPeriodAveragePossesion}% (Bortalag)
                    </div>
                  </div>
                </div>
                {/* Second Half Possession */}
                <div>
                  <div className="text-xs text-white font-medium">Andra halvlek</div>
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-bold text-white">
                      {stats.homeTeamSecondPeriodAveragePossesion}% (Hemmalag)
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-bold text-white">
                      {stats.visitingTeamSecondPeriodAveragePossesion}% (Bortalag)
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-red-950/50 rounded-full h-1.5 my-2">
                <div
                  className="bg-red-400 h-1.5 rounded-full"
                  style={{ width: `${stats.averagePossesion}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skott */}
        <Card className="rounded-xl border-whtie/10 bg-transparent text-white ">
          <CardHeader>
            <div className="text-7xl text-white font-semibold">{stats.shots}</div>
            <CardTitle className="text-xl text-white font-semibold uppercase tracking-wider">
              Skott
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row gap-10">
              <div>
                <div className="text-xs text-white font-medium">Skott på mål</div>
                <div className="text-lg font-bold text-white">{stats.shotsOnTarget}</div>
              </div>
              <div>
                <div className="text-xs text-white font-medium">Stolpe/ribba</div>
                <div className="text-lg font-bold text-white">{stats.shotsPostOrBar}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
