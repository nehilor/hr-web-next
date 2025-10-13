"use client"

import { useState, useEffect, useCallback } from "react"
import { peopleService } from "@/lib/services/people"
import type { Person } from "@/lib/types"

export function usePeople(searchQuery = "") {
  const [people, setPeople] = useState<Person[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPeople = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await peopleService.getPeople(searchQuery)
      setPeople(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchPeople()
  }, [fetchPeople])

  const mutate = useCallback(() => {
    fetchPeople()
  }, [fetchPeople])

  return {
    people,
    isLoading,
    error,
    mutate,
  }
}

export function usePerson(id: string) {
  const [person, setPerson] = useState<Person | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    const fetchPerson = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await peopleService.getPerson(id)
        setPerson(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPerson()
  }, [id])

  return {
    person,
    isLoading,
    error,
  }
}
