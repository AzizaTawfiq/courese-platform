export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Purchase {
  purchaseId: string;
  amount: string;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentIntent: string;
}

export interface Booking {
  id: string;
  reference: string;
  status: BookingStatus;
  courseNameAr: string;
  courseNameEn: string;
  scheduleStartDate: string;
  scheduleEndDate: string;
  amount: string;
  currency: string;
  createdAt: string;
}

export interface BookingListResponse {
  data: Booking[];
  total: number;
}

export interface SelectedScheduleSummary {
  scheduleId: string;
  courseSlug: string;
  courseNameAr: string;
  courseNameEn: string;
  startDate: string;
  endDate: string;
  location: string | null;
  availableSeats: number;
  price: string;
  currency: string;
}
