'use client'

import { useState } from 'react'

const BASE_URL = 'https://api.sportomedia.se/v1'

interface EndpointConfig {
  name: string
  path: string
  method: 'GET'
  params: { name: string; placeholder: string; required: boolean }[]
  description: string
}

const ENDPOINTS: EndpointConfig[] = [
  {
    name: 'Status',
    path: '/status',
    method: 'GET',
    params: [],
    description: 'Check status of service'
  },
  {
    name: 'Squad',
    path: '/squad/{teamId}/{year}',
    method: 'GET',
    params: [
      { name: 'teamId', placeholder: 'e.g., 12345', required: true },
      { name: 'year', placeholder: 'e.g., 2025', required: true }
    ],
    description: 'Get squad for a team and year'
  },
  {
    name: 'Matches (List)',
    path: '/matches/{league}/{season}',
    method: 'GET',
    params: [
      { name: 'league', placeholder: 'e.g., allsvenskan', required: true },
      { name: 'season', placeholder: 'e.g., 2025', required: true }
    ],
    description: 'Get all matches for a league and season'
  },
  {
    name: 'Match (Single)',
    path: '/matches/{league}/{season}/{id}',
    method: 'GET',
    params: [
      { name: 'league', placeholder: 'e.g., allsvenskan', required: true },
      { name: 'season', placeholder: 'e.g., 2025', required: true },
      { name: 'id', placeholder: 'e.g., 123456', required: true }
    ],
    description: 'Get a single match by ID'
  },
  {
    name: 'Lineups',
    path: '/lineups/{league}/{season}/{matchId}',
    method: 'GET',
    params: [
      { name: 'league', placeholder: 'e.g., allsvenskan', required: true },
      { name: 'season', placeholder: 'e.g., 2025', required: true },
      { name: 'matchId', placeholder: 'e.g., 123456', required: true }
    ],
    description: 'Get lineups for a match'
  },
  {
    name: 'Staff',
    path: '/staff/{teamId}/{season}',
    method: 'GET',
    params: [
      { name: 'teamId', placeholder: 'e.g., 12345', required: true },
      { name: 'season', placeholder: 'e.g., 2025', required: true }
    ],
    description: 'Get staff for a team and season'
  },
  {
    name: 'Team Statistics',
    path: '/statistics/teams/{league}/{season}',
    method: 'GET',
    params: [
      { name: 'league', placeholder: 'e.g., allsvenskan', required: true },
      { name: 'season', placeholder: 'e.g., 2025', required: true }
    ],
    description: 'Get team statistics for a league and season'
  },
  {
    name: 'Player Statistics',
    path: '/statistics/players/{league}/{season}',
    method: 'GET',
    params: [
      { name: 'league', placeholder: 'e.g., allsvenskan', required: true },
      { name: 'season', placeholder: 'e.g., 2025', required: true }
    ],
    description: 'Get player statistics for a league and season'
  },
  {
    name: 'Match Statistics',
    path: '/statistics/matchstats/{league}/{season}/{matchId}',
    method: 'GET',
    params: [
      { name: 'league', placeholder: 'e.g., allsvenskan', required: true },
      { name: 'season', placeholder: 'e.g., 2025', required: true },
      { name: 'matchId', placeholder: 'e.g., 123456', required: true }
    ],
    description: 'Get statistics for a specific match'
  },
  {
    name: 'Standings',
    path: '/standings/{league}/{season}/{type}',
    method: 'GET',
    params: [
      { name: 'league', placeholder: 'e.g., allsvenskan', required: true },
      { name: 'season', placeholder: 'e.g., 2025', required: true },
      { name: 'type', placeholder: 'e.g., total', required: true }
    ],
    description: 'Get standings for a league, season, and type'
  }
]

export default function TestSportomediaPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointConfig>(ENDPOINTS[0])
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [responseInfo, setResponseInfo] = useState<{
    status: number
    statusText: string
    headers: Record<string, string>
  } | null>(null)
  const [authType, setAuthType] = useState<'bearer' | 'apikey' | 'basic'>('bearer')

  const handleEndpointChange = (endpoint: EndpointConfig) => {
    setSelectedEndpoint(endpoint)
    setParamValues({})
    setResult(null)
    setError(null)
    setResponseInfo(null)
  }

  const handleParamChange = (paramName: string, value: string) => {
    setParamValues(prev => ({ ...prev, [paramName]: value }))
  }

  const buildUrl = () => {
    let url = selectedEndpoint.path
    selectedEndpoint.params.forEach(param => {
      const value = paramValues[param.name] || ''
      url = url.replace(`{${param.name}}`, value)
    })
    return `${BASE_URL}${url}`
  }

  const testEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setResponseInfo(null)

    try {
      const apiKey = process.env.NEXT_PUBLIC_SUPERADMIN_KEY || 'ZCgtjJP7armWXt7NM2f6'

      const url = buildUrl()
      console.log('🔍 Testing endpoint:', url)
      console.log('🔑 Using API Key:', apiKey ? '***' + apiKey.slice(-4) : 'MISSING')

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      // Add authentication based on selected type
      if (authType === 'bearer') {
        headers['Authorization'] = `Bearer ${apiKey}`
      } else if (authType === 'apikey') {
        headers['x-api-key'] = apiKey
      } else if (authType === 'basic') {
        headers['Authorization'] = `Basic ${btoa(apiKey)}`
      }

      const response = await fetch(url, {
        method: selectedEndpoint.method,
        headers
      })

      // Capture response info
      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      setResponseInfo({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      setResult(data)
      console.log('✅ Response:', data)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('❌ Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const canTest = selectedEndpoint.params.every(param =>
    !param.required || paramValues[param.name]?.trim()
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Sportomedia API Tester</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Endpoint Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Endpoints</h2>
              <div className="space-y-2">
                {ENDPOINTS.map((endpoint) => (
                  <button
                    key={endpoint.name}
                    onClick={() => handleEndpointChange(endpoint)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedEndpoint.name === endpoint.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium">{endpoint.name}</div>
                    <div className={`text-xs mt-1 ${
                      selectedEndpoint.name === endpoint.name ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {endpoint.method}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">{selectedEndpoint.name}</h2>
              <p className="text-gray-600 mb-4">{selectedEndpoint.description}</p>

              <div className="bg-gray-900 rounded p-3 mb-4">
                <code className="text-sm text-green-400">
                  {selectedEndpoint.method} {selectedEndpoint.path}
                </code>
              </div>

              {/* Auth Type Selection */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Authentication Type</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAuthType('bearer')}
                    className={`px-3 py-1 rounded text-sm ${
                      authType === 'bearer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Bearer Token
                  </button>
                  <button
                    onClick={() => setAuthType('apikey')}
                    className={`px-3 py-1 rounded text-sm ${
                      authType === 'apikey'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    x-api-key
                  </button>
                  <button
                    onClick={() => setAuthType('basic')}
                    className={`px-3 py-1 rounded text-sm ${
                      authType === 'basic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Basic Auth
                  </button>
                </div>
              </div>

              {selectedEndpoint.params.length > 0 && (
                <div className="space-y-3 mb-4">
                  <h3 className="font-medium text-gray-900">Parameters</h3>
                  {selectedEndpoint.params.map(param => (
                    <div key={param.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {param.name}
                        {param.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type="text"
                        value={paramValues[param.name] || ''}
                        onChange={(e) => handleParamChange(param.name, e.target.value)}
                        placeholder={param.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-xs font-medium text-blue-900 mb-1">Request URL:</p>
                <code className="text-xs text-blue-700 break-all">{buildUrl()}</code>
              </div>

              <button
                onClick={testEndpoint}
                disabled={loading || !canTest}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Testing...' : 'Test Endpoint'}
              </button>
            </div>

            {/* Response Info */}
            {responseInfo && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Response Info</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className={`p-3 rounded ${
                    responseInfo.status >= 200 && responseInfo.status < 300
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className="text-xs text-gray-600">Status</p>
                    <p className={`text-lg font-bold ${
                      responseInfo.status >= 200 && responseInfo.status < 300
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {responseInfo.status} {responseInfo.statusText}
                    </p>
                  </div>
                  <div className="p-3 rounded bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-600">Headers Count</p>
                    <p className="text-lg font-bold text-gray-900">
                      {Object.keys(responseInfo.headers).length}
                    </p>
                  </div>
                </div>
                <details className="mb-2">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    View Response Headers
                  </summary>
                  <div className="mt-2 bg-gray-900 rounded p-3">
                    <pre className="text-xs text-gray-100 overflow-auto">
                      {JSON.stringify(responseInfo.headers, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
                <p className="text-red-700 font-mono text-sm">{error}</p>
              </div>
            )}

            {/* Result Display */}
            {result && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Response Data</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      Copy JSON
                    </button>
                  </div>
                </div>

                {/* Data Summary */}
                {Array.isArray(result) && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Array with {result.length} items</span>
                    </p>
                  </div>
                )}

                {typeof result === 'object' && !Array.isArray(result) && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Object with {Object.keys(result).length} keys</span>
                    </p>
                  </div>
                )}

                {/* Raw JSON */}
                <div className="bg-gray-900 rounded overflow-hidden">
                  <pre className="p-4 overflow-auto max-h-96 text-xs">
                    <code className="text-gray-100">{JSON.stringify(result, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">API Information</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold">Base URL:</span> {BASE_URL}</p>
            <p><span className="font-semibold">Authentication:</span> {authType === 'bearer' ? 'Bearer Token' : authType === 'apikey' ? 'x-api-key Header' : 'Basic Auth'} (SUPERADMIN_KEY)</p>
            <p><span className="font-semibold">Content-Type:</span> application/json</p>
            <p className="text-xs text-gray-500 mt-2">Try different authentication types using the buttons above if you get 401 errors</p>
          </div>
        </div>
      </div>
    </div>
  )
}
