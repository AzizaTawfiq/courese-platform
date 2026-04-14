import { computed, unref, type MaybeRef } from 'vue';
import { useHead } from '@vueuse/head';
import { useI18n } from 'vue-i18n';

interface SeoOptions {
  titleKey?: MaybeRef<string>;
  title?: MaybeRef<string>;
  descriptionKey?: MaybeRef<string>;
  description?: MaybeRef<string>;
  canonicalPath: MaybeRef<string>;
  ogType?: MaybeRef<string>;
  jsonLd?: MaybeRef<Record<string, unknown> | null>;
}

export const useSeo = (options: SeoOptions) => {
  const { t } = useI18n();
  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173';

  const title = computed(() => {
    if (options.title) {
      return unref(options.title);
    }

    return options.titleKey ? t(unref(options.titleKey)) : '';
  });

  const description = computed(() => {
    if (options.description) {
      return unref(options.description);
    }

    return options.descriptionKey ? t(unref(options.descriptionKey)) : '';
  });
  const canonicalUrl = computed(() =>
    new URL(unref(options.canonicalPath), siteUrl).toString(),
  );

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      {
        property: 'og:type',
        content: computed(() => unref(options.ogType) ?? 'website'),
      },
    ],
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: computed(() => {
      const payload = unref(options.jsonLd);
      return payload
        ? [{ type: 'application/ld+json', children: JSON.stringify(payload) }]
        : [];
    }),
  });
};
