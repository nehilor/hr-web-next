import { PersonForm } from "@/components/person-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"

export default function NewPersonPage() {
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
          <PersonForm mode="create" />
        </div>
      </main>
    </div>
  )
}
