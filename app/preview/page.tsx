'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { loadSavedForms } from '@/store/form-builder-slice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormPreview } from '@/components/form-preview'

export default function PreviewPage() {
  const dispatch = useDispatch()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)

  useEffect(() => {
    dispatch(loadSavedForms())
  }, [dispatch])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Form Preview</h1>
        <p className="text-gray-600 mt-2">Preview how your form will appear to end users</p>
      </div>

      {currentForm.fields.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No form to preview. Please create a form first.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Form Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <FormPreview fields={currentForm.fields} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
