"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Person } from "@/lib/types"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"

interface PeopleTableProps {
  people: Person[]
  onDelete: (person: Person) => void
}

export function PeopleTable({ people, onDelete }: PeopleTableProps) {
  return (
    <div className="hidden md:block rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Position</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((person) => (
            <TableRow key={person.id}>
              <TableCell className="font-medium">
                {person.firstName} {person.lastName}
              </TableCell>
              <TableCell className="text-muted-foreground">{person.email}</TableCell>
              <TableCell>{person.department}</TableCell>
              <TableCell>{person.position}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={ROUTES.PEOPLE_EDIT(person.id)}
                      aria-label={`Edit ${person.firstName} ${person.lastName}`}
                    >
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
