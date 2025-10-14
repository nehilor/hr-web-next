# HR Management System - Frontend

A modern HR management web application built with Next.js 15, featuring user authentication and people management with full CRUD operations.

## Features

- **Authentication**: JWT-based login with session management
- **People Management**: Full CRUD operations with search functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Client-side validation with error handling

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: Tailwind CSS with Radix UI components
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Fetch API with custom service layer
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

## Default Login Credentials

Use these credentials to test the application:

**Admin User:**
- Email: `admin@hrapp.com`
- Password: `admin123`

**HR Manager:**
- Email: `hr@hrapp.com`
- Password: `hr123`

## Application Features

### Authentication
- Secure login with JWT tokens
- Automatic session validation
- Token expiration handling
- Protected routes with middleware

### People Management
- View list of all people
- Search by name, email, or department
- Add new people
- Edit existing people
- Delete people with confirmation
- Responsive table and card views

### User Experience
- Loading states and error handling
- Form validation with helpful error messages
- Toast notifications for actions
- Responsive design for all screen sizes

## Available Scripts

### Development
- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build the application for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

## Project Structure

```
hr-web-next/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── people/            # People management pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── person-form.tsx   # Person form component
│   ├── people-table.tsx  # People table component
│   └── people-cards.tsx  # People cards component
├── lib/                  # Utilities and services
│   ├── services/         # API services
│   ├── hooks/           # Custom React hooks
│   ├── types.ts         # TypeScript type definitions
│   └── validations.ts   # Form validation schemas
├── hooks/               # Global hooks
└── middleware.ts        # Next.js middleware for auth
```

## API Integration

The frontend communicates with the backend API through:

- **Authentication Service**: Handles login, logout, and token management
- **People Service**: Manages CRUD operations for people
- **API Service**: Base HTTP client with token handling

## Authentication Flow

1. **Login**: User enters credentials → API validates → JWT token returned
2. **Token Storage**: Token stored in memory, API service, and cookie
3. **Route Protection**: Middleware checks token validity on each request
4. **Session Validation**: App verifies token with backend on load
5. **Logout**: Clears all token storage and redirects to login

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE` | Backend API base URL | `http://localhost:4000` |

## Development Tips

1. **Hot Reload**: The development server supports hot reload for instant updates
2. **TypeScript**: All components are fully typed for better development experience
3. **Error Handling**: Check browser console for detailed error information
4. **Network Tab**: Use browser dev tools to monitor API requests
5. **Responsive Testing**: Test on different screen sizes using browser dev tools

## Troubleshooting

### Common Issues

**Application won't start:**
- Ensure Node.js 18+ is installed
- Run `pnpm install` to install dependencies
- Check that port 3000 is available

**Login fails:**
- Verify backend API is running on port 4000
- Check browser network tab for API errors
- Ensure correct credentials are being used

**API requests fail:**
- Verify `NEXT_PUBLIC_API_BASE` environment variable
- Check backend API is running and accessible
- Look for CORS errors in browser console

**Styling issues:**
- Ensure Tailwind CSS is properly configured
- Check for missing CSS imports
- Verify component class names are correct

### Getting Help

1. Check browser console for error messages
2. Verify backend API is running and accessible
3. Ensure all environment variables are set correctly
4. Review the backend API documentation

## Production Deployment

### Build for Production

```bash
pnpm run build
pnpm run start
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_BASE=https://your-api-domain.com
```

### Deployment Considerations

- Set up proper environment variables
- Configure CORS on the backend for your domain
- Use HTTPS in production
- Set up proper error monitoring
- Configure CDN for static assets

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: Middleware prevents unauthorized access
- **Input Validation**: Client-side form validation
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookie configuration

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License