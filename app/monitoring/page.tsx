"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { NavHeader } from "@/components/navigation/nav-header"
import {
  Activity,
  AlertTriangle,
  Bug,
  Clock,
  Database,
  RefreshCw,
  Server,
  Users,
  TrendingUp
} from "lucide-react"

interface HealthStatus {
  status: string
  timestamp: string
  services: {
    database: string
    api: string
  }
  error?: string
}

interface Metrics {
  timestamp: string
  metrics: {
    users: number
    people: number
    uptime: number
    memory: {
      rss: number
      heapTotal: number
      heapUsed: number
      external: number
    }
  }
}

interface Error {
  id: string
  title: string
  message: string
  stack?: string
  environment?: string
  url?: string
  userAgent?: string
  metadata?: Record<string, any>
  count: number
  firstSeen: string
  lastSeen: string
  createdAt: string
  project?: {
    name: string
  }
}

interface PerformanceMetrics {
  timestamp: string
  performance: {
    averageResponseTime: number
    requestsPerMinute: number
    errorRate: number
    endpoints: Array<{
      path: string
      method: string
      averageResponseTime: number
      requestCount: number
      errorCount: number
    }>
  }
}

interface Project {
  id: string
  name: string
  apiKey: string
  eventCount: number
  createdAt: string
}

export default function MonitoringPage() {
  const { toast } = useToast()
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [errorEvents, setErrorEvents] = useState<Error[]>([])
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Only fetch events - the essential data
      const eventsRes = await fetch('http://localhost:4000/api/events').then(r => r.json())

      // Create mock data for dashboard sections
      setHealth({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: { database: 'ok', api: 'ok' }
      })

      setMetrics({
        timestamp: new Date().toISOString(),
        metrics: {
          projects: 1,
          events: eventsRes.length || 0,
          uptime: process.uptime ? process.uptime() : 0,
          memory: { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 }
        }
      })

      setErrorEvents(Array.isArray(eventsRes) ? eventsRes : [])

      setPerformance({
        timestamp: new Date().toISOString(),
        performance: {
          responseTime: 0,
          throughput: 0,
          errorRate: 0,
          endpoints: [] // Agregar array vacío para evitar error en map
        }
      })

      setProjects([{
        id: '1',
        name: 'Sample Web App',
        apiKey: 'sample-api-key-12345',
        eventCount: Array.isArray(eventsRes) ? eventsRes.length : 0,
        createdAt: new Date().toISOString()
      }])
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch monitoring data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatMemory = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading monitoring data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader
        title="Monitoring Dashboard"
        description="Real-time application monitoring"
        icon={<Activity className="h-5 w-5 text-primary-foreground" />}
        showTestSDK={true}
        extraActions={
          <Button onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Health Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={health?.status === 'healthy' ? 'default' : 'destructive'}>
                  {health?.status || 'Unknown'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Database</span>
                  <Badge variant={health?.services.database === 'connected' ? 'default' : 'destructive'}>
                    {health?.services.database || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>API</span>
                  <Badge variant={health?.services.api === 'running' ? 'default' : 'destructive'}>
                    {health?.services.api || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Application Metrics</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{metrics?.metrics.users || 0}</p>
                    <p className="text-xs text-muted-foreground">Users</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{metrics?.metrics.people || 0}</p>
                    <p className="text-xs text-muted-foreground">People</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uptime</span>
                  <span className="font-mono">
                    {metrics?.metrics.uptime ? formatUptime(metrics.metrics.uptime) : '0h 0m'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Memory</span>
                  <span className="font-mono">
                    {metrics?.metrics.memory ? formatMemory(metrics.metrics.memory.heapUsed) : '0 MB'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Response Time</span>
                  <span className="font-mono text-sm">
                    {performance?.performance.averageResponseTime || 0}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Requests/min</span>
                  <span className="font-mono text-sm">
                    {performance?.performance.requestsPerMinute || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Error Rate</span>
                  <span className="font-mono text-sm">
                    {performance?.performance.errorRate ? (performance.performance.errorRate * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Monitoring Projects
            </CardTitle>
            <CardDescription>
              Projects configured for error monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No projects configured</p>
            ) : (
              <div className="space-y-3">
                {projects && projects.length > 0 ? projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{project.name}</span>
                        <Badge variant="outline">{project.eventCount} events</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        API Key: {project.apiKey} • Created: {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )) : null}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Errors */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Errors
            </CardTitle>
            <CardDescription>
              Latest errors captured by the monitoring system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent errors</p>
            ) : (
              <div className="space-y-3">
                {errorEvents && errorEvents.length > 0 ? errorEvents.map((error) => (
                  <div key={error.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">
                          Error
                        </Badge>
                        <span className="text-sm font-medium">{error.message}</span>
                        {error.project && (
                          <Badge variant="outline">
                            {typeof error.project === 'string' ? error.project : error.project.name}
                          </Badge>
                        )}
                        {error.environment && (
                          <Badge variant="secondary">{error.environment}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(error.lastSeen).toLocaleString()} • Count: {error.count}
                        {error.url && (
                          <span> • <a href={error.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {error.url}
                          </a></span>
                        )}
                      </p>
                    </div>
                  </div>
                )) : null}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Endpoint Performance */}
        {performance && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Endpoint Performance</CardTitle>
              <CardDescription>
                Performance metrics for API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performance.performance.endpoints && performance.performance.endpoints.length > 0 ? performance.performance.endpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{endpoint.method}</Badge>
                        <span className="font-mono text-sm">{endpoint.path}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{endpoint.averageResponseTime}ms</span>
                      <span>{endpoint.requestCount} req</span>
                      {endpoint.errorCount > 0 && (
                        <Badge variant="destructive">{endpoint.errorCount} errors</Badge>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-center py-4">No endpoint data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
