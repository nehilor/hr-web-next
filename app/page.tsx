"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PeopleTable } from "@/components/people-table"
import { PeopleCards } from "@/components/people-cards"
import { PeopleSkeleton } from "@/components/people-skeleton"
import { EmptyState } from "@/components/empty-state"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { peopleService } from "@/lib/services/people"
import { ROUTES, SEARCH_DEBOUNCE_MS } from "@/lib/constants"
import { usePeople } from "@/lib/hooks/use-people"
import { useAuth } from "@/hooks/use-auth"
import type { Person } from "@/lib/types"
import { Plus, Search, Users, LogOut } from "lucide-react"
import Link from "next/link"

export default function PeoplePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, clearToken } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null)

  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS)

  const { people, isLoading, mutate } = usePeople(debouncedSearch)

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await peopleService.deletePerson(deleteTarget.id)

      mutate()

      toast({
        title: "Person deleted",
        description: `${deleteTarget.firstName} ${deleteTarget.lastName} has been removed.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete person. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleLogout = () => {
    clearToken()
    router.push(ROUTES.LOGIN)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">People</h1>
                {user && (
                  <p className="text-sm text-muted-foreground">
                    Welcome, {user.firstName} {user.lastName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href={ROUTES.PEOPLE_NEW}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add person
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search people"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <PeopleSkeleton />
        ) : people.length === 0 ? (
          <EmptyState
            title={searchQuery ? "No results found" : "No people yet"}
            description={
              searchQuery
                ? "Try adjusting your search terms or filters."
                : "Get started by adding your first team member."
            }
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
          />
        ) : (
          <>
            <PeopleTable people={people} onDelete={setDeleteTarget} />
            <PeopleCards people={people} onDelete={setDeleteTarget} />
          </>
        )}
      </main>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete person"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  )
}
