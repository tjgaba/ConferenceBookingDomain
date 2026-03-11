'use client';
// app/dashboard/room-management/RoomManagementPageClient.tsx
//
// Full CRUD management for conference rooms. Accessible by Admin & FacilityManager.
// Endpoints consumed:
//   POST   /api/RoomManagement           – create room
//   PUT    /api/RoomManagement/{id}      – update room details
//   PATCH  /api/RoomManagement/{id}/status – toggle active
//   DELETE /api/RoomManagement/{id}      – deactivate room
//   GET    /api/Room                     – list all rooms

import { useState, useEffect, useCallback } from 'react';
import Toast from '../../../src/components/Toast';
import LoadingSpinner from '../../../src/components/LoadingSpinner';
import ErrorMessage from '../../../src/components/ErrorMessage';
import Footer from '../../../src/components/Footer';
import LoginForm from '../../../src/components/LoginForm';
import { useAuthContext } from '../../../src/context/AuthContext';
import useSignalR from '../../../src/hooks/useSignalR';
import * as roomService from '../../../src/services/roomService';
import '../../../src/App.css';
import './RoomManagement.css';

// ── Type casts for untyped JSX components ────────────────────────────────────
const Spinner = LoadingSpinner as unknown as React.FC<{ overlay?: boolean; message?: string }>;
const ErrMsg  = ErrorMessage  as unknown as React.FC<{ error: unknown; onRetry?: () => void; onDismiss?: () => void }>;

// ── Location enum (mirrors backend RoomLocation) ─────────────────────────────
const LOCATIONS = ['London', 'CapeTown', 'Johannesburg', 'Bloemfontein', 'Durban'];

// ── Blank form state ──────────────────────────────────────────────────────────
const BLANK_FORM = { name: '', capacity: '', number: '', location: 'London', isActive: true };

interface RoomRow {
  id: number;
  name: string;
  capacity: number;
  number: number;
  location: string;
  isActive: boolean;
  deletedAt?: string | null;
}

interface FormState {
  name: string;
  capacity: string | number;
  number: string | number;
  location: string;
  isActive: boolean;
}

