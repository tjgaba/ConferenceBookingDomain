'use client';
// app/dashboard/DashboardHomeClient.tsx
//
// Dedicated Next.js Client Component for the /dashboard overview route.
// Shows a combined view of both bookings and rooms — the "all" section
// that was previously handled by src/App.jsx when pathname === '/dashboard'.
// No longer delegates to the monolithic App.jsx.

import { useState, useEffect, useMemo, useCallback } from 'react';
import BookingList from '../../src/components/BookingList';
import BookingForm from '../../src/components/BookingForm';
import RoomList from '../../src/components/RoomList';
import RoomForm from '../../src/components/RoomForm';
import Button from '../../src/components/Button';
import Footer from '../../src/components/Footer';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import ErrorMessage from '../../src/components/ErrorMessage';
import Toast from '../../src/components/Toast';
import NetworkStressTest from '../../src/components/NetworkStressTest';
import * as bookingService from '../../src/services/bookingService';
import * as roomService from '../../src/services/roomService';
import { useAuthContext } from '../../src/context/AuthContext';
import useSignalR from '../../src/hooks/useSignalR';
import '../../src/App.css';

const Spinner = LoadingSpinner as unknown as React.FC<{ overlay?: boolean; message?: string }>;
const ErrMsg   = ErrorMessage  as unknown as React.FC<{ error: unknown; onRetry?: () => void; onDismiss?: () => void }>

