// ConnectionStatus.jsx — Pings the backend /health endpoint and displays
// "Connected" (green) or "Backend Offline" (red) in the Header.

import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import './ConnectionStatus.css';

function ConnectionStatus() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  const ping = async () => {
    try {
      await apiClient.get('/health', { timeout: 4000 });
      setStatus('online');
    } catch {
      setStatus('offline');
    }
  };

  useEffect(() => {
    ping();
    // Re-ping every 30 seconds
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return <span className="connection-status checking">&#9679; Connecting…</span>;
  }

  return (
    <span className={`connection-status ${status === 'online' ? 'online' : 'offline'}`}>
      &#9679; {status === 'online' ? 'Connected' : 'Backend Offline'}
    </span>
  );
}

export default ConnectionStatus;
