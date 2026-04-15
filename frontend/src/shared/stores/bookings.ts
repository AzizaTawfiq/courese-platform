import { ref } from 'vue';
import { defineStore } from 'pinia';
import { bookingsService } from '@/shared/services/bookingsService';
import type { Booking, SelectedScheduleSummary } from '@/shared/types/booking';

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref<Booking[]>([]);
  const activeBooking = ref<Booking | null>(null);
  const selectedSchedule = ref<SelectedScheduleSummary | null>(null);

  const fetchBookings = async () => {
    const response = await bookingsService.listBookings();
    bookings.value = response.data;
    return response;
  };

  const setActiveBooking = (booking: Booking | null) => {
    activeBooking.value = booking;
  };

  const setSelectedSchedule = (schedule: SelectedScheduleSummary | null) => {
    selectedSchedule.value = schedule;
  };

  return {
    bookings,
    activeBooking,
    selectedSchedule,
    fetchBookings,
    setActiveBooking,
    setSelectedSchedule,
  };
});
