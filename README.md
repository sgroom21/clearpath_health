# Clearpath Health Dashboard

A clinical dashboard for behavioral health telehealth providers. Built with Next.js 16, TypeScript, and Tailwind CSS, this application provides real-time patient assessment, treatment planning, and AI-powered clinical decision support.

## Features

### Core Dashboard

- **Patient Management**: Browse and select patients with status indicators (STOP/ALERT/OK flags)
- **Role-Based UI**: Toggle between PMHNP and Therapist roles with role-specific features
- **Assessment Scores**: Real-time PHQ-9 (depression) and GAD-7 (anxiety) score visualization
- **Clinical Flags**: Hard stops and alerts for at-risk patients

### Clinical Tabs

1. **Overview Tab**: Patient summary, flags, insurance verification, assessment scores
2. **Assessments Tab**: Detailed PHQ-9 and GAD-7 breakdowns with item-level responses
3. **Clinical Plan Tab**: AI-generated differential diagnosis, treatment plans, and level of care recommendations
4. **AI Toolkit Tab**: Documentation generation (summary, SOAP notes, medication/lab recommendations)
5. **Education Tab**: Patient education library with category/topic selection and AI-generated handouts

### AI Integration

- LLM-powered clinical documentation (summary, SOAP notes, differential diagnosis)
- Evidence-based medication and lab recommendations
- Session planning and patient education generation
- Configurable via environment variables

## Project Structure

```
app/
├── api/
│   └── chat/                    # LLM integration endpoint
├── components/
│   ├── constants/               # Questionnaires and patient data
│   │   ├── colors.ts           # Design token constants (dark-mode clinical UI)
│   │   ├── edu-lib.ts          # Patient education library
│   │   ├── phq9-q.ts           # PHQ-9 items
│   │   ├── gad7-q.ts           # GAD-7 items
│   │   └── patients.ts         # Sample patient data
│   ├── ui/                      # Reusable UI components
│   │   ├── Ring.tsx            # Circular progress component
│   │   ├── ItemRow.tsx         # Assessment item row
│   │   ├── StopCard.tsx        # Critical warning card
│   │   ├── AlertCard.tsx       # Warning notification
│   │   └── AIBlock.tsx         # AI-generated content display
│   ├── tabs/                    # Tab content components
│   │   ├── OverviewTab.tsx
│   │   ├── AssessmentsTab.tsx
│   │   ├── ClinicalPlanTab.tsx
│   │   ├── AIToolkitTab.tsx
│   │   └── EducationTab.tsx
│   ├── Dashboard.tsx            # Main orchestrator component
│   ├── Header.tsx              # Patient demographic header
│   └── PatientSidebar.tsx      # Patient list and statistics
├── globals.css                 # Global styles
├── layout.tsx                  # Root layout with metadata
└── page.tsx                    # Entry point

lib/
├── instructions.ts             # Prompt templates for AI
├── openrouter.ts              # LLM API integration
└── utils.ts                   # Utility functions (color coding, etc.)

public/                         # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenRouter API key (for AI features)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
OPEN_ROUTER_API_KEY=your_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page auto-updates as you edit files.

### Production Build

```bash
npm run build
npm run start
```

## Technology Stack

- **Framework**: Next.js 16.2.6 with Turbopack
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + inline styles
- **State Management**: React hooks (useState)
- **UI Components**: Custom React components
- **LLM Integration**: OpenRouter API
- **Deployment**: Vercel-ready

## Component Architecture

### State Management

The `Dashboard` component manages all application state:

- `selectedId`: Currently selected patient
- `tab`: Active tab (Overview, Assessments, etc.)
- `role`: User role (PMHNP or Therapist)
- `aiResults`: Cached AI-generated content
- `loadingStates`: Loading indicators per content type

### Data Flow

1. User selects patient → `Dashboard` updates state
2. Tab component renders with patient data
3. User triggers AI generation → API call to `/api/chat`
4. Results cached by `${patientId}-${contentType}` key
5. Component renders with results or loading state

## Contributing

This project follows strict TypeScript checking and component-based architecture principles.

## License

Private project for Clearpath Health.