export default function RoomManagementPageClient() {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const { isLoggedIn, currentUser, refreshKey, login } = useAuthContext();
  const userRoles: string[] = (currentUser as { roles?: string[] })?.roles ?? [];
  const isFacilityManager = userRoles.includes('FacilityManager');
  const isAdmin = isFacilityManager;
  const canManage = isFacilityManager;

  // ── Data state ───────────────────────────────────────────────────────────────
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // ── Toast state ──────────────────────────────────────────────────────────────
  const [toast, setToast]             = useState({ show: false, message: '', type: 'success' });
  const [toastRemote, setToastRemote] = useState({ show: false, message: '', type: 'warning' });

  // ── Modal / form state ────────────────────────────────────────────────────────
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRoom, setEditingRoom]         = useState<RoomRow | null>(null);
  const [form, setForm]                       = useState<FormState>(BLANK_FORM);

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter]     = useState<'all' | 'active' | 'inactive'>('all');
  const [locationFilter, setLocationFilter] = useState('All');
  const [search, setSearch]                 = useState('');

  // ── Pagination state ──────────────────────────────────────────────────────────
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // ── SignalR — react to real-time room events ─────────────────────────────────
  useSignalR({
    onRoomChange: useCallback(async (eventName: string, payload: unknown) => {
      const data = await (roomService as unknown as { fetchAllRoomsManagement: () => Promise<RoomRow[]> }).fetchAllRoomsManagement();
      setRooms(data);
      const actor = (payload as Record<string, string>)?.by ?? (payload as Record<string, string>)?.By ?? 'Unknown';
      const templates: Record<string, string> = {
        RoomCreated: `Room added by "${actor}".`,
        RoomUpdated: `Room updated by "${actor}".`,
        RoomDeleted: `Room deactivated by "${actor}".`,
      };
      setToastRemote({ show: true, message: templates[eventName] ?? `Rooms changed by "${actor}".`, type: 'warning' });
    }, []),
  });

  // ── Load all rooms on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) { setIsLoading(false); setRooms([]); return; }
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await (roomService as unknown as { fetchAllRoomsManagement: () => Promise<RoomRow[]> }).fetchAllRoomsManagement();
        if (mounted) setRooms(data);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isLoggedIn, refreshKey]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const showToast = (message: string, type = 'success') =>
    setToast({ show: true, message, type });

  const openCreateModal = () => {
    setEditingRoom(null);
    setForm(BLANK_FORM);
    setShowCreateModal(true);
  };

  const openEditModal = (room: RoomRow) => {
    setEditingRoom(room);
    setForm({ name: room.name, capacity: room.capacity, number: room.number, location: room.location, isActive: room.isActive });
    setShowCreateModal(true);
  };

  const closeModal = () => { setShowCreateModal(false); setEditingRoom(null); setForm(BLANK_FORM); };

  // ── CRUD handlers ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.capacity || !form.number || !form.location) {
      showToast('Please fill in all required fields.', 'error'); return;
    }
    const payload = { name: form.name.trim(), capacity: Number(form.capacity), number: Number(form.number), location: form.location, isActive: form.isActive };
    try {
      setIsSubmitting(true);
      setError(null);
      if (editingRoom) {
        const updated = await roomService.updateRoom(editingRoom.id, payload) as RoomRow;
        setRooms(prev => prev.map(r => r.id === updated.id ? updated : r));
        showToast(`Room "${updated.name}" updated successfully.`);
      } else {
        const created = await roomService.createRoom(payload) as RoomRow;
        setRooms(prev => [...prev, created]);
        showToast(`Room "${created.name}" created successfully.`);
      }
      closeModal();
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (room: RoomRow) => {
    if (!confirm(`Are you sure you want to ${room.isActive ? 'deactivate' : 'activate'} room "${room.name}"?`)) return;
    try {
      setIsSubmitting(true);
      const updated = await roomService.updateRoomStatus(room.id, !room.isActive) as RoomRow;
      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isActive: updated.isActive ?? !room.isActive } : r));
      showToast(`Room "${room.name}" ${updated.isActive ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (room: RoomRow) => {
    if (!confirm(`Permanently deactivate room "${room.name}"? This cannot be undone easily.`)) return;
    try {
      setIsSubmitting(true);
      await roomService.deleteRoom(room.id);
      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isActive: false } : r));
      showToast(`Room "${room.name}" deactivated.`, 'warning');
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Derived list ─────────────────────────────────────────────────────────────
  const filteredRooms = rooms
    .filter(r => statusFilter === 'all' ? true : statusFilter === 'active' ? r.isActive : !r.isActive)
    .filter(r => locationFilter === 'All' || r.location === locationFilter)
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || String(r.number).includes(search));

  const totalPages  = Math.max(1, Math.ceil(filteredRooms.length / PAGE_SIZE));
  // Reset to page 1 when filters change would be handled by the filter onChange calling setCurrentPage(1)
  const safePage    = Math.min(currentPage, totalPages);
  const visibleRooms = filteredRooms.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const activeCount   = rooms.filter(r => r.isActive).length;
  const inactiveCount = rooms.filter(r => !r.isActive).length;

  // ── Render guards ─────────────────────────────────────────────────────────────
  if (isLoading) return <Spinner overlay message="Loading room management…" />;

  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <div className="rm-access-wall">
          <div className="rm-access-icon">🔒</div>
          <h2>Login Required</h2>
          <p>Please log in with a FacilityManager or Admin account to access Room Management.</p>
          <LoginForm onLogin={async (u: string, p: string) => { await login(u, p); }} onCancel={() => {}} />
        </div>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="app-container">
        <div className="rm-access-wall">
          <div className="rm-access-icon">⛔</div>
          <h2>Access Denied</h2>
          <p>Your account has role: <strong>{userRoles.join(', ') || 'none'}</strong>. FacilityManager or Admin required.</p>
          <LoginForm onLogin={async (u: string, p: string) => { await login(u, p); }} onCancel={() => {}} />
        </div>
      </div>
    );
  }

  if (error && rooms.length === 0) {
    return (
      <div className="app-container">
        <ErrMsg error={error} onRetry={() => window.location.reload()} onDismiss={() => setError(null)} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast(t => ({ ...t, show: false }))} />}
      {toastRemote.show && <Toast message={toastRemote.message} type={toastRemote.type} onClose={() => setToastRemote(t => ({ ...t, show: false }))} />}
      {error && <ErrMsg error={error} onDismiss={() => setError(null)} />}
      {isSubmitting && <Spinner overlay message="Saving…" />}

      <div className="dashboard-stats">
        <div className="stat-card"><h3>Total Rooms</h3><p className="stat-number">{rooms.length}</p></div>
        <div className="stat-card"><h3>Active</h3><p className="stat-number" style={{ color: '#22c55e' }}>{activeCount}</p></div>
        <div className="stat-card"><h3>Inactive</h3><p className="stat-number" style={{ color: '#ef4444' }}>{inactiveCount}</p></div>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Room Management</h2>
          {isAdmin && (
            <button className="rm-btn rm-btn-success" onClick={openCreateModal} disabled={isSubmitting}>+ Add Room</button>
          )}
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="rm-search">Search:</label>
            <input id="rm-search" type="text" className="filter-select" placeholder="Name or room number…" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>
          <div className="filter-group">
            <label htmlFor="rm-status">Status:</label>
            <select id="rm-status" className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value as 'all' | 'active' | 'inactive'); setCurrentPage(1); }}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="rm-location">Location:</label>
            <select id="rm-location" className="filter-select" value={locationFilter} onChange={e => { setLocationFilter(e.target.value); setCurrentPage(1); }}>
              <option value="All">All Locations</option>
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <p className="empty-message">No rooms match the current filters.</p>
        ) : (
          <>
            <div className="rm-table-wrapper">
              <table className="rm-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Room #</th><th>Capacity</th><th>Location</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRooms.map(room => (
                    <tr key={room.id} className={room.isActive ? '' : 'rm-row-inactive'}>
                      <td>{room.id}</td>
                      <td>{room.name}</td>
                      <td>{room.number}</td>
                      <td>{room.capacity}</td>
                      <td>{room.location}</td>
                      <td><span className={`rm-badge ${room.isActive ? 'rm-badge-active' : 'rm-badge-inactive'}`}>{room.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="rm-actions">
                        <button className="rm-btn rm-btn-edit" onClick={() => openEditModal(room)} disabled={isSubmitting}>Edit</button>
                        <button className={`rm-btn ${room.isActive ? 'rm-btn-warning' : 'rm-btn-success'}`} onClick={() => handleToggleStatus(room)} disabled={isSubmitting}>
                          {room.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        {room.isActive && (
                          <button className="rm-btn rm-btn-danger" onClick={() => handleDeactivate(room)} disabled={isSubmitting}>Remove</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="rm-pagination">
                <button className="rm-btn rm-btn-secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>← Prev</button>
                <span className="rm-page-info">Page {safePage} of {totalPages} ({filteredRooms.length} rooms)</span>
                <button className="rm-btn rm-btn-secondary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next →</button>
              </div>
            )}
          </>
        )}
      </section>

      {showCreateModal && (
        <div className="rm-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="rm-modal">
            <div className="rm-modal-header">
              <h3>{editingRoom ? `Edit Room — ${editingRoom.name}` : 'Add New Room'}</h3>
              <button className="rm-modal-close" onClick={closeModal} aria-label="Close">✕</button>
            </div>
            <form className="rm-form" onSubmit={handleSubmit}>
              <div className="rm-form-group">
                <label htmlFor="rm-name">Room Name <span className="required">*</span></label>
                <input id="rm-name" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Boardroom Alpha" required />
              </div>
              <div className="rm-form-row">
                <div className="rm-form-group">
                  <label htmlFor="rm-number">Room Number <span className="required">*</span></label>
                  <input id="rm-number" type="number" min={1} value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} placeholder="e.g., 101" required />
                </div>
                <div className="rm-form-group">
                  <label htmlFor="rm-capacity">Capacity <span className="required">*</span></label>
                  <input id="rm-capacity" type="number" min={1} value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="e.g., 12" required />
                </div>
              </div>
              <div className="rm-form-group">
                <label htmlFor="rm-location-select">Location <span className="required">*</span></label>
                <select id="rm-location-select" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required>
                  {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              <div className="rm-form-group rm-form-checkbox">
                <label htmlFor="rm-isactive">
                  <input id="rm-isactive" type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                  Active (room available for booking)
                </label>
              </div>
              <div className="rm-modal-footer">
                <button type="button" className="rm-btn rm-btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="rm-btn rm-btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : editingRoom ? 'Save Changes' : 'Create Room'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
