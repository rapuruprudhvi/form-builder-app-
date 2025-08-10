'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import type { FormField, ValidationRule } from '@/store/form-builder-slice'

interface FormPreviewProps {
  fields: FormField[]
}

interface FormData {
  [key: string]: string | string[]
}

interface FormErrors {
  [key: string]: string
}

export function FormPreview({ fields }: FormPreviewProps) {
  const [formData, setFormData] = useState<FormData>({})
  const [errors, setErrors] = useState<FormErrors>({})

  // Initialize form data with default values
  useEffect(() => {
    const initialData: FormData = {}
    fields.forEach(field => {
      if (!field.isDerived && field.defaultValue) {
        initialData[field.id] = field.defaultValue
      }
    })
    setFormData(initialData)
  }, [fields])

  // Calculate derived fields
  useEffect(() => {
    const newFormData = { ...formData }
    
    fields.filter(field => field.isDerived).forEach(field => {
      if (field.parentFields && field.derivedFormula) {
        try {
          // Simple derived field calculation
          if (field.derivedFormula.includes('age') && field.parentFields.length > 0) {
            const parentValue = formData[field.parentFields[0]]
            if (parentValue && typeof parentValue === 'string') {
              const birthDate = new Date(parentValue)
              const age = new Date().getFullYear() - birthDate.getFullYear()
              newFormData[field.id] = age.toString()
            }
          } else {
            // For other formulas, you could implement a more sophisticated parser
            newFormData[field.id] = 'Calculated value'
          }
        } catch (error) {
          newFormData[field.id] = 'Error in calculation'
        }
      }
    })
    
    setFormData(newFormData)
  }, [formData, fields])

  const validateField = (field: FormField, value: string | string[]): string => {
    for (const rule of field.validationRules) {
      switch (rule.type) {
        case 'required':
          if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
            return rule.message
          }
          break
        case 'minLength':
          if (typeof value === 'string' && rule.value && value.length < rule.value) {
            return rule.message
          }
          break
        case 'maxLength':
          if (typeof value === 'string' && rule.value && value.length > rule.value) {
            return rule.message
          }
          break
        case 'email':
          if (typeof value === 'string' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return rule.message
          }
          break
        case 'password':
          if (typeof value === 'string' && value && (value.length < 8 || !/\d/.test(value))) {
            return rule.message
          }
          break
      }
    }
    return ''
  }

  const handleInputChange = (fieldId: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: FormErrors = {}
    
    fields.filter(field => !field.isDerived).forEach(field => {
      const error = validateField(field, formData[field.id] || '')
      if (error) {
        newErrors[field.id] = error
      }
    })
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!')
      console.log('Form data:', formData)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ''
    const error = errors[field.id]

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              value={value as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              disabled={field.isDerived}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              disabled={field.isDerived}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              disabled={field.isDerived}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value as string}
              onValueChange={(val) => handleInputChange(field.id, val)}
              disabled={field.isDerived}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              value={value as string}
              onValueChange={(val) => handleInputChange(field.id, val)}
              disabled={field.isDerived}
              className={error ? 'border border-red-500 rounded p-2' : ''}
            >
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                  <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className={`space-y-2 ${error ? 'border border-red-500 rounded p-2' : ''}`}>
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={(value as string[])?.includes(option) || false}
                    onCheckedChange={(checked) => {
                      const currentValues = (value as string[]) || []
                      if (checked) {
                        handleInputChange(field.id, [...currentValues, option])
                      } else {
                        handleInputChange(field.id, currentValues.filter(v => v !== option))
                      }
                    }}
                    disabled={field.isDerived}
                  />
                  <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              disabled={field.isDerived}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map(renderField)}
      
      <div className="flex justify-end pt-6">
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Submit Form
        </Button>
      </div>
    </form>
  )
}
