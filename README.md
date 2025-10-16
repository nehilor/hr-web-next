# Application Monitoring Service - Frontend

A modern application monitoring web application built with Next.js 15, featuring error tracking and monitoring dashboard.

## Features

- **Error Tracking**: Real-time error monitoring and tracking
- **Monitoring Dashboard**: View captured errors and system metrics
- **SDK Testing**: Test the monitoring SDK functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: Tailwind CSS with Radix UI components
- **State Management**: React hooks
- **HTTP Client**: Fetch API
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ LTS
- pnpm 8+
- Backend API running (see hr-api-nest README)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 3. Start Development Server

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`

## Application Features

### Error Tracking
- Real-time error monitoring
- Error deduplication
- Stack trace analysis
- Environment tracking

### Monitoring Dashboard
- System health status
- Application metrics
- Recent errors display
- Performance monitoring

### SDK Testing
- Test different error types
- Validate SDK functionality
- Real-time error sending

### User Experience
- Loading states and error handling
- Responsive design
- Modern UI components

## Available Pages

- **Home** (`/`) - Main landing page with navigation
- **Test SDK** (`/test`) - Test the monitoring SDK
- **Dashboard** (`/monitoring`) - View monitoring data

## Development

### Project Structure

```
hr-web-next/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── test/              # SDK test page
│   ├── monitoring/        # Monitoring dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   └── navigation/       # Navigation components
├── lib/                  # Utilities and services
│   ├── constants.ts      # App constants
│   ├── types.ts          # TypeScript types
│   └── services/         # API services
└── README.md             # This file
```

### Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

## Troubleshooting

### Common Issues

**Frontend won't start:**
- Ensure backend is running on port 4000
- Check if port 3000 is available
- Verify environment variables

**API connection issues:**
- Verify backend API is running
- Check CORS configuration
- Verify API endpoints

### Getting Help

1. Check the console output for error messages
2. Verify all services are running on correct ports
3. Check browser developer tools for network errors