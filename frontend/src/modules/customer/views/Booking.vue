<template>
  <section v-if="selectedSchedule" class="space-y-6">
    <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-brand-100">
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-brand-500">
        {{ t('booking.title') }}
      </p>
      <h1 class="mt-4 text-3xl font-semibold text-brand-900">
        {{ localizedCourseName }}
      </h1>
      <p class="mt-3 text-brand-700">
        {{
          formatDateRange(selectedSchedule.startDate, selectedSchedule.endDate)
        }}
      </p>
      <p class="mt-2 text-brand-700">
        {{ selectedSchedule.location || t('catalog.course.onlineLocation') }}
      </p>
      <div class="mt-6 flex flex-wrap gap-3 text-sm text-brand-700">
        <span class="rounded-full bg-brand-50 px-4 py-2">
          {{ t('catalog.availableSeats') }}:
          {{ selectedSchedule.availableSeats }}
        </span>
        <span class="rounded-full bg-brand-50 px-4 py-2">
          {{ t('catalog.price') }}: {{ selectedSchedule.price }}
          {{ selectedSchedule.currency }}
        </span>
      </div>
    </div>

    <div
      v-if="confirmationBooking"
      class="rounded-[2rem] bg-brand-900 p-8 text-white shadow-sm"
    >
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-brand-200">
        {{ t('booking.confirmed') }}
      </p>
      <p class="mt-4 text-2xl font-semibold">
        {{ t('booking.reference') }}: {{ confirmationBooking.reference }}
      </p>
      <RouterLink
        class="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-900"
        :to="`${localePrefix}/dashboard`"
      >
        {{ t('booking.viewDashboard') }}
      </RouterLink>
    </div>

    <div
      v-else
      class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-brand-100"
    >
      <p class="text-brand-700">
        {{ t('booking.checkoutHint') }}
      </p>
      <button
        v-if="!purchase"
        class="mt-6 rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-brand-300"
        type="button"
        :disabled="submitting"
        @click="startCheckout"
      >
        {{ t('booking.proceed') }}
      </button>

      <div v-else class="mt-6 space-y-4">
        <div class="rounded-[1.5rem] bg-brand-50 p-5 text-sm text-brand-800">
          <p>{{ t('booking.paymentIntent') }}: {{ purchase.paymentIntent }}</p>
          <p class="mt-2">
            {{ t('catalog.price') }}: {{ purchase.amount }}
            {{ purchase.currency }}
          </p>
        </div>
        <button
          class="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-brand-300"
          type="button"
          :disabled="submitting"
          @click="simulatePayment"
        >
          {{ t('booking.simulatePayment') }}
        </button>
      </div>

      <p v-if="errorMessage" class="mt-4 text-sm text-red-600">
        {{ errorMessage }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { coursesService } from '@/shared/services/coursesService';
import { bookingsService } from '@/shared/services/bookingsService';
import { useBookingsStore } from '@/shared/stores/bookings';
import { useUIStore } from '@/shared/stores/ui';
import type { Purchase } from '@/shared/types/booking';

defineOptions({
  name: 'CustomerBookingView',
});

const route = useRoute();
const router = useRouter();
const bookingsStore = useBookingsStore();
const uiStore = useUIStore();
const { t } = useI18n();
const { locale } = storeToRefs(uiStore);
const { activeBooking, selectedSchedule } = storeToRefs(bookingsStore);
const purchase = ref<Purchase | null>(null);
const submitting = ref(false);
const errorMessage = ref('');

const localePrefix = computed(() => (locale.value === 'en' ? '/en' : ''));
const confirmationBooking = computed(() => activeBooking.value);

watch(
  [selectedSchedule, () => route.params.scheduleId, localePrefix],
  async ([schedule, scheduleId, prefix]) => {
    if (
      confirmationBooking.value &&
      schedule &&
      schedule.scheduleId === scheduleId
    ) {
      bookingsStore.setActiveBooking(null);
    }

    if (
      schedule &&
      schedule.scheduleId === scheduleId &&
      !confirmationBooking.value
    ) {
      return;
    }

    const courseSlug =
      typeof route.query.courseSlug === 'string' ? route.query.courseSlug : '';

    if (courseSlug && typeof scheduleId === 'string') {
      try {
        const course = await coursesService.getCourse(courseSlug);
        const matchedSchedule = course.schedules.find(
          (entry) => entry.id === scheduleId,
        );

        if (matchedSchedule) {
          bookingsStore.setSelectedSchedule({
            scheduleId: matchedSchedule.id,
            courseSlug: course.slug,
            courseNameAr: course.nameAr,
            courseNameEn: course.nameEn,
            startDate: matchedSchedule.startDate,
            endDate: matchedSchedule.endDate,
            location: matchedSchedule.location,
            availableSeats: matchedSchedule.availableSeats,
            price: course.price,
            currency: course.currency,
          });
          return;
        }
      } catch {
        // Fall back to the dashboard redirect below.
      }
    }

    if (!confirmationBooking.value) {
      await router.replace(`${prefix}/dashboard`);
    }
  },
  { immediate: true },
);

const localizedCourseName = computed(() =>
  locale.value === 'ar'
    ? (selectedSchedule.value?.courseNameAr ?? '')
    : (selectedSchedule.value?.courseNameEn ?? ''),
);

const formatDateRange = (startDate: string, endDate: string) => {
  const formatter = new Intl.DateTimeFormat(
    locale.value === 'ar' ? 'ar-EG' : 'en-US',
    { dateStyle: 'medium' },
  );

  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
};

const startCheckout = async () => {
  if (!selectedSchedule.value) {
    return;
  }

  submitting.value = true;
  errorMessage.value = '';

  try {
    bookingsStore.setActiveBooking(null);
    purchase.value = await bookingsService.createPurchase(
      selectedSchedule.value.scheduleId,
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message ?? t('booking.error');
    } else {
      errorMessage.value = t('booking.error');
    }
  } finally {
    submitting.value = false;
  }
};

const simulatePayment = async () => {
  if (!purchase.value) {
    return;
  }

  submitting.value = true;
  errorMessage.value = '';

  try {
    const confirmation = await bookingsService.confirmPurchase(
      purchase.value.purchaseId,
    );

    if (!confirmation.reference) {
      errorMessage.value = t('booking.error');
      return;
    }

    const booking = await bookingsService.getBooking(confirmation.reference);
    bookingsStore.setActiveBooking(booking);
    await bookingsStore.fetchBookings();
    bookingsStore.setSelectedSchedule(null);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message ?? t('booking.error');
    } else {
      errorMessage.value = t('booking.error');
    }
  } finally {
    submitting.value = false;
  }
};
</script>
