"use client"

import { use } from "react"
import { usePerson } from "@/lib/hooks/use-people"
import { PersonForm } from "@/components/person-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { person, isLoading, error } = usePerson(id)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild>
            <Link href={ROUTES.HOME}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to People
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          {isLoading ? (
            <Card className="w-full max-w-2xl">
              <CardContent className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>Failed to load person details. Please try again.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={ROUTES.HOME}>Return to People</Link>
                </Button>
              </CardContent>
            </Card>
          ) : person ? (
            <PersonForm person={person} mode="edit" />
          ) : null}
        </div>
      </main>
    </div>
  )
}
