<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <div
      v-if="category"
      class="rounded-[2rem] bg-white/85 p-8 shadow-sm ring-1 ring-brand-100"
    >
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-brand-500">
        {{ t('catalog.category.eyebrow') }}
      </p>
      <h1 class="mt-4 text-4xl font-semibold text-brand-900">
        {{ localizedName }}
      </h1>
      <p class="mt-4 max-w-3xl text-lg leading-8 text-brand-700">
        {{ localizedDescription }}
      </p>
    </div>

    <div v-if="category" class="mt-10">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-2xl font-semibold text-brand-900">
          {{ t('catalog.category.coursesHeading') }}
        </h2>
        <span class="rounded-full bg-white px-4 py-2 text-sm text-brand-600 ring-1 ring-brand-100">
          {{ category.courses.length }} {{ t('catalog.program.coursesCount') }}
        </span>
      </div>

      <div
        v-if="category.courses.length > 0"
        class="mt-6 grid gap-6 md:grid-cols-2"
      >
        <RouterLink
          v-for="course in category.courses"
          :key="course.id"
          :to="`${localePrefix}/programs/${category.program.slug}/courses/${course.slug}`"
          class="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-brand-100 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-2xl font-semibold text-brand-900">
                {{ locale === 'ar' ? course.nameAr : course.nameEn }}
              </h3>
              <p class="mt-3 text-brand-700">
                {{ locale === 'ar' ? course.descriptionAr : course.descriptionEn }}
              </p>
            </div>
            <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              {{ course.upcomingScheduleCount }} {{ t('catalog.availableDates') }}
            </span>
          </div>
          <div class="mt-5 flex flex-wrap gap-4 text-sm text-brand-600">
            <span>{{ t('catalog.duration') }}: {{ course.durationHours }}</span>
            <span>{{ t('catalog.price') }}: {{ course.price }} {{ course.currency }}</span>
          </div>
        </RouterLink>
      </div>

      <div
        v-else
        class="mt-6 rounded-3xl bg-white/80 p-6 text-brand-700 ring-1 ring-brand-100"
      >
        {{ t('catalog.noCourses') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';
import { useLocaleContent } from '@/shared/composables/useLocaleContent';
import { useSeo } from '@/shared/composables/useSeo';
import { useProgramsStore } from '@/shared/stores/programs';
import { useUIStore } from '@/shared/stores/ui';

const route = useRoute();
const { t } = useI18n();
const programsStore = useProgramsStore();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const { currentCategory } = storeToRefs(programsStore);
const localePrefix = computed(() => (locale.value === 'en' ? '/en' : ''));

const category = currentCategory;
const localizedName = useLocaleContent(category, 'name');
const localizedDescription = useLocaleContent(category, 'description');

useSeo({
  title: computed(
    () => localizedName.value || t('catalog.category.seoFallbackTitle'),
  ),
  description: computed(
    () =>
      localizedDescription.value ||
      t('catalog.category.seoFallbackDescription'),
  ),
  canonicalPath: computed(
    () =>
      `${localePrefix.value}/programs/${String(route.params.programSlug ?? '')}/categories/${String(route.params.id ?? '')}`,
  ),
  ogType: 'website',
  jsonLd: computed(() => {
    if (!category.value) {
      return null;
    }

    const baseUrl = import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173';
    const homeUrl = `${baseUrl}${localePrefix.value || '/'}`;
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('catalog.home.title'),
          item: homeUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name:
            locale.value === 'ar'
              ? category.value.program.nameAr
              : category.value.program.nameEn,
          item: `${baseUrl}${localePrefix.value}/programs/${category.value.program.slug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: localizedName.value,
          item: `${baseUrl}${localePrefix.value}/programs/${category.value.program.slug}/categories/${category.value.id}`,
        },
      ],
    };
  }),
});

watch(
  () => [route.params.programSlug, route.params.id],
  async ([programSlug, id]) => {
    if (typeof programSlug === 'string' && typeof id === 'string') {
      try {
        await programsStore.fetchCategory(programSlug, id);
      } catch {
        // Null state is rendered by the template.
      }
    }
  },
  { immediate: true },
);
</script>
