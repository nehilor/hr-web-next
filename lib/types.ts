export interface Event {
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
  timestamp?: string
  level?: string
  project?: string | {
    name: string
  }
}

export interface Project {
  id: string
  name: string
  apiKey: string
  eventCount: number
  createdAt: string
}

export interface HealthStatus {
  status: string
  timestamp: string
  services: {
    database: string
    api: string
  }
  error?: string
}

export interface Metrics {
  timestamp: string
  metrics: {
    projects: number
    events: number
    uptime: number
    memory: {
      rss: number
      heapTotal: number
      heapUsed: number
      external: number
    }
  }
}

export interface PerformanceMetrics {
  timestamp: string
  performance: {
    responseTime: number
    throughput: number
    errorRate: number
    endpoints?: Array<{
      method: string
      path: string
      averageResponseTime: number
      requestCount: number
      errorCount: number
    }>
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}