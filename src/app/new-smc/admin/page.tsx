'use client'

import { useState, useEffect } from 'react'

interface League {
  leagueId: string
  leagueName: string
  startDate: string
  endDate: string
  tournamentId: number
  seasonYear: string
}

interface CacheData {
  teamId: string
  teamName: string
  lastUpdated: string | null
  leagues: League[]
}

export default function LeagueCacheAdminPage() {
  const [cacheData, setCacheData] = useState<CacheData | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const loadCacheData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/discover-leagues')
      const data = await response.json()

      if (data.success) {
        setCacheData(data.data)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to load cache' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error loading cache data' })
    } finally {
      setLoading(false)
    }
  }

  const refreshCache = async () => {
    setRefreshing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/discover-leagues', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        setCacheData(data.data)
        setMessage({ type: 'success', text: `Cache refreshed! Found ${data.data.leagues.length} leagues` })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to refresh cache' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error refreshing cache' })
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadCacheData()
  }, [])

  // Group leagues by season
  const leaguesBySeason = cacheData?.leagues.reduce((acc, league) => {
    if (!acc[league.seasonYear]) {
      acc[league.seasonYear] = []
    }
    acc[league.seasonYear].push(league)
    return acc
  }, {} as Record<string, League[]>)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">League Cache Administration</h1>
          <button
            onClick={refreshCache}
            disabled={refreshing}
            className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {refreshing ? 'Refreshing...' : '🔄 Refresh Cache'}
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Cache Info */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Loading cache data...</p>
          </div>
        ) : cacheData ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-blue-900 mb-2">Cache Information</h2>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Team:</strong> {cacheData.teamName} (ID: {cacheData.teamId})</p>
                <p><strong>Last Updated:</strong> {cacheData.lastUpdated ? new Date(cacheData.lastUpdated).toLocaleString('sv-SE') : 'Never'}</p>
                <p><strong>Total Leagues:</strong> {cacheData.leagues.length}</p>
                <p><strong>Seasons:</strong> {Object.keys(leaguesBySeason || {}).length}</p>
              </div>
            </div>

            {/* Leagues by Season */}
            <div className="space-y-6">
              {leaguesBySeason && Object.entries(leaguesBySeason)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([seasonYear, leagues]) => (
                  <div key={seasonYear} className="bg-white rounded-lg shadow">
                    <div className="bg-gray-100 px-6 py-3 border-b">
                      <h2 className="text-xl font-bold">Säsong {seasonYear}</h2>
                      <p className="text-sm text-gray-600">{leagues.length} turneringar</p>
                    </div>
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-2">Liga</th>
                              <th className="text-left py-2 px-2">League ID</th>
                              <th className="text-left py-2 px-2">Tournament ID</th>
                              <th className="text-left py-2 px-2">Start</th>
                              <th className="text-left py-2 px-2">Slut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leagues.map((league) => (
                              <tr key={league.leagueId} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-2 font-medium">{league.leagueName}</td>
                                <td className="py-3 px-2 font-mono text-xs">{league.leagueId}</td>
                                <td className="py-3 px-2">{league.tournamentId}</td>
                                <td className="py-3 px-2 text-gray-600">{league.startDate}</td>
                                <td className="py-3 px-2 text-gray-600">{league.endDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">How It Works</h3>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li>This system automatically discovers which leagues Östers IF participates in</li>
                <li>Click &ldquo;Refresh Cache&rdquo; to fetch the latest data from the SMC API</li>
                <li>The cache is stored in <code className="bg-yellow-100 px-1 rounded">src/data/league-cache.json</code></li>
                <li>Use the utility functions in <code className="bg-yellow-100 px-1 rounded">src/lib/leagueCache.ts</code> to access this data</li>
                <li>Recommended: Refresh weekly during season, monthly during off-season</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">No cache data available. Click &ldquo;Refresh Cache&rdquo; to fetch data.</p>
          </div>
        )}
      </div>
    </div>
  )
}
