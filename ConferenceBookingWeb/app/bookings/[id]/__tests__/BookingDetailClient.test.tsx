/**
 * BookingDetailClient.test.tsx
 *
 * Tests the four render states of BookingDetailClient:
 *   1. Loading  — while the async fetch is in-flight
 *   2. Success  — API returns a full booking object
 *   3. Not Found — API rejects with HTTP 404
 *   4. Error    — API rejects with any other error
 *
 * Strategy: mock `getBookingById` from bookingService so no real HTTP
 * calls are made. The component's behaviour is driven entirely by what
 * that mock returns/throws.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BookingDetailClient from '../BookingDetailClient';
import * as bookingService from '../../../../src/services/bookingService';

// ── Mock the service module ──────────────────────────────────────────────────
jest.mock('../../../../src/services/bookingService');

const mockGetBookingById = bookingService.getBookingById as jest.Mock;

// ── Shared fixture ───────────────────────────────────────────────────────────
const fakeBooking = {
  bookingId: 42,
  roomId: 1,
  roomName: 'Main Hall',
  roomNumber: 101,
  location: 'Floor 2',
  isRoomActive: true,
  requestedBy: 'alice@example.com',
  startTime: '2026-03-11T09:00:00',
  endTime: '2026-03-11T10:00:00',
  status: 'Confirmed',
  capacity: 20,
  createdAt: '2026-03-01T00:00:00',
  cancelledAt: null,
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('BookingDetailClient', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows a loading spinner while the fetch is in-flight', () => {
    // Never resolves → component stays in the loading state
    mockGetBookingById.mockReturnValue(new Promise(() => {}));

    render(<BookingDetailClient id="42" />);

    expect(screen.getByText(/Loading booking #42/i)).toBeInTheDocument();
    // The spinner has an aria-label we can assert on
    expect(screen.getByLabelText(/Loading booking #42/i)).toBeInTheDocument();
  });

  it('renders booking details after a successful fetch', async () => {
    mockGetBookingById.mockResolvedValue(fakeBooking);

    render(<BookingDetailClient id="42" />);

    // Wait for loading to finish and booking data to appear
    await waitFor(() =>
      expect(screen.getByText('Main Hall')).toBeInTheDocument()
    );

    expect(screen.getByText(/Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/alice@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Floor 2/i)).toBeInTheDocument();
  });

  it('shows the "Booking Not Found" view when the API returns 404', async () => {
    mockGetBookingById.mockRejectedValue({ response: { status: 404 } });

    render(<BookingDetailClient id="99" />);

    await waitFor(() =>
      expect(screen.getByText('Booking Not Found')).toBeInTheDocument()
    );

    // The friendly message should include the requested ID
    expect(screen.getByText(/#99/i)).toBeInTheDocument();
  });

  it('shows a generic error message when the API fails with a non-404 error', async () => {
    mockGetBookingById.mockRejectedValue({
      response: { status: 500 },
      message: 'Internal Server Error',
    });

    render(<BookingDetailClient id="42" />);

    await waitFor(() =>
      expect(screen.getByText(/Internal Server Error/i)).toBeInTheDocument()
    );
  });

  it('uses the id prop to call getBookingById with the parsed numeric id', async () => {
    mockGetBookingById.mockResolvedValue(fakeBooking);

    render(<BookingDetailClient id="42" />);

    await waitFor(() => expect(mockGetBookingById).toHaveBeenCalledWith(42));
  });
});
