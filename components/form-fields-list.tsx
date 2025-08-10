'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { updateField, deleteField, reorderFields } from '@/store/form-builder-slice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FieldBuilder } from '@/components/field-builder'
import { Edit, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import type { FormField } from '@/store/form-builder-slice'

export function FormFieldsList() {
  const dispatch = useDispatch()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)
  const [editingField, setEditingField] = useState<FormField | null>(null)

  const handleUpdateField = (field: FormField) => {
    dispatch(updateField({ id: field.id, field }))
    setEditingField(null)
  }

  const handleDeleteField = (id: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      dispatch(deleteField(id))
    }
  }

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < currentForm.fields.length) {
      dispatch(reorderFields({ fromIndex: index, toIndex: newIndex }))
    }
  }

  return (
    <div className="space-y-4">
      {currentForm.fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveField(index, 'up')}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveField(index, 'down')}
                    disabled={index === currentForm.fields.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {field.label}
                    <Badge variant="outline">{field.type}</Badge>
                    {field.required && <Badge variant="destructive">Required</Badge>}
                    {field.isDerived && <Badge variant="secondary">Derived</Badge>}
                  </CardTitle>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingField(field)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteField(field.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              {field.defaultValue && (
                <p><strong>Default:</strong> {field.defaultValue}</p>
              )}
              {field.options && field.options.length > 0 && (
                <p><strong>Options:</strong> {field.options.join(', ')}</p>
              )}
              {field.validationRules.length > 0 && (
                <div>
                  <strong>Validations:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {field.validationRules.map((rule, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {rule.type}
                        {rule.value && `: ${rule.value}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {field.isDerived && (
                <div>
                  <p><strong>Parent Fields:</strong> {field.parentFields?.length || 0}</p>
                  {field.derivedFormula && (
                    <p><strong>Formula:</strong> {field.derivedFormula}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
          </DialogHeader>
          {editingField && (
            <FieldBuilder
              fieldType={editingField.type}
              onSave={handleUpdateField}
              onCancel={() => setEditingField(null)}
              existingFields={currentForm.fields}
              initialField={editingField}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
