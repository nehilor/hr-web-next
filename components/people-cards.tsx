"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Person } from "@/lib/types"
import { Edit, Mail, Trash2 } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"

interface PeopleCardsProps {
  people: Person[]
  onDelete: (person: Person) => void
}

export function PeopleCards({ people, onDelete }: PeopleCardsProps) {
  return (
    <div className="grid gap-4 md:hidden">
      {people.map((person) => (
        <Card key={person.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg leading-none">
                  {person.firstName} {person.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{person.position}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={ROUTES.PEOPLE_EDIT(person.id)} aria-label={`Edit ${person.firstName} ${person.lastName}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(person)}
                  aria-label={`Delete ${person.firstName} ${person.lastName}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${person.email}`} className="text-muted-foreground hover:text-foreground">
                {person.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <span className="text-muted-foreground">{person.department}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
