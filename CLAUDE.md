# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a LIFF (LINE Front-end Framework) 3-choice survey form application built with Next.js. The app runs within the LINE messaging app and saves responses to Google Sheets.

## Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **LINE Integration**: LIFF v2 SDK
- **Backend**: Vercel Serverless Functions
- **Data Storage**: Google Sheets (via Apps Script or Sheets API)

## Development Setup

### Common Development Commands
- `npm run dev` - Start local development server
- `npm run build` - Build production files  
- `npm run start` - Run production server locally
- `npm run lint` - Run Next.js linter

## Architecture

### Project Structure
```
/app
  /api/submit    - API route for form submission
  layout.tsx     - Root layout with metadata
  page.tsx       - Main survey form (client component)
  globals.css    - Tailwind CSS imports
```

### Key Components
1. **Survey Form** (`app/page.tsx`)
   - Client-side component with LIFF initialization
   - Handles user authentication and profile retrieval
   - Submits responses to API endpoint

2. **Submit API** (`app/api/submit/route.ts`)
   - Receives form data from frontend
   - Forwards to Google Apps Script webhook
   - Alternative implementation available for Sheets API

### Environment Variables
- `NEXT_PUBLIC_LIFF_ID` - LINE LIFF application ID (public)
- `APPSCRIPT_URL` - Google Apps Script webhook URL (server-side only)

## LIFF-Specific Considerations

1. **LIFF Initialization**: Always check if LIFF is initialized before using APIs
2. **Login Flow**: Automatically redirects to LINE login if user not authenticated
3. **Message Sending**: Can send confirmation messages back to chat after submission
4. **Window Management**: Use `liff.closeWindow()` to return to LINE chat
5. **Local Testing**: Use ngrok or similar for HTTPS tunneling during development

## Google Sheets Integration

Two approaches are implemented:
1. **Apps Script Webhook** (default) - Simple POST endpoint
2. **Sheets API** (optional) - Direct API access with Service Account

## Testing Checklist
- [ ] LIFF initializes correctly
- [ ] User profile is retrieved
- [ ] Form submission works
- [ ] Data appears in Google Sheets
- [ ] Confirmation message is sent to LINE chat
- [ ] Window closes after submission