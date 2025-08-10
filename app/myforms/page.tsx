'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/store/store'
import { loadSavedForms, loadForm } from '@/store/form-builder-slice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Calendar, FileText } from 'lucide-react'

export default function MyFormsPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { savedForms } = useSelector((state: RootState) => state.formBuilder)

  useEffect(() => {
    dispatch(loadSavedForms())
  }, [dispatch])

  const handlePreviewForm = (formId: string) => {
    dispatch(loadForm(formId))
    router.push('/preview')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
        <p className="text-gray-600 mt-2">View and manage all your saved forms</p>
      </div>

      {savedForms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">No saved forms yet.</p>
            <Button onClick={() => router.push('/create')}>
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedForms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{form.name}</span>
                  <Badge variant="outline">{form.fields.length} fields</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(form.createdAt)}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Field Types:</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Set(form.fields.map(f => f.type))).map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {form.fields.some(f => f.required) && (
                      <Badge variant="outline" className="text-xs">Required Fields</Badge>
                    )}
                    {form.fields.some(f => f.validationRules.length > 0) && (
                      <Badge variant="outline" className="text-xs">Validations</Badge>
                    )}
                    {form.fields.some(f => f.isDerived) && (
                      <Badge variant="outline" className="text-xs">Derived Fields</Badge>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handlePreviewForm(form.id)}
                  className="w-full"
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Form
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
