"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, ArrowLeft, Bug, LogOut } from "lucide-react"
import React from "react"
import { useAuth } from "@/lib/auth-context"

interface NavHeaderProps {
  title: string
  description: string
  icon: React.ReactNode
  showTestSDK?: boolean
  showDashboard?: boolean
  extraActions?: React.ReactNode
}

export function NavHeader({
  title,
  description,
  icon,
  showTestSDK = false,
  showDashboard = false,
  extraActions,
}: NavHeaderProps) {
  const auth = useAuth()

  // Handle case where auth context is not available
  if (!auth) {
    return (
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  {icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const { user, logout } = auth
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                {icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-2 mr-4">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
            {showTestSDK && (
              <Button asChild variant="outline" size="sm">
                <Link href="/test">
                  <Bug className="mr-2 h-4 w-4" />
                  Test SDK
                </Link>
              </Button>
            )}
            {showDashboard && (
              <Button asChild variant="outline" size="sm">
                <Link href="/monitoring">
                  <Activity className="mr-2 h-4 w-4" />
                  View Dashboard
                </Link>
              </Button>
            )}
            {extraActions}
          </div>
        </div>
      </div>
    </header>
  )
}