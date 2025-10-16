import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Application Monitoring Service",
  description: "Sentry-like error tracking and monitoring service",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
