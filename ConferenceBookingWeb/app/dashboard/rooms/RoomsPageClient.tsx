'use client';
// app/dashboard/rooms/RoomsPageClient.tsx
//
// Dedicated Next.js Client Component for the /dashboard/rooms route.
// Contains all room-specific state, handlers, SignalR subscription and JSX.
// Replaces the old pattern of delegating to the monolithic src/App.jsx.

import { useState, useEffect, useMemo, useCallback } from 'react';
import RoomList from '../../../src/components/RoomList';
import RoomForm from '../../../src/components/RoomForm';
import Button from '../../../src/components/Button';
import Footer from '../../../src/components/Footer';
import LoadingSpinner from '../../../src/components/LoadingSpinner';
import ErrorMessage from '../../../src/components/ErrorMessage';
import Toast from '../../../src/components/Toast';
import * as roomService from '../../../src/services/roomService';
import { useAuthContext } from '../../../src/context/AuthContext';
import useSignalR from '../../../src/hooks/useSignalR';
import '../../../src/App.css';

const Spinner = LoadingSpinner as unknown as React.FC<{ overlay?: boolean; message?: string }>;
const ErrMsg   = ErrorMessage  as unknown as React.FC<{ error: unknown; onRetry?: () => void; onDismiss?: () => void }>

