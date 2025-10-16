"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavHeader } from "@/components/navigation/nav-header"
import { AuthGuard } from "@/components/auth-guard"
import { Bug, CheckCircle, XCircle, Activity } from "lucide-react"
import Link from "next/link"

// Client SDK (inline for simplicity)
class MonitoringSDK {
  private config: {
    dsn: string
    apiKey: string
    release: string
    env: string
    debug: boolean
    enabled: boolean
  }

  constructor(config: {
    dsn: string
    apiKey: string
    release?: string
    env?: string
    debug?: boolean
  }) {
    this.config = {
      dsn: config.dsn,
      apiKey: config.apiKey,
      release: config.release || '1.0.0',
      env: config.env || 'development',
      debug: config.debug || false,
      enabled: !!(config.dsn && config.apiKey),
    }
  }

  async sendEvent(event: any, retries = 0): Promise<{ success: boolean; error?: string }> {
    if (!this.config.enabled) {
      return { success: false, error: 'SDK not enabled' }
    }

    const payload = {
      ...event,
      release: event.release || this.config.release,
      env: event.env || this.config.env,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    }

    try {
      const response = await fetch(this.config.dsn, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
        },
        body: JSON.stringify(payload),
      })

      if (response.status === 202) {
        return { success: true }
      } else {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    } catch (error: any) {
      if (retries < 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return this.sendEvent(event, retries + 1)
      } else {
        return { success: false, error: error.message }
      }
    }
  }

  captureException(error: Error, context: any = {}) {
    if (!this.config.enabled) return Promise.resolve({ success: false })

    const event = {
      title: error.name || 'Error',
      message: error.message || 'An unknown error occurred',
      stack: error.stack,
      metadata: context,
    }
    return this.sendEvent(event)
  }

  captureMessage(message: string, level = 'info', context: any = {}) {
    if (!this.config.enabled) return Promise.resolve({ success: false })

    const event = {
      title: message,
      message: message,
      metadata: { ...context, level: level },
    }
    return this.sendEvent(event)
  }
}

export default function TestPage() {
  const [results, setResults] = useState<Array<{
    id: string
    test: string
    success: boolean
    error?: string
    timestamp: string
  }>>([])

  const API_BASE_URL = 'http://localhost:4000/api/events'
  const API_KEY = 'sample-api-key-12345'

  const sdk = new MonitoringSDK({
    dsn: API_BASE_URL,
    apiKey: API_KEY,
    release: '1.0.0-test',
    env: 'test',
    debug: true,
  })

  return (
    <AuthGuard>
      <TestPageContent results={results} setResults={setResults} sdk={sdk} />
    </AuthGuard>
  )
}

function TestPageContent({
  results,
  setResults,
  sdk
}: {
  results: Array<{ id: string; test: string; success: boolean; error?: string; timestamp: string }>
  setResults: React.Dispatch<React.SetStateAction<Array<{ id: string; test: string; success: boolean; error?: string; timestamp: string }>>>
  sdk: MonitoringSDK
}) {

  const addResult = (test: string, success: boolean, error?: string) => {
    const result = {
      id: Date.now().toString(),
      test,
      success,
      error,
      timestamp: new Date().toLocaleTimeString(),
    }
    setResults(prev => [result, ...prev])
  }

  const testBasicError = async () => {
    try {
      throw new Error('This is a basic test error!')
    } catch (e) {
      const result = await sdk.captureException(e as Error)
      addResult('Basic Error', result.success, result.error)
    }
  }

  const testTypeError = async () => {
    try {
      const obj: any = {}
      obj.method() // This will cause a TypeError
    } catch (e) {
      const result = await sdk.captureException(e as Error)
      addResult('TypeError', result.success, result.error)
    }
  }

  const testReferenceError = async () => {
    try {
      // @ts-ignore
      nonExistentFunction() // This will cause a ReferenceError
    } catch (e) {
      const result = await sdk.captureException(e as Error)
      addResult('Reference Error', result.success, result.error)
    }
  }

  const testCustomError = async () => {
    class CustomError extends Error {
      constructor(message: string, public code: number) {
        super(message)
        this.name = 'CustomError'
      }
    }
    const customError = new CustomError('Something went wrong in the custom module', 500)
    const result = await sdk.captureException(customError, {
      component: 'CustomModule',
      severity: 'high',
    })
    addResult('Custom Error', result.success, result.error)
  }

  const testPromiseRejection = async () => {
    try {
      await Promise.reject('This is an unhandled promise rejection!')
    } catch (e) {
      const result = await sdk.captureException(new Error(String(e)))
      addResult('Promise Rejection', result.success, result.error)
    }
  }

  const testInfoMessage = async () => {
    const result = await sdk.captureMessage('User logged in successfully', 'info', { userId: 'user-123' })
    addResult('Info Message', result.success, result.error)
  }

  const testWarningMessage = async () => {
    const result = await sdk.captureMessage('High memory usage detected', 'warning', { threshold: '80%' })
    addResult('Warning Message', result.success, result.error)
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader
        title="SDK Test Page"
        description="Test the monitoring SDK functionality"
        icon={<Bug className="h-5 w-5 text-primary-foreground" />}
        showDashboard={true}
      />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
              <CardDescription>
                Click the buttons below to test different types of errors and messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={testBasicError} variant="outline" size="sm">
                  <Bug className="mr-2 h-4 w-4" />
                  Basic Error
                </Button>
                <Button onClick={testTypeError} variant="outline" size="sm">
                  <Bug className="mr-2 h-4 w-4" />
                  TypeError
                </Button>
                <Button onClick={testReferenceError} variant="outline" size="sm">
                  <Bug className="mr-2 h-4 w-4" />
                  Reference Error
                </Button>
                <Button onClick={testCustomError} variant="outline" size="sm">
                  <Bug className="mr-2 h-4 w-4" />
                  Custom Error
                </Button>
                <Button onClick={testPromiseRejection} variant="outline" size="sm">
                  <Bug className="mr-2 h-4 w-4" />
                  Promise Rejection
                </Button>
                <Button onClick={testInfoMessage} variant="outline" size="sm">
                  <Bug className="mr-2 h-4 w-4" />
                  Info Message
                </Button>
                <Button onClick={testWarningMessage} variant="outline" size="sm">
                  <Bug className="mr-2 h-4 w-4" />
                  Warning Message
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button asChild className="w-full">
                  <Link href="/monitoring">
                    <Activity className="mr-2 h-4 w-4" />
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Results from the SDK tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No tests run yet. Click a button above to start testing.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{result.test}</p>
                          {result.error && (
                            <p className="text-sm text-red-500">{result.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "Success" : "Failed"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{result.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Make sure your backend API is running on <code className="bg-muted px-1 rounded">http://localhost:4000</code></p>
              <p>• Open your browser's developer console (F12) to see SDK debug logs</p>
              <p>• After sending errors, click "View Dashboard" to see them appear</p>
              <p>• The API Key used is: <code className="bg-muted px-1 rounded">sample-api-key-12345</code></p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
