"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { apiService } from "@/lib/services/api"
import {
  Activity,
  AlertTriangle,
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
  message: string
  level: string
  timestamp: string
  count: number
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

export default function MonitoringPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [errors, setErrors] = useState<Error[]>([])
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?from=/monitoring')
    }
  }, [isAuthenticated, authLoading, router])

  const fetchData = async () => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)

      const [healthRes, metricsRes, errorsRes, performanceRes] = await Promise.all([
        apiService.get<HealthStatus>('/monitoring/health'),
        apiService.get<Metrics>('/monitoring/metrics'),
        apiService.get<{ errors: Error[] }>('/monitoring/errors'),
        apiService.get<PerformanceMetrics>('/monitoring/performance'),
      ])

      setHealth(healthRes)
      setMetrics(metricsRes)
      setErrors(errorsRes.errors)
      setPerformance(performanceRes)
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch monitoring data. Please check your authentication.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()

      // Refresh data every 30 seconds
      const interval = setInterval(fetchData, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatMemory = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-destructive" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
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
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Monitoring Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time application monitoring</p>
              </div>
            </div>
            <Button onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

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
            {errors.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent errors</p>
            ) : (
              <div className="space-y-3">
                {errors.map((error) => (
                  <div key={error.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={error.level === 'error' ? 'destructive' : 'secondary'}>
                          {error.level}
                        </Badge>
                        <span className="text-sm font-medium">{error.message}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(error.timestamp).toLocaleString()} • Count: {error.count}
                      </p>
                    </div>
                  </div>
                ))}
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
                {performance.performance.endpoints.map((endpoint, index) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
