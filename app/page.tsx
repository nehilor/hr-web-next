"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bug, Database, Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const auth = useAuth()
  const router = useRouter()

  // Handle case where auth context is not available
  if (!auth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    )
  }

  const { user, isLoading } = auth

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/monitoring")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Application Monitoring</h1>
                <p className="text-muted-foreground">Sentry-like error tracking and monitoring service</p>
              </div>
            </div>
                    <div className="flex items-center gap-2">
                      <Button asChild>
                        <Link href="/login">
                          <Activity className="mr-2 h-4 w-4" />
                          Sign In
                        </Link>
                      </Button>
                    </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Monitor Your Applications
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Capture, track, and analyze errors from your JavaScript applications with our
            comprehensive monitoring service.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-500" />
                Error Tracking
              </CardTitle>
              <CardDescription>
                Automatically capture and track JavaScript errors from your applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time error capture</li>
                <li>• Stack trace analysis</li>
                <li>• Error deduplication</li>
                <li>• Environment tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                Data Storage
              </CardTitle>
              <CardDescription>
                Secure and scalable storage for all your monitoring data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• PostgreSQL database</li>
                <li>• Event persistence</li>
                <li>• Project management</li>
                <li>• API key authentication</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Easy Integration
              </CardTitle>
              <CardDescription>
                Simple JavaScript SDK for quick integration with any web application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Lightweight SDK</li>
                <li>• REST API</li>
                <li>• CORS support</li>
                <li>• Real-time dashboard</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Get Started</h3>
          <p className="text-muted-foreground mb-6">
            Test the monitoring service or view the dashboard to see captured errors
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/login">
                <Activity className="mr-2 h-4 w-4" />
                Sign In to Access
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}