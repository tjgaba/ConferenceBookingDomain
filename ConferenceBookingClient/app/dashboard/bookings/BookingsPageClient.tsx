'use client';
// app/dashboard/bookings/BookingsPageClient.tsx
//
// Dedicated Next.js Client Component for the /dashboard/bookings route.
// Contains all booking-specific state, handlers, SignalR subscription and JSX.
// Replaces the old pattern of delegating to the monolithic src/App.jsx.

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import BookingList from '../../../src/components/BookingList';
import BookingForm from '../../../src/components/BookingForm';
import Button from '../../../src/components/Button';
import Footer from '../../../src/components/Footer';
import LoadingSpinner from '../../../src/components/LoadingSpinner';
import ErrorMessage from '../../../src/components/ErrorMessage';
import Toast from '../../../src/components/Toast';
import * as bookingService from '../../../src/services/bookingService';
import * as roomService from '../../../src/services/roomService';
import { useAuthContext } from '../../../src/context/AuthContext';
import useSignalR from '../../../src/hooks/useSignalR';
import '../../../src/App.css';

// Cast the JS components to typed variants so TSX props are accepted without errors.
const Spinner = LoadingSpinner as unknown as React.FC<{ overlay?: boolean; message?: string }>;
const ErrMsg   = ErrorMessage  as unknown as React.FC<{ error: unknown; onRetry?: () => void; onDismiss?: () => void }>

export default function BookingsPageClient() {
  // ── Data state ───────────────────────────────────────────────────────────────
  const [allBookings, setAllBookings] = useState<unknown[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<unknown[]>([]);
  const [allRooms, setAllRooms] = useState<unknown[]>([]); // needed by BookingForm dropdown

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // ── Loading / error / submit ─────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // ── Toast state ──────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [toastRemote, setToastRemote] = useState({ show: false, message: '', type: 'warning' });

  // ── Form state ───────────────────────────────────────────────────────────────
  const [bookingFormErrors, setBookingFormErrors] = useState<Record<string, string>>({});
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<unknown>(null);

  const { isLoggedIn, refreshKey } = useAuthContext();

  // ── Expand/collapse state ─────────────────────────────────────────────────────
  const [sectionOpen, setSectionOpen] = useState(false);

  // ── SignalR — booking events only ────────────────────────────────────────────
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
      setToastRemote({ show: true, message: templates[eventName] ?? `Bookings were updated by "${actor}".`, type: 'warning' });
    }, []),
  });

  // ── Fetch data on mount / login change ───────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      setAllBookings([]);
      setAllRooms([]);
      setFilteredBookings([]);
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
          setToast({ show: true, message: `Loaded ${(bookingsData as unknown[]).length} bookings.`, type: 'success' });
        }
      } catch (err) {
        if (mounted && !controller.signal.aborted) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => { mounted = false; controller.abort(); };
  }, [isLoggedIn, refreshKey]);

  // ── Derived unique locations for filter dropdown ──────────────────────────────
  const uniqueLocations = useMemo(() => {
    const locs = (allBookings as { location?: string }[]).map(b => b.location).filter(Boolean) as string[];
    return [...new Set(locs)].sort();
  }, [allBookings]);

  // ── Cascading filter effect ───────────────────────────────────────────────────
  useEffect(() => {
    let result = allBookings as { status?: string; location?: string }[];
    if (categoryFilter === 'Pending')       result = result.filter(b => b.status === 'Pending');
    else if (categoryFilter === 'Confirmed') result = result.filter(b => b.status === 'Confirmed');
    else if (categoryFilter === 'Cancelled') result = result.filter(b => b.status === 'Cancelled');
    else if (categoryFilter === 'By Location') result = [...result].sort((a, b) => (a.location ?? '').localeCompare(b.location ?? ''));
    if (locationFilter !== 'All') result = result.filter(b => b.location === locationFilter);
    setFilteredBookings(result);
  }, [categoryFilter, locationFilter, allBookings]);

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
    } catch (err) {
      setError(err);
    }
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
    } catch {
      alert('Failed to load booking details');
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  if (isLoading) return <Spinner overlay message="Loading bookings…" />;

  if (error && (allBookings as unknown[]).length === 0) {
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
          <h3>Total Bookings</h3>
          <p className="stat-number">{(filteredBookings as unknown[]).length}</p>
        </div>
      </div>

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

      <section className="section">
        <div className="section-header collapsible-header" onClick={() => setSectionOpen(o => !o)} style={{ cursor: 'pointer', userSelect: 'none' }}>
          <h2>Bookings Management <span className="collapse-icon">{sectionOpen ? '▲' : '▼'}</span></h2>
          {sectionOpen && (
            <Button
              label={showBookingForm ? 'Hide Form' : 'New Booking'}
              variant="primary"
              onClick={e => { e.stopPropagation(); setShowBookingForm(s => !s); setEditingBooking(null); }}
              disabled={isSubmitting}
            />
          )}
        </div>
        {sectionOpen && (
          <>
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
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
