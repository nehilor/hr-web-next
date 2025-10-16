import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Empty middleware - no authentication or redirects needed
export function middleware(request: NextRequest) {
  // Just pass through all requests without any processing
  return NextResponse.next()
}

// No matcher needed - this middleware will run on all requests
// but won't do anything