'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { addField, loadSavedForms, saveForm, clearCurrentForm } from '@/store/form-builder-slice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FieldBuilder } from '@/components/field-builder'
import { FormFieldsList } from '@/components/form-fields-list'
import { Plus, Save, Trash2 } from 'lucide-react'
import type { FormField } from '@/store/form-builder-slice'

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
] as const

export default function CreatePage() {
  const dispatch = useDispatch()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [formName, setFormName] = useState('')

  useEffect(() => {
    dispatch(loadSavedForms())
  }, [dispatch])

  const handleAddField = (field: FormField) => {
    dispatch(addField(field))
    setIsAddFieldOpen(false)
  }

  const handleSaveForm = () => {
    if (formName.trim() && currentForm.fields.length > 0) {
      dispatch(saveForm(formName.trim()))
      setFormName('')
      setIsSaveDialogOpen(false)
      alert('Form saved successfully!')
    }
  }

  const handleClearForm = () => {
    if (confirm('Are you sure you want to clear the current form?')) {
      dispatch(clearCurrentForm())
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Form</h1>
          <p className="text-gray-600 mt-2">Build dynamic forms with customizable fields and validations</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClearForm}
            disabled={currentForm.fields.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Form
          </Button>
          <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={currentForm.fields.length === 0}>
                <Save className="w-4 h-4 mr-2" />
                Save Form
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Form</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="form-name">Form Name</Label>
                  <Input
                    id="form-name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter form name"
                  />
                </div>
                <Button onClick={handleSaveForm} className="w-full">
                  Save Form
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Field
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes.map((type) => (
                  <Dialog key={type.value} open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-12">
                        {type.label}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add {type.label} Field</DialogTitle>
                      </DialogHeader>
                      <FieldBuilder
                        fieldType={type.value}
                        onSave={handleAddField}
                        onCancel={() => setIsAddFieldOpen(false)}
                        existingFields={currentForm.fields}
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields ({currentForm.fields.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {currentForm.fields.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No fields added yet. Start by adding a field from the left panel.</p>
                </div>
              ) : (
                <FormFieldsList />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
