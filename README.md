# 🚀 Dynamic Form Builder - upliance.ai Assignment

## ✨ Features

### 🎯 Core Functionality
- **Dynamic Form Creation**: Build forms with 7 different field types
- **Real-time Preview**: See exactly how your form will look to end users
- **Form Management**: Save, load, and manage multiple forms
- **Persistent Storage**: All forms saved to localStorage (no backend required)

### 🔧 Field Types Supported
- ✅ **Text** - Single line text input
- ✅ **Number** - Numeric input with validation
- ✅ **Textarea** - Multi-line text input
- ✅ **Select** - Dropdown selection
- ✅ **Radio** - Single choice from multiple options
- ✅ **Checkbox** - Multiple choice selection
- ✅ **Date** - Date picker input

### 🎛️ Advanced Features
- **🧮 Derived Fields**: Auto-calculate values based on other fields (e.g., age from birth date)
- **✅ Comprehensive Validations**: Required, min/max length, email format, password rules
- **🔄 Field Reordering**: Easily reorder fields with up/down controls
- **🎨 Custom Styling**: Clean, modern UI with upliance.ai branding
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **⚡ Real-time Updates**: Instant validation and derived field calculations

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI + Custom Components
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Form Handling**: Custom validation system
- **Storage**: localStorage API

## 🚀 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/form-builder-upliance.git
   cd form-builder-upliance
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## 📖 Usage

### Creating a Form

1. **Navigate to Create Form** (`/create`)
2. **Add Fields**: Click on any field type button to add it to your form
3. **Configure Fields**: 
   - Set label and default values
   - Toggle required status
   - Add validation rules
   - Configure options for select/radio/checkbox fields
4. **Add Derived Fields**: 
   - Enable "Derived Field" toggle
   - Select parent fields
   - Define calculation formula
5. **Reorder Fields**: Use up/down arrows to reorder
6. **Save Form**: Click "Save Form" and provide a name

### Previewing Forms

1. **Navigate to Preview** (`/preview`)
2. **Interact with Form**: Fill out fields as an end user would
3. **See Validations**: Real-time validation feedback
4. **Watch Derived Fields**: Auto-calculated fields update instantly
5. **Submit Form**: Test the complete form submission flow

### Managing Saved Forms

1. **Navigate to My Forms** (`/myforms`)
2. **View All Forms**: See all saved forms with metadata
3. **Preview Forms**: Click "Preview Form" to load and preview any saved form
4. **Form Details**: View field count, types, and features at a glance

