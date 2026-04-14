<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <div class="rounded-[2rem] bg-white/80 p-8 shadow-sm ring-1 ring-brand-100">
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-brand-500">
        {{ t('catalog.home.eyebrow') }}
      </p>
      <h1 class="mt-4 text-4xl font-semibold text-brand-900 md:text-5xl">
        {{ t('catalog.home.title') }}
      </h1>
      <p class="mt-4 max-w-3xl text-lg leading-8 text-brand-700">
        {{ t('catalog.home.description') }}
      </p>
    </div>

    <ScheduleBanner />

    <div class="mt-10 flex items-center justify-between gap-4">
      <div>
        <p
          class="text-sm font-medium uppercase tracking-[0.24em] text-brand-500"
        >
          {{ t('catalog.programsLabel') }}
        </p>
        <h2 class="mt-2 text-2xl font-semibold text-brand-900">
          {{ t('catalog.home.programsHeading') }}
        </h2>
      </div>
      <span
        class="rounded-full bg-white px-4 py-2 text-sm text-brand-600 ring-1 ring-brand-100"
      >
        {{ programsStore.programs.length }}
        {{ t('catalog.home.availablePrograms') }}
      </span>
    </div>

    <div
      v-if="programsStore.programs.length > 0"
      class="mt-6 grid gap-6 md:grid-cols-2"
    >
      <RouterLink
        v-for="program in programsStore.programs"
        :key="program.id"
        :to="`${localePrefix}/programs/${program.slug}`"
        class="group rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-brand-100 transition hover:-translate-y-1 hover:shadow-lg"
      >
        <p class="text-sm font-medium text-brand-500">
          {{ program.categoryCount }} {{ t('catalog.home.categoriesCount') }}
        </p>
        <h3 class="mt-3 text-2xl font-semibold text-brand-900">
          {{ getLocalizedProgramName(program) }}
        </h3>
        <p class="mt-3 line-clamp-3 text-brand-700">
          {{ getLocalizedProgramDescription(program) }}
        </p>
        <span
          class="mt-6 inline-flex items-center text-sm font-medium text-brand-700"
        >
          {{ t('catalog.home.exploreProgram') }}
        </span>
      </RouterLink>
    </div>

    <div
      v-else
      class="mt-6 rounded-3xl bg-white/80 p-6 text-brand-700 ring-1 ring-brand-100"
    >
      {{ t('catalog.noCourses') }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import ScheduleBanner from '@/modules/customer/components/ScheduleBanner.vue';
import { useSeo } from '@/shared/composables/useSeo';
import { useProgramsStore } from '@/shared/stores/programs';
import { useUIStore } from '@/shared/stores/ui';
import type { ProgramListItem } from '@/shared/types/catalog';

const { t } = useI18n();
const programsStore = useProgramsStore();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const localePrefix = computed(() => (locale.value === 'en' ? '/en' : ''));

const getLocalizedProgramName = (program: ProgramListItem) =>
  locale.value === 'ar' ? program.nameAr : program.nameEn;

const getLocalizedProgramDescription = (program: ProgramListItem) =>
  locale.value === 'ar' ? program.descriptionAr : program.descriptionEn;

useSeo({
  titleKey: 'catalog.home.seoTitle',
  descriptionKey: 'catalog.home.seoDescription',
  canonicalPath: computed(() => `${localePrefix.value || '/'}`),
  ogType: 'website',
  jsonLd: computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t('catalog.home.title'),
    url: `${import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173'}${localePrefix.value || '/'}`,
    inLanguage: locale.value,
  })),
});

onMounted(async () => {
  await programsStore.fetchPrograms();
});
</script>
