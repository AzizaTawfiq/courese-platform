<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <div
      v-if="program"
      class="rounded-[2rem] bg-white/85 p-8 shadow-sm ring-1 ring-brand-100"
    >
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-brand-500">
        {{ t('catalog.programsLabel') }}
      </p>
      <h1 class="mt-4 text-4xl font-semibold text-brand-900">
        {{ localizedName }}
      </h1>
      <p class="mt-4 max-w-3xl text-lg leading-8 text-brand-700">
        {{ localizedDescription }}
      </p>
    </div>

    <div v-if="program" class="mt-10">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-2xl font-semibold text-brand-900">
          {{ t('catalog.program.categoriesHeading') }}
        </h2>
        <span
          class="rounded-full bg-white px-4 py-2 text-sm text-brand-600 ring-1 ring-brand-100"
        >
          {{ program.categories.length }}
          {{ t('catalog.program.categoriesCount') }}
        </span>
      </div>

      <div
        v-if="program.categories.length > 0"
        class="mt-6 grid gap-6 md:grid-cols-2"
      >
        <RouterLink
          v-for="category in program.categories"
          :key="category.id"
          :to="`${localePrefix}/programs/${program.slug}/categories/${category.id}`"
          class="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-brand-100 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <p class="text-sm font-medium text-brand-500">
            {{ category.courseCount }} {{ t('catalog.program.coursesCount') }}
          </p>
          <h3 class="mt-3 text-2xl font-semibold text-brand-900">
            {{ locale === 'ar' ? category.nameAr : category.nameEn }}
          </h3>
          <p class="mt-3 text-brand-700">
            {{
              locale === 'ar' ? category.descriptionAr : category.descriptionEn
            }}
          </p>
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

defineOptions({
  name: 'ProgramCatalogView',
});

const route = useRoute();
const { t } = useI18n();
const programsStore = useProgramsStore();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const { currentProgram } = storeToRefs(programsStore);
const localePrefix = computed(() => (locale.value === 'en' ? '/en' : ''));

const program = currentProgram;
const localizedName = useLocaleContent(program, 'name');
const localizedDescription = useLocaleContent(program, 'description');

useSeo({
  title: computed(
    () =>
      program.value?.[locale.value === 'ar' ? 'seoTitleAr' : 'seoTitleEn'] ??
      t('catalog.program.seoFallbackTitle'),
  ),
  description: computed(
    () =>
      program.value?.[locale.value === 'ar' ? 'seoDescAr' : 'seoDescEn'] ??
      t('catalog.program.seoFallbackDescription'),
  ),
  canonicalPath: computed(
    () => `${localePrefix.value}/programs/${String(route.params.slug ?? '')}`,
  ),
  ogType: 'website',
  jsonLd: computed(() => {
    if (!program.value) {
      return null;
    }

    const baseUrl = import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173';
    const homeUrl = `${baseUrl}${localePrefix.value || '/'}`;
    const programUrl = `${baseUrl}${localePrefix.value}/programs/${program.value.slug}`;

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
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
              name: localizedName.value,
              item: programUrl,
            },
          ],
        },
        {
          '@type': 'EducationalOrganization',
          name: localizedName.value,
          description: localizedDescription.value,
          url: programUrl,
        },
      ],
    };
  }),
});

watch(
  () => route.params.slug,
  async (slug) => {
    if (typeof slug === 'string') {
      try {
        await programsStore.fetchProgram(slug);
      } catch {
        // Null state is rendered by the template.
      }
    }
  },
  { immediate: true },
);
</script>
