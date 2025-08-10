'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus } from 'lucide-react'
import type { FormField, ValidationRule } from '@/store/form-builder-slice'

interface FieldBuilderProps {
  fieldType: FormField['type']
  onSave: (field: FormField) => void
  onCancel: () => void
  existingFields: FormField[]
  initialField?: FormField
}

export function FieldBuilder({ fieldType, onSave, onCancel, existingFields, initialField }: FieldBuilderProps) {
  const [label, setLabel] = useState(initialField?.label || '')
  const [required, setRequired] = useState(initialField?.required || false)
  const [defaultValue, setDefaultValue] = useState(initialField?.defaultValue || '')
  const [options, setOptions] = useState<string[]>(initialField?.options || [])
  const [newOption, setNewOption] = useState('')
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(initialField?.validationRules || [])
  const [isDerived, setIsDerived] = useState(initialField?.isDerived || false)
  const [parentFields, setParentFields] = useState<string[]>(initialField?.parentFields || [])
  const [derivedFormula, setDerivedFormula] = useState(initialField?.derivedFormula || '')

  const needsOptions = ['select', 'radio', 'checkbox'].includes(fieldType)

  const addOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()])
      setNewOption('')
    }
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const addValidationRule = (type: ValidationRule['type']) => {
    const newRule: ValidationRule = {
      type,
      message: `Please provide a valid ${type}`,
    }
    
    if (type === 'minLength' || type === 'maxLength') {
      newRule.value = 1
    }
    
    setValidationRules([...validationRules, newRule])
  }

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const updated = [...validationRules]
    updated[index] = { ...updated[index], ...updates }
    setValidationRules(updated)
  }

  const removeValidationRule = (index: number) => {
    setValidationRules(validationRules.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!label.trim()) return

    const field: FormField = {
      id: initialField?.id || Date.now().toString(),
      type: fieldType,
      label: label.trim(),
      required,
      defaultValue,
      validationRules,
      ...(needsOptions && { options }),
      ...(isDerived && { isDerived, parentFields, derivedFormula }),
    }

    onSave(field)
  }

  const availableValidationTypes = [
    { value: 'required', label: 'Required' },
    { value: 'minLength', label: 'Minimum Length' },
    { value: 'maxLength', label: 'Maximum Length' },
    ...(fieldType === 'text' ? [{ value: 'email', label: 'Email Format' }] : []),
    ...(fieldType === 'text' ? [{ value: 'password', label: 'Password Rules' }] : []),
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="label">Field Label *</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter field label"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={required}
            onCheckedChange={setRequired}
          />
          <Label htmlFor="required">Required Field</Label>
        </div>
      </div>

      {!isDerived && (
        <div>
          <Label htmlFor="defaultValue">Default Value</Label>
          {fieldType === 'textarea' ? (
            <Textarea
              id="defaultValue"
              value={defaultValue as string}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="Enter default value"
            />
          ) : (
            <Input
              id="defaultValue"
              value={defaultValue as string}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="Enter default value"
              type={fieldType === 'number' ? 'number' : fieldType === 'date' ? 'date' : 'text'}
            />
          )}
        </div>
      )}

      {needsOptions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add option"
                onKeyPress={(e) => e.key === 'Enter' && addOption()}
              />
              <Button onClick={addOption} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{option}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validation Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {availableValidationTypes
              .filter(type => !validationRules.some(rule => rule.type === type.value))
              .map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  onClick={() => addValidationRule(type.value as ValidationRule['type'])}
                >
                  Add {type.label}
                </Button>
              ))}
          </div>
          
          <div className="space-y-3">
            {validationRules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <Badge variant="secondary">{rule.type}</Badge>
                {(rule.type === 'minLength' || rule.type === 'maxLength') && (
                  <Input
                    type="number"
                    value={rule.value || ''}
                    onChange={(e) => updateValidationRule(index, { value: parseInt(e.target.value) })}
                    className="w-20"
                    min="1"
                  />
                )}
                <Input
                  value={rule.message}
                  onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                  placeholder="Error message"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeValidationRule(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Switch
              checked={isDerived}
              onCheckedChange={setIsDerived}
            />
            Derived Field
          </CardTitle>
        </CardHeader>
        {isDerived && (
          <CardContent className="space-y-4">
            <div>
              <Label>Parent Fields</Label>
              <div className="space-y-2">
                {existingFields
                  .filter(field => !field.isDerived)
                  .map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={field.id}
                        checked={parentFields.includes(field.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setParentFields([...parentFields, field.id])
                          } else {
                            setParentFields(parentFields.filter(id => id !== field.id))
                          }
                        }}
                      />
                      <Label htmlFor={field.id}>{field.label}</Label>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <Label htmlFor="formula">Derived Formula/Logic</Label>
              <Textarea
                id="formula"
                value={derivedFormula}
                onChange={(e) => setDerivedFormula(e.target.value)}
                placeholder="e.g., Calculate age from date of birth: new Date().getFullYear() - new Date(parentField1).getFullYear()"
              />
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!label.trim()}>
          {initialField ? 'Update' : 'Add'} Field
        </Button>
      </div>
    </div>
  )
}
