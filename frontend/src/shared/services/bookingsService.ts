import api from './api';
import type {
  Booking,
  BookingListResponse,
  Purchase,
} from '@/shared/types/booking';

export const bookingsService = {
  async createPurchase(scheduleId: string) {
    const { data } = await api.post<Purchase>('/purchases', { scheduleId });
    return data;
  },

  async confirmPurchase(purchaseId: string) {
    const { data } = await api.post<{
      received: boolean;
      reference: string | null;
    }>(`/purchases/${purchaseId}/confirm`, {
      status: 'success',
    });

    return data;
  },

  async listBookings() {
    const { data } = await api.get<BookingListResponse>('/bookings');
    return data;
  },

  async getBooking(reference: string) {
    const { data } = await api.get<Booking>(`/bookings/${reference}`);
    return data;
  },
};
