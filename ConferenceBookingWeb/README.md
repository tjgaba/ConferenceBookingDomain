# Conference Booking Web

Next.js 16 front-end for the Conference Booking system.

## Setup

```bash
npm install
npm run dev      # runs on http://localhost:3000
```

## Environment variables

Copy `.env` and adjust if your API runs on a different port:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5230/api
NEXT_PUBLIC_HUB_URL=http://localhost:5230/hubs/booking
```

## Project structure

```
app/         Next.js App Router pages and layouts
src/
  api/           apiClient (Axios singleton)
  components/    Shared UI components
  context/       AuthContext
  hooks/         useAuth, useBookings, useSignalR
  services/      bookingService, roomService, authService
  dto/           DTO shape objects
```
