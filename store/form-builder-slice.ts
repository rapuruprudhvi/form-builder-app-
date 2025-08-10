import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password'
  value?: number
  message: string
}

export interface FormField {
  id: string
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date'
  label: string
  required: boolean
  defaultValue: string | string[]
  validationRules: ValidationRule[]
  options?: string[] // for select, radio, checkbox
  isDerived?: boolean
  parentFields?: string[]
  derivedFormula?: string
}

export interface FormSchema {
  id: string
  name: string
  fields: FormField[]
  createdAt: string
}

interface FormBuilderState {
  currentForm: {
    fields: FormField[]
    name: string
  }
  savedForms: FormSchema[]
}

const initialState: FormBuilderState = {
  currentForm: {
    fields: [],
    name: '',
  },
  savedForms: [],
}

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FormField>) => {
      state.currentForm.fields.push(action.payload)
    },
    updateField: (state, action: PayloadAction<{ id: string; field: Partial<FormField> }>) => {
      const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id)
      if (index !== -1) {
        state.currentForm.fields[index] = { ...state.currentForm.fields[index], ...action.payload.field }
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload)
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [removed] = state.currentForm.fields.splice(fromIndex, 1)
      state.currentForm.fields.splice(toIndex, 0, removed)
    },
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload
    },
    saveForm: (state, action: PayloadAction<string>) => {
      const formSchema: FormSchema = {
        id: Date.now().toString(),
        name: action.payload,
        fields: [...state.currentForm.fields],
        createdAt: new Date().toISOString(),
      }
      state.savedForms.push(formSchema)
      // Save to localStorage
      localStorage.setItem('formBuilder_savedForms', JSON.stringify(state.savedForms))
    },
    loadSavedForms: (state) => {
      const saved = localStorage.getItem('formBuilder_savedForms')
      if (saved) {
        state.savedForms = JSON.parse(saved)
      }
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload)
      if (form) {
        state.currentForm.fields = [...form.fields]
        state.currentForm.name = form.name
      }
    },
    clearCurrentForm: (state) => {
      state.currentForm = { fields: [], name: '' }
    },
  },
})

export const {
  addField,
  updateField,
  deleteField,
  reorderFields,
  setFormName,
  saveForm,
  loadSavedForms,
  loadForm,
  clearCurrentForm,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer
