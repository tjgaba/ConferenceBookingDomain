// app/dashboard/DashboardClient.tsx — Client Component
//
// The entire existing App.jsx is a stateful client-side application (useState,
// useEffect, useCallback, SignalR connection). Wrapping it here behind a
// "use client" boundary lets the Server Component page (page.tsx) remain a
// clean server entry point while all interactive logic stays on the client.
//
// As subsequent requirements are implemented (e.g. data fetching on the server,
// per-route layouts, protected routes), this boundary can be pushed deeper into
// the component tree to maximise the server-rendered surface.

'use client';

import App from '../../src/App';

export default function DashboardClient() {
  return <App />;
}
