<template>
  <button
    v-if="downloadUrl"
    class="group mt-8 block overflow-hidden rounded-[2rem] bg-brand-900 text-white shadow-xl shadow-brand-900/15 transition hover:-translate-y-1"
    type="button"
    @click="handleDownload"
  >
    <div class="relative px-6 py-6 sm:px-8 sm:py-7">
      <div
        class="absolute inset-y-0 end-0 w-40 bg-gradient-to-s from-brand-300/20 to-transparent blur-2xl"
      />
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-brand-200">
        {{ t('catalog.scheduleBanner.eyebrow') }}
      </p>
      <div
        class="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="max-w-2xl">
          <h2 class="text-2xl font-semibold sm:text-3xl">
            {{ t('catalog.scheduleBanner.title') }}
          </h2>
          <p class="mt-3 text-sm leading-7 text-brand-100 sm:text-base">
            {{ t('catalog.scheduleBanner.description') }}
          </p>
        </div>
        <span
          class="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-900 transition group-hover:bg-brand-100"
        >
          {{ t('catalog.scheduleBanner.cta') }}
        </span>
      </div>
    </div>
  </button>
  <div
    v-else-if="props.showUnavailableMessage"
    class="mt-8 rounded-[2rem] border border-dashed border-brand-200 bg-brand-50/70 px-6 py-5 text-sm text-brand-700"
  >
    {{ t('catalog.scheduleBanner.unavailable') }}
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { adminService } from '@/shared/services/adminService';

const props = withDefaults(
  defineProps<{
    showUnavailableMessage?: boolean;
  }>(),
  {
    showUnavailableMessage: false,
  },
);

const { t } = useI18n();
const downloadUrl = ref<string | null>(null);
const activeObjectUrl = ref<string | null>(null);

onMounted(async () => {
  try {
    downloadUrl.value = await adminService.getScheduleFileDownloadUrl();
  } catch {
    downloadUrl.value = null;
  }
});

onBeforeUnmount(() => {
  if (activeObjectUrl.value) {
    globalThis.URL.revokeObjectURL(activeObjectUrl.value);
  }
});

const handleDownload = async () => {
  try {
    const { objectUrl, filename } = await adminService.downloadScheduleFile();

    if (activeObjectUrl.value) {
      globalThis.URL.revokeObjectURL(activeObjectUrl.value);
    }

    activeObjectUrl.value = objectUrl;

    const anchor = globalThis.document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.rel = 'noopener';
    globalThis.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } catch {
    downloadUrl.value = null;
  }
};
</script>
