"use client"

import { useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/form-field"
import { authService } from "@/lib/services/auth"
import { useAuth } from "@/hooks/use-auth"
import { validateLoginForm } from "@/lib/validations"
import { ROUTES } from "@/lib/constants"
import { Building2 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")

  // Check if token expired
  const isExpired = searchParams.get("expired") === "true"

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setApiError("")

    // Client-side validation
    const validationErrors = validateLoginForm({ email, password })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await authService.login({ email, password })

      // Store token in memory state
      setToken(response.accessToken)

      // Store token in cookie for middleware
      document.cookie = `auth-token=${response.accessToken}; path=/; max-age=86400; SameSite=Strict`

      // Redirect to original destination or home
      const from = searchParams.get("from") || ROUTES.HOME
      router.push(from)
    } catch (error) {
      const err = error as { message?: string }
      setApiError(err.message || "Invalid credentials. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">HR Management System</CardTitle>
          <CardDescription className="text-balance">Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {isExpired && (
              <div
                className="rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800"
                role="alert"
              >
                Your session has expired. Please sign in again.
              </div>
            )}

            {apiError && (
              <div
                className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {apiError}
              </div>
            )}

            <FormField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              required
              placeholder="you@company.com"
              autoComplete="email"
            />

            <FormField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
