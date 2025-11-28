'use client'

import { useState } from 'react'

const BASE_URL = 'https://smc-api.telenor.no'

interface EndpointTemplate {
  template: string
  description: string
  params: string[]
}

interface EndpointLevel {
  level: number
  label: string
  endpoints: EndpointTemplate[]
}

const ENDPOINT_LEVELS: EndpointLevel[] = [
  {
    level: -1,
    label: 'Fogis Context (ext-player-id support)',
    endpoints: [
      { template: '/fogis/leagues', description: '🔑 Fogis leagues (find ext-league-id)', params: [] },
      { template: '/fogis/leagues/{ext-league-id}/matches/{ext-match-id}/events/goal', description: '🎯 Fogis goal events (with ext-player-id)', params: ['ext-league-id', 'ext-match-id'] },
    ],
  },
  {
    level: 0,
    label: 'Level 0',
    endpoints: [
      { template: '/leagues', description: 'All leagues', params: [] },
      { template: '/leagues/{league-id}/arenas', description: 'League arenas', params: ['league-id'] },
      { template: '/leagues/{league-id}/matches', description: 'League matches', params: ['league-id'] },
      { template: '/leagues/{league-id}/teams', description: 'League teams', params: ['league-id'] },
      { template: '/leagues/{league-id}/players', description: 'League players', params: ['league-id'] },
      { template: '/leagues/{league-id}/referees', description: 'League referees', params: ['league-id'] },
    ],
  },
  {
    level: 1,
    label: 'Level 1',
    endpoints: [
      { template: '/leagues/{league-id}/standings', description: 'League standings', params: ['league-id'] },
      { template: '/leagues/{league-id}/matches/{match-id}', description: 'Single match details', params: ['league-id', 'match-id'] },
    ],
  },
  {
    level: 2,
    label: 'Level 2',
    endpoints: [
      { template: '/leagues/{league-id}/matches/{match-id}/events', description: 'Match events', params: ['league-id', 'match-id'] },
      { template: '/leagues/{league-id}/players/{player-id}', description: 'Single player details', params: ['league-id', 'player-id'] },
    ],
  },
  {
    level: 3,
    label: 'Level 3',
    endpoints: [
      { template: '/leagues/{league-id}/matches/{match-id}/live-stats', description: 'Match live stats', params: ['league-id', 'match-id'] },
    ],
  },
  {
    level: 5,
    label: 'Level 5',
    endpoints: [
      { template: '/leagues/{league-id}/matches/{match-id}/live-tracking/stats/team', description: 'Team live tracking stats', params: ['league-id', 'match-id'] },
    ],
  },
  {
    level: 6,
    label: 'Level 6',
    endpoints: [
      { template: '/leagues/{league-id}/matches/{match-id}/live-tracking/stats/individual', description: 'Individual live tracking stats', params: ['league-id', 'match-id'] },
    ],
  },
]

