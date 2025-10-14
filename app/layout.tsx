import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "HR Management System",
  description: "Manage your team efficiently",
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
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Providers>{children}</Providers>
          </Suspense>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
