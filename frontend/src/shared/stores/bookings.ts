import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface DashboardBookingPreview {
  id: string;
  reference: string;
}

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref<DashboardBookingPreview[]>([]);

  const fetchBookings = async () => bookings.value;

  return {
    bookings,
    fetchBookings,
  };
});