export default function NewSmcTestPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('/fogis/leagues')
  const [paramValues, setParamValues] = useState<Record<string, string>>({
    'league-id': '1',
    'match-id': '',
    'player-id': '',
    'ext-league-id': '',
    'ext-match-id': '6143389',
  })
  const [queryParams, setQueryParams] = useState<string>('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)

  const buildEndpoint = (template: string): string => {
    let endpoint = template
    Object.entries(paramValues).forEach(([key, value]) => {
      endpoint = endpoint.replace(`{${key}}`, value)
    })
    return endpoint
  }

  const getRequiredParams = (template: string): string[] => {
    const matches = template.match(/\{([^}]+)\}/g)
    return matches ? matches.map(m => m.slice(1, -1)) : []
  }

  const fetchData = async (endpointToFetch: string) => {
    setLoading(true)
    setError(null)
    setResponse(null)
    setStatusCode(null)

    try {
      const apiKey = process.env.NEXT_PUBLIC_SMC_SECRET || ''

      if (!apiKey) {
        throw new Error('API Key not found. Please set NEXT_PUBLIC_SMC_SECRET in your .env file')
      }

      // Add query parameters if provided
      let url = `${BASE_URL}${endpointToFetch}`
      if (queryParams.trim()) {
        const separator = url.includes('?') ? '&' : '?'
        url = `${url}${separator}${queryParams}`
      }

      console.log('🌐 Fetching URL:', url)

      const res = await fetch(url, {
        headers: {
          'Authorization': apiKey,
        },
      })

      setStatusCode(res.status)

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`)
      }

      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleFetch = () => {
    const endpoint = buildEndpoint(selectedTemplate)

    // Check if any required parameters are empty
    const requiredParams = getRequiredParams(selectedTemplate)
    const missingParams = requiredParams.filter(param => !paramValues[param]?.trim())

    if (missingParams.length > 0) {
      setError(`Missing required parameters: ${missingParams.join(', ')}`)
      setStatusCode(null)
      setResponse(null)
      return
    }

    fetchData(endpoint)
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
  }

  const handleParamChange = (param: string, value: string) => {
    setParamValues(prev => ({ ...prev, [param]: value }))
  }

  const currentEndpoint = buildEndpoint(selectedTemplate)
  const requiredParams = getRequiredParams(selectedTemplate)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">New SMC API Testing</h1>

        {/* API Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">API Information</h2>
          <p className="text-sm text-blue-800"><strong>Base URL:</strong> {BASE_URL}</p>
          <p className="text-sm text-blue-800 mt-1">
            <strong>API Key Status:</strong> {process.env.NEXT_PUBLIC_SMC_SECRET ? '✓ Configured' : '✗ Missing'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Endpoint Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Select Endpoint by Level</h2>

              <div className="space-y-6">
                {ENDPOINT_LEVELS.map((level) => (
                  <div key={level.level} className="border-b pb-4 last:border-b-0">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                      {level.label}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {level.endpoints.map((endpoint) => (
                        <button
                          key={endpoint.template}
                          onClick={() => handleTemplateSelect(endpoint.template)}
                          className={`text-left px-4 py-3 rounded transition-colors ${
                            selectedTemplate === endpoint.template
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="font-medium text-sm font-mono">
                            {endpoint.template}
                          </div>
                          <div className={`text-xs mt-1 ${
                            selectedTemplate === endpoint.template ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {endpoint.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Parameters & Fetch */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Parameters</h2>

              {/* Parameter Inputs */}
              <div className="space-y-4 mb-6">
                <div className="border-b pb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Query Parameters (optional)
                  </label>
                  <input
                    type="text"
                    value={queryParams}
                    onChange={(e) => setQueryParams(e.target.value)}
                    placeholder="e.g., home-team-id=01JVVHS4ESCV6K0GYXXB0K1NHS"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Add query params like: param1=value1&param2=value2</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    League ID
                  </label>
                  <input
                    type="text"
                    value={paramValues['league-id']}
                    onChange={(e) => handleParamChange('league-id', e.target.value)}
                    placeholder="e.g., 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Match ID
                  </label>
                  <input
                    type="text"
                    value={paramValues['match-id']}
                    onChange={(e) => handleParamChange('match-id', e.target.value)}
                    placeholder="e.g., 12345"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Player ID
                  </label>
                  <input
                    type="text"
                    value={paramValues['player-id']}
                    onChange={(e) => handleParamChange('player-id', e.target.value)}
                    placeholder="e.g., 67890"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-xs font-semibold text-blue-600 mb-3">Fogis Context Parameters</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ext League ID (Fogis)
                      </label>
                      <input
                        type="text"
                        value={paramValues['ext-league-id']}
                        onChange={(e) => handleParamChange('ext-league-id', e.target.value)}
                        placeholder="e.g., 101 (find using /fogis/leagues)"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ext Match ID (Fogis)
                      </label>
                      <input
                        type="text"
                        value={paramValues['ext-match-id']}
                        onChange={(e) => handleParamChange('ext-match-id', e.target.value)}
                        placeholder="e.g., 6143389"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Endpoint Display */}
              <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">Current Endpoint:</p>
                <p className="text-sm font-mono text-gray-900 break-all">{currentEndpoint}</p>
                {requiredParams.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Required: {requiredParams.join(', ')}
                  </p>
                )}
              </div>

              {/* Fetch Button */}
              <button
                onClick={handleFetch}
                disabled={loading}
                className="w-full bg-green-600 text-white px-6 py-3 rounded font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Fetching...' : 'Fetch Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Response Display */}
        {(statusCode || error) && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Response</h2>
              {statusCode && (
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  statusCode >= 200 && statusCode < 300
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  Status: {statusCode}
                </span>
              )}
            </div>

            <div className="mb-3 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-1">Request URL:</p>
              <p className="text-sm font-mono text-gray-900 break-all">{BASE_URL}{currentEndpoint}</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                <p className="text-red-800 font-medium">Error:</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}

            {response && (
              <div>
                {/* Response Summary */}
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {Array.isArray(response) ? 'Array' : typeof response}
                    {Array.isArray(response) && ` (${response.length} items)`}
                  </p>
                </div>

                {/* JSON Display */}
                <div className="bg-gray-900 rounded overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                    <span className="text-sm text-gray-300 font-mono">JSON Response</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(response, null, 2))}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 overflow-auto max-h-[600px] text-sm">
                    <code className="text-gray-100">
                      {JSON.stringify(response, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
