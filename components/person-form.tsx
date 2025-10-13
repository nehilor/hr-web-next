"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/form-field"
import { FormActions } from "@/components/form-actions"
import { useToast } from "@/hooks/use-toast"
import { peopleService } from "@/lib/services/people"
import { validatePersonForm } from "@/lib/validations"
import { ROUTES } from "@/lib/constants"
import type { Person, PersonFormData } from "@/lib/types"

interface PersonFormProps {
  person?: Person
  mode: "create" | "edit"
}

export function PersonForm({ person, mode }: PersonFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<PersonFormData>({
    firstName: person?.firstName || "",
    lastName: person?.lastName || "",
    email: person?.email || "",
    position: person?.position || "",
    department: person?.department || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof PersonFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationErrors = validatePersonForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === "create") {
        await peopleService.createPerson(formData)
        toast({
          title: "Person created",
          description: `${formData.firstName} ${formData.lastName} has been added successfully.`,
        })
      } else if (person) {
        await peopleService.updatePerson(person.id, formData)
        toast({
          title: "Person updated",
          description: `${formData.firstName} ${formData.lastName} has been updated successfully.`,
        })
      }

      router.push(ROUTES.HOME)
    } catch (error) {
      const err = error as { message?: string }
      toast({
        title: "Error",
        description: err.message || `Failed to ${mode} person. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(ROUTES.HOME)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">{mode === "create" ? "Add New Person" : "Edit Person"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Enter the details of the new team member."
            : "Update the information for this team member."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              id="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={(value) => updateField("firstName", value)}
              error={errors.firstName}
              required
              placeholder="John"
              autoComplete="given-name"
            />

            <FormField
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => updateField("lastName", value)}
              error={errors.lastName}
              required
              placeholder="Doe"
              autoComplete="family-name"
            />
          </div>

          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => updateField("email", value)}
            error={errors.email}
            required
            placeholder="john.doe@company.com"
            autoComplete="email"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              id="position"
              label="Position"
              value={formData.position}
              onChange={(value) => updateField("position", value)}
              error={errors.position}
              required
              placeholder="Software Engineer"
              autoComplete="organization-title"
            />

            <FormField
              id="department"
              label="Department"
              value={formData.department}
              onChange={(value) => updateField("department", value)}
              error={errors.department}
              required
              placeholder="Engineering"
              autoComplete="organization"
            />
          </div>

          <FormActions
            onCancel={handleCancel}
            submitLabel={mode === "create" ? "Create Person" : "Save Changes"}
            isSubmitting={isSubmitting}
          />
        </form>
      </CardContent>
    </Card>
  )
}
