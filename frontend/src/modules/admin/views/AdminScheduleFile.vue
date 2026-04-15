<template>
  <section class="space-y-4">
    <h1 class="text-3xl font-semibold text-white">
      {{ t('admin.scheduleFile') }}
    </h1>
    <p class="text-sm text-slate-400">
      {{ t('admin.scheduleFilePhaseLater') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
