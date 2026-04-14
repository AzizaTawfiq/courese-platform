<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <div
      v-if="course"
      class="rounded-[2rem] bg-white/85 p-8 shadow-sm ring-1 ring-brand-100"
    >
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-brand-500">
        {{ t('catalog.course.eyebrow') }}
      </p>
      <h1 class="mt-4 text-4xl font-semibold text-brand-900">
        {{ localizedName }}
      </h1>
      <p class="mt-4 max-w-3xl text-lg leading-8 text-brand-700">
        {{ localizedDescription }}
      </p>

      <div class="mt-8 flex flex-wrap gap-4 text-sm text-brand-700">
        <span class="rounded-full bg-brand-50 px-4 py-2">
          {{ t('catalog.duration') }}: {{ course.durationHours }}
        </span>
        <span class="rounded-full bg-brand-50 px-4 py-2">
          {{ t('catalog.price') }}: {{ course.price }} {{ course.currency }}
        </span>
      </div>
    </div>

    <div v-if="course" class="mt-10">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-2xl font-semibold text-brand-900">
          {{ t('catalog.availableDates') }}
        </h2>
        <RouterLink
          class="rounded-full bg-brand-700 px-5 py-3 text-sm font-medium text-white"
          :to="`${localePrefix}/login`"
        >
          {{ t('catalog.bookNow') }}
        </RouterLink>
      </div>

      <div
        v-if="course.schedules.length > 0"
        class="mt-6 grid gap-5 md:grid-cols-2"
      >
        <article
          v-for="schedule in course.schedules"
          :key="schedule.id"
          class="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-brand-100"
        >
          <h3 class="text-lg font-semibold text-brand-900">
            {{ formatDateRange(schedule.startDate, schedule.endDate) }}
          </h3>
          <p class="mt-3 text-brand-700">
            {{ schedule.location || t('catalog.course.onlineLocation') }}
          </p>
          <div class="mt-4 flex flex-wrap gap-3 text-sm text-brand-600">
            <span class="rounded-full bg-brand-50 px-3 py-1">
              {{ t('catalog.availableSeats') }}: {{ schedule.availableSeats }}
            </span>
            <span class="rounded-full bg-brand-50 px-3 py-1">
              {{ t('catalog.course.confirmedBookings') }}: {{ schedule.confirmedBookings }}
            </span>
          </div>
        </article>
      </div>

      <div
        v-else
        class="mt-6 rounded-3xl bg-white/80 p-6 text-brand-700 ring-1 ring-brand-100"
      >
        {{ t('catalog.noUpcomingDates') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useLocaleContent } from '@/shared/composables/useLocaleContent';
import { useSeo } from '@/shared/composables/useSeo';
import { useCoursesStore } from '@/shared/stores/courses';
import { useUIStore } from '@/shared/stores/ui';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const coursesStore = useCoursesStore();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const { currentCourse } = storeToRefs(coursesStore);
const localePrefix = computed(() => (locale.value === 'en' ? '/en' : ''));

const course = currentCourse;
const localizedName = useLocaleContent(course, 'name');
const localizedDescription = useLocaleContent(course, 'description');

const formatDateRange = (startDate: string, endDate: string) => {
  const formatter = new Intl.DateTimeFormat(
    locale.value === 'ar' ? 'ar-EG' : 'en-US',
    {
      dateStyle: 'medium',
    },
  );
  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
};

useSeo({
  title: computed(
    () =>
      course.value?.[locale.value === 'ar' ? 'seoTitleAr' : 'seoTitleEn'] ??
      t('catalog.course.seoFallbackTitle'),
  ),
  description: computed(
    () =>
      course.value?.[locale.value === 'ar' ? 'seoDescAr' : 'seoDescEn'] ??
      t('catalog.course.seoFallbackDescription'),
  ),
  canonicalPath: computed(
    () =>
      `${localePrefix.value}/programs/${course.value?.category.program.slug ?? String(route.params.slug ?? '')}/courses/${course.value?.slug ?? String(route.params.courseSlug ?? '')}`,
  ),
  ogType: 'website',
  jsonLd: computed(() => {
    if (!course.value) {
      return null;
    }

    const baseUrl = import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173';
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: localizedName.value,
      description: localizedDescription.value,
      provider: {
        '@type': 'Organization',
        name: 'MA Training',
      },
      url: `${baseUrl}${localePrefix.value}/programs/${course.value.category.program.slug}/courses/${course.value.slug}`,
      hasCourseInstance: course.value.schedules.map((schedule) => ({
        '@type': 'CourseInstance',
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        courseMode: schedule.location ?? 'Online',
      })),
    };
  }),
});

watch(
  () => [route.params.slug, route.params.courseSlug],
  async ([programSlug, courseSlug]) => {
    if (typeof courseSlug !== 'string') {
      return;
    }

    try {
      const loadedCourse = await coursesStore.fetchCourse(courseSlug);

      if (
        loadedCourse &&
        typeof programSlug === 'string' &&
        loadedCourse.category.program.slug !== programSlug
      ) {
        await router.replace(
          `${localePrefix.value}/programs/${loadedCourse.category.program.slug}/courses/${loadedCourse.slug}`,
        );
      }
    } catch {
      // Null state is rendered by the template.
    }
  },
  { immediate: true },
);
</script>