export default function RoomsPageClient() {
  // ── Data state ───────────────────────────────────────────────────────────────
  const [allRooms, setAllRooms] = useState<unknown[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<unknown[]>([]);

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [roomCapacityFilter, setRoomCapacityFilter] = useState('All');
  const [roomLocationFilter, setRoomLocationFilter] = useState('All');

  // ── Loading / error / submit ─────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // ── Toast state ──────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [toastRemote, setToastRemote] = useState({ show: false, message: '', type: 'warning' });

  // ── Form state ───────────────────────────────────────────────────────────────
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<unknown>(null);

  const { isLoggedIn, refreshKey, currentUser } = useAuthContext();
  const isFacilityManager = (currentUser as { roles?: string[] })?.roles?.includes('FacilityManager') ?? false;

  // ── SignalR — room events only ───────────────────────────────────────────────
  useSignalR({
    onRoomChange: useCallback(async (eventName: string, payload: unknown) => {
      const rooms = await roomService.fetchAllRooms();
      setAllRooms(rooms);
      setFilteredRooms(rooms);
      const actor = (payload as Record<string, string>)?.by ?? (payload as Record<string, string>)?.By ?? 'Unknown';
      const templates: Record<string, string> = {
        RoomCreated: `A new room was added by "${actor}".`,
        RoomUpdated: `A room was updated by "${actor}".`,
        RoomDeleted: `A room was removed by "${actor}".`,
      };
      setToastRemote({ show: true, message: templates[eventName] ?? `Rooms were updated by "${actor}".`, type: 'warning' });
    }, []),
  });

  // ── Fetch data on mount / login change ───────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      setAllRooms([]);
      setFilteredRooms([]);
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await roomService.fetchAllRooms();
        if (mounted && !controller.signal.aborted) {
          setAllRooms(data);
          setFilteredRooms(data);
          setToast({ show: true, message: `Loaded ${(data as unknown[]).length} rooms.`, type: 'success' });
        }
      } catch (err) {
        if (mounted && !controller.signal.aborted) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => { mounted = false; controller.abort(); };
  }, [isLoggedIn, refreshKey]);

  // ── Derived unique locations for filter dropdown ─────────────────────────────
  const uniqueRoomLocations = useMemo(() => {
    const locs = (allRooms as { location?: string }[]).map(r => r.location).filter(Boolean) as string[];
    return [...new Set(locs)].sort();
  }, [allRooms]);

  // ── Cascading filter effect ───────────────────────────────────────────────────
  useEffect(() => {
    let result = allRooms as { capacity?: number; location?: string }[];
    if (roomCapacityFilter === 'Small')       result = result.filter(r => (r.capacity ?? 0) < 10);
    else if (roomCapacityFilter === 'Medium') result = result.filter(r => (r.capacity ?? 0) >= 10 && (r.capacity ?? 0) <= 15);
    else if (roomCapacityFilter === 'Large')  result = result.filter(r => (r.capacity ?? 0) > 15);
    else if (roomCapacityFilter === 'By Capacity') result = [...result].sort((a, b) => (a.capacity ?? 0) - (b.capacity ?? 0));
    if (roomLocationFilter !== 'All') result = result.filter(r => r.location === roomLocationFilter);
    setFilteredRooms(result);
  }, [roomCapacityFilter, roomLocationFilter, allRooms]);

  // ── Room CRUD handlers ────────────────────────────────────────────────────────
  const handleRoomSubmit = async (roomData: Record<string, unknown>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (editingRoom) {
        const updated = await roomService.updateRoom(roomData.id as number, roomData);
        setAllRooms(prev => (prev as { id: unknown }[]).map(r => r.id === (updated as { id: unknown }).id ? updated : r));
        setShowRoomForm(false);
        setEditingRoom(null);
        setToast({ show: true, message: 'Room updated successfully!', type: 'success' });
      } else {
        const created = await roomService.createRoom(roomData);
        setAllRooms(prev => [...prev, created]);
        setShowRoomForm(false);
        setToast({ show: true, message: 'Room created successfully!', type: 'success' });
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async (roomId: unknown) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      setError(null);
      await roomService.deleteRoom(roomId as number);
      setAllRooms(prev => (prev as { id: unknown }[]).filter(r => r.id !== roomId));
      setToast({ show: true, message: 'Room deleted successfully!', type: 'success' });
    } catch (err) {
      setError(err);
    }
  };

  const handleEditRoom = (room: Record<string, unknown>) => {
    setEditingRoom({
      id:       room.id,
      name:     room.name     || room.Name,
      capacity: room.capacity || room.Capacity,
      location: room.location || room.Location,
      number:   room.number   || room.Number,
    });
    setShowRoomForm(true);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  if (isLoading) return <Spinner overlay message="Loading rooms…" />;

  if (error && (allRooms as unknown[]).length === 0) {
    return (
      <div className="app-container">
        <ErrMsg error={error} onRetry={() => window.location.reload()} onDismiss={() => setError(null)} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(t => ({ ...t, show: false }))} />
      )}
      {toastRemote.show && (
        <Toast message={toastRemote.message} type={toastRemote.type} onClose={() => setToastRemote(t => ({ ...t, show: false }))} className="toast-remote" />
      )}
      {error && <ErrMsg error={error} onDismiss={() => setError(null)} />}
      {isSubmitting && <Spinner overlay message="Saving…" />}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Available Rooms</h3>
          <p className="stat-number">{(filteredRooms as unknown[]).length}</p>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Rooms Management</h2>
          {isFacilityManager && (
            <Button
              label={showRoomForm ? 'Hide Form' : 'Add Room'}
              variant="success"
              onClick={() => { setShowRoomForm(s => !s); setEditingRoom(null); }}
              disabled={isSubmitting}
            />
          )}
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="room-capacity-filter">Filter by Capacity:</label>
            <select id="room-capacity-filter" value={roomCapacityFilter} onChange={e => setRoomCapacityFilter(e.target.value)} className="filter-select">
              <option value="All">All Capacities</option>
              <option value="Small">Small (&lt; 10)</option>
              <option value="Medium">Medium (10–15)</option>
              <option value="Large">Large (&gt; 15)</option>
              <option value="By Capacity">Sorted by Capacity</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="room-location-filter">Filter by Location:</label>
            <select id="room-location-filter" value={roomLocationFilter} onChange={e => setRoomLocationFilter(e.target.value)} className="filter-select">
              <option value="All">All Locations</option>
              {uniqueRoomLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
        </div>

        {showRoomForm && (
          <RoomForm
            onSubmit={handleRoomSubmit}
            onCancel={() => { setShowRoomForm(false); setEditingRoom(null); }}
            initialData={editingRoom}
          />
        )}
            <RoomList rooms={filteredRooms} onEdit={isFacilityManager ? handleEditRoom : undefined} onDelete={isFacilityManager ? handleDeleteRoom : undefined} />
      </section>

      <Footer />
    </div>
  );
}