export default function DashboardHomeClient() {
  // ── Data state ───────────────────────────────────────────────────────────────
  const [allBookings, setAllBookings] = useState<unknown[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<unknown[]>([]);
  const [allRooms, setAllRooms] = useState<unknown[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<unknown[]>([]);

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [roomCapacityFilter, setRoomCapacityFilter] = useState('All');
  const [roomLocationFilter, setRoomLocationFilter] = useState('All');

  // ── Loading / error / submit ─────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // ── Toast state ──────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [toastRemote, setToastRemote] = useState({ show: false, message: '', type: 'warning' });

  // ── Form / UI state ──────────────────────────────────────────────────────────
  const [bookingFormErrors, setBookingFormErrors] = useState<Record<string, string>>({});
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<unknown>(null);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<unknown>(null);
  const [showStressTest, setShowStressTest] = useState(false);

  const { isLoggedIn, refreshKey } = useAuthContext();

  // ── SignalR — booking and room events ────────────────────────────────────────
  useSignalR({
    onBookingChange: useCallback(async (eventName: string, payload: unknown) => {
      const bookings = await bookingService.fetchAllBookings();
      setAllBookings(bookings);
      setFilteredBookings(bookings);
      const actor = (payload as Record<string, string>)?.by ?? (payload as Record<string, string>)?.By ?? 'Unknown';
      const templates: Record<string, string> = {
        BookingCreated:   `A new booking was created by "${actor}".`,
        BookingUpdated:   `A booking was updated by "${actor}".`,
        BookingCancelled: `A booking was cancelled by "${actor}".`,
        BookingDeleted:   `A booking was deleted by "${actor}".`,
      };
      setToastRemote({ show: true, message: templates[eventName] ?? `Bookings updated by "${actor}".`, type: 'warning' });
    }, []),
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
      setToastRemote({ show: true, message: templates[eventName] ?? `Rooms updated by "${actor}".`, type: 'warning' });
    }, []),
  });

  // ── Fetch data on mount / login change ───────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      setAllBookings([]);
      setAllRooms([]);
      setFilteredBookings([]);
      setFilteredRooms([]);
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [bookingsData, roomsData] = await Promise.all([
          bookingService.fetchAllBookings(),
          roomService.fetchAllRooms(),
        ]);
        if (mounted && !controller.signal.aborted) {
          setAllBookings(bookingsData);
          setFilteredBookings(bookingsData);
          setAllRooms(roomsData);
          setFilteredRooms(roomsData);
          setToast({
            show: true,
            message: `Loaded ${(bookingsData as unknown[]).length} bookings and ${(roomsData as unknown[]).length} rooms.`,
            type: 'success',
          });
        }
      } catch (err) {
        if (mounted && !controller.signal.aborted) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => { mounted = false; controller.abort(); };
  }, [isLoggedIn, refreshKey]);

  // ── Derived unique locations ─────────────────────────────────────────────────
  const uniqueLocations = useMemo(() => {
    const locs = (allBookings as { location?: string }[]).map(b => b.location).filter(Boolean) as string[];
    return [...new Set(locs)].sort();
  }, [allBookings]);

  const uniqueRoomLocations = useMemo(() => {
    const locs = (allRooms as { location?: string }[]).map(r => r.location).filter(Boolean) as string[];
    return [...new Set(locs)].sort();
  }, [allRooms]);

  // ── Cascading filter effects ──────────────────────────────────────────────────
  useEffect(() => {
    let result = allBookings as { status?: string; location?: string }[];
    if (categoryFilter === 'Pending')        result = result.filter(b => b.status === 'Pending');
    else if (categoryFilter === 'Confirmed') result = result.filter(b => b.status === 'Confirmed');
    else if (categoryFilter === 'Cancelled') result = result.filter(b => b.status === 'Cancelled');
    else if (categoryFilter === 'By Location') result = [...result].sort((a, b) => (a.location ?? '').localeCompare(b.location ?? ''));
    if (locationFilter !== 'All') result = result.filter(b => b.location === locationFilter);
    setFilteredBookings(result);
  }, [categoryFilter, locationFilter, allBookings]);

  useEffect(() => {
    let result = allRooms as { capacity?: number; location?: string }[];
    if (roomCapacityFilter === 'Small')        result = result.filter(r => (r.capacity ?? 0) < 10);
    else if (roomCapacityFilter === 'Medium')  result = result.filter(r => (r.capacity ?? 0) >= 10 && (r.capacity ?? 0) <= 15);
    else if (roomCapacityFilter === 'Large')   result = result.filter(r => (r.capacity ?? 0) > 15);
    else if (roomCapacityFilter === 'By Capacity') result = [...result].sort((a, b) => (a.capacity ?? 0) - (b.capacity ?? 0));
    if (roomLocationFilter !== 'All') result = result.filter(r => r.location === roomLocationFilter);
    setFilteredRooms(result);
  }, [roomCapacityFilter, roomLocationFilter, allRooms]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const formatDateTimeForInput = (dt: string | null | undefined) => {
    if (!dt) return '';
    const d = new Date(dt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // ── Booking CRUD handlers ─────────────────────────────────────────────────────
  const handleBookingSubmit = async (bookingData: Record<string, unknown>) => {
    setBookingFormErrors({});
    try {
      setIsSubmitting(true);
      setError(null);
      if (editingBooking) {
        const bookingId = (bookingData.bookingId || (editingBooking as { id: unknown }).id) as number;
        await bookingService.updateBooking(bookingId, bookingData);
        const refreshed = await bookingService.fetchAllBookings();
        setAllBookings(refreshed);
        setShowBookingForm(false);
        setEditingBooking(null);
        setToast({ show: true, message: 'Booking updated successfully!', type: 'success' });
      } else {
        await bookingService.createBooking(bookingData);
        const refreshed = await bookingService.fetchAllBookings();
        setAllBookings(refreshed);
        setShowBookingForm(false);
        setToast({ show: true, message: 'Booking created successfully!', type: 'success' });
      }
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      if (data?.errors) {
        const e = data.errors as Record<string, string[]>;
        const mapped: Record<string, string> = {};
        if (e.RoomId)    mapped.roomId    = e.RoomId[0];
        if (e.StartDate) mapped.startTime = e.StartDate[0];
        if (e.EndDate)   mapped.endTime   = e.EndDate[0];
        if (e.StartTime) mapped.startTime = e.StartTime[0];
        if (e.EndTime)   mapped.endTime   = e.EndTime[0];
        if (e.Capacity)  mapped.general   = e.Capacity[0];
        if (e.Location)  mapped.general   = e.Location[0];
        if (e.General)   mapped.general   = e.General[0];
        if (Object.keys(mapped).length === 0)
          mapped.general = (data.title as string) || (data.detail as string) || (err as Error).message;
        setBookingFormErrors(mapped);
      } else {
        setBookingFormErrors({ general: (data?.message as string) || (data?.title as string) || (err as Error).message });
      }
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBooking = async (bookingId: unknown) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      setError(null);
      await bookingService.deleteBooking(bookingId as number);
      setAllBookings(prev => (prev as { bookingId?: unknown; id?: unknown }[]).filter(b => (b.bookingId || b.id) !== bookingId));
      setToast({ show: true, message: 'Booking deleted successfully!', type: 'success' });
    } catch (err) { setError(err); }
  };

  const handleEditBooking = async (booking: Record<string, unknown>) => {
    try {
      let fullBooking = booking;
      if (!booking.startTime && booking.bookingId) {
        fullBooking = await bookingService.getBookingById(booking.bookingId as number) as Record<string, unknown>;
      }
      setEditingBooking({
        id:        fullBooking.bookingId || fullBooking.id,
        roomId:    fullBooking.roomId,
        startTime: formatDateTimeForInput(fullBooking.startTime as string),
        endTime:   formatDateTimeForInput(fullBooking.endTime as string),
        status:    fullBooking.status || 'Pending',
      });
      setShowBookingForm(true);
    } catch { alert('Failed to load booking details'); }
  };

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
    } catch (err) { setError(err); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteRoom = async (roomId: unknown) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      setError(null);
      await roomService.deleteRoom(roomId as number);
      setAllRooms(prev => (prev as { id: unknown }[]).filter(r => r.id !== roomId));
      setToast({ show: true, message: 'Room deleted successfully!', type: 'success' });
    } catch (err) { setError(err); }
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
  if (isLoading) return <Spinner overlay message="Loading dashboard…" />;

  if (error && (allBookings as unknown[]).length === 0 && (allRooms as unknown[]).length === 0) {
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

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{(filteredBookings as unknown[]).length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Available Rooms</h3>
          <p className="stat-number">{(filteredRooms as unknown[]).length}</p>
        </div>
      </div>

      {/* Booking filters */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select id="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="filter-select">
            <option value="All">All Bookings</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="By Location">Sorted by Location</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="location-filter">Filter by Location:</label>
          <select id="location-filter" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="filter-select">
            <option value="All">All Locations</option>
            {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
      </div>

      {/* Bookings section */}
      <section className="section">
        <div className="section-header">
          <h2>Bookings Management</h2>
          <Button
            label={showBookingForm ? 'Hide Form' : 'New Booking'}
            variant="primary"
            onClick={() => { setShowBookingForm(s => !s); setEditingBooking(null); }}
            disabled={isSubmitting}
          />
        </div>
        {showBookingForm && (
          <BookingForm
            onSubmit={handleBookingSubmit}
            onCancel={() => { setShowBookingForm(false); setEditingBooking(null); setBookingFormErrors({}); }}
            rooms={allRooms}
            initialData={editingBooking}
            serverErrors={bookingFormErrors}
          />
        )}
        <BookingList bookings={filteredBookings} onEdit={handleEditBooking} onDelete={handleDeleteBooking} />
      </section>

      {/* Rooms section */}
      <section className="section">
        <div className="section-header">
          <h2>Rooms Management</h2>
          <Button
            label={showRoomForm ? 'Hide Form' : 'Add Room'}
            variant="success"
            onClick={() => { setShowRoomForm(s => !s); setEditingRoom(null); }}
            disabled={isSubmitting}
          />
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
        <RoomList rooms={filteredRooms} onEdit={handleEditRoom} onDelete={handleDeleteRoom} />
      </section>

      {/* Network stress test */}
      <section className="section">
        <div className="section-header">
          <h2>Network Resilience</h2>
          <button className="btn btn-secondary" onClick={() => setShowStressTest(s => !s)}>
            {showStressTest ? 'Hide Stress Test' : 'Show Stress Test'}
          </button>
        </div>
        {showStressTest && <NetworkStressTest />}
      </section>

      <Footer />
    </div>
  );
}
