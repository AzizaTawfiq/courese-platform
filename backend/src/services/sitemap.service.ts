import { prisma } from '../lib/prisma.js';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const buildUrlNode = (
  defaultUrl: string,
  alternateUrl: string,
  updatedAt: string,
) => {
  const escapedDefaultUrl = escapeXml(defaultUrl);
  const escapedAlternateUrl = escapeXml(alternateUrl);

  return `  <url>
    <loc>${escapedDefaultUrl}</loc>
    <lastmod>${updatedAt}</lastmod>
    <xhtml:link rel="alternate" hreflang="ar" href="${escapedDefaultUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapedAlternateUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapedDefaultUrl}" />
  </url>`;
};

export const generateSitemapXml = async () => {
  const siteUrl =
    process.env.FRONTEND_URL ?? process.env.BASE_URL ?? 'http://localhost:5173';

  const [programs, categories, courses] = await Promise.all([
    prisma.program.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      where: {
        isActive: true,
        program: { isActive: true },
      },
      select: {
        id: true,
        updatedAt: true,
        program: { select: { slug: true } },
      },
    }),
    prisma.course.findMany({
      where: {
        isActive: true,
        category: {
          isActive: true,
          program: { isActive: true },
        },
      },
      select: {
        slug: true,
        updatedAt: true,
        category: {
          select: {
            program: { select: { slug: true } },
          },
        },
      },
    }),
  ]);

  const urls = [
    buildUrlNode(
      new URL('/', siteUrl).toString(),
      new URL('/en', siteUrl).toString(),
      new Date().toISOString(),
    ),
    ...programs.map((program) =>
      buildUrlNode(
        new URL(`/programs/${program.slug}`, siteUrl).toString(),
        new URL(`/en/programs/${program.slug}`, siteUrl).toString(),
        program.updatedAt.toISOString(),
      ),
    ),
    ...categories.map((category) =>
      buildUrlNode(
        new URL(
          `/programs/${category.program.slug}/categories/${category.id}`,
          siteUrl,
        ).toString(),
        new URL(
          `/en/programs/${category.program.slug}/categories/${category.id}`,
          siteUrl,
        ).toString(),
        category.updatedAt.toISOString(),
      ),
    ),
    ...courses.map((course) =>
      buildUrlNode(
        new URL(
          `/programs/${course.category.program.slug}/courses/${course.slug}`,
          siteUrl,
        ).toString(),
        new URL(
          `/en/programs/${course.category.program.slug}/courses/${course.slug}`,
          siteUrl,
        ).toString(),
        course.updatedAt.toISOString(),
      ),
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
};
