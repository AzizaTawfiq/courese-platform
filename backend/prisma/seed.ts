import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@12345', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@matraining.com' },
    update: {
      fullName: 'MA Super Admin',
      companyName: 'MA Training',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: 'admin@matraining.com',
      fullName: 'MA Super Admin',
      companyName: 'MA Training',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  const program = await prisma.program.upsert({
    where: { slug: 'project-management' },
    update: {
      nameAr: 'إدارة المشاريع',
      nameEn: 'Project Management',
      descriptionAr: 'برنامج تأسيسي لإدارة المشاريع المؤسسية.',
      descriptionEn: 'A foundational program for corporate project management.',
      seoTitleAr: 'إدارة المشاريع | MA Training',
      seoTitleEn: 'Project Management | MA Training',
      seoDescAr: 'تعرف على برامج إدارة المشاريع المتاحة للشركات.',
      seoDescEn: 'Explore project management programs built for corporate teams.',
    },
    create: {
      slug: 'project-management',
      nameAr: 'إدارة المشاريع',
      nameEn: 'Project Management',
      descriptionAr: 'برنامج تأسيسي لإدارة المشاريع المؤسسية.',
      descriptionEn: 'A foundational program for corporate project management.',
      seoTitleAr: 'إدارة المشاريع | MA Training',
      seoTitleEn: 'Project Management | MA Training',
      seoDescAr: 'تعرف على برامج إدارة المشاريع المتاحة للشركات.',
      seoDescEn: 'Explore project management programs built for corporate teams.',
    },
  });

  const category =
    (await prisma.category.findFirst({
      where: { programId: program.id, nameEn: 'Management Fundamentals' },
    })) ??
    (await prisma.category.create({
      data: {
        programId: program.id,
        nameAr: 'أساسيات الإدارة',
        nameEn: 'Management Fundamentals',
        descriptionAr: 'فئة تعريفية للمقررات الأساسية.',
        descriptionEn: 'Introductory category for core courses.',
      },
    }));

  const kickoffCourse = await prisma.course.upsert({
    where: { slug: 'project-kickoff-essentials' },
    update: {
      categoryId: category.id,
      nameAr: 'أساسيات بدء المشروع',
      nameEn: 'Project Kickoff Essentials',
      descriptionAr: 'مقرر تأسيسي لتخطيط انطلاقة المشروع.',
      descriptionEn: 'A starter course for planning and leading project kickoffs.',
      durationHours: 12,
      price: 3200,
      currency: 'SAR',
      seoTitleAr: 'أساسيات بدء المشروع | MA Training',
      seoTitleEn: 'Project Kickoff Essentials | MA Training',
      seoDescAr: 'مقرر تدريبي لتأسيس المشاريع بنجاح.',
      seoDescEn: 'Training course to launch projects successfully.',
    },
    create: {
      categoryId: category.id,
      slug: 'project-kickoff-essentials',
      nameAr: 'أساسيات بدء المشروع',
      nameEn: 'Project Kickoff Essentials',
      descriptionAr: 'مقرر تأسيسي لتخطيط انطلاقة المشروع.',
      descriptionEn: 'A starter course for planning and leading project kickoffs.',
      durationHours: 12,
      price: 3200,
      currency: 'SAR',
      seoTitleAr: 'أساسيات بدء المشروع | MA Training',
      seoTitleEn: 'Project Kickoff Essentials | MA Training',
      seoDescAr: 'مقرر تدريبي لتأسيس المشاريع بنجاح.',
      seoDescEn: 'Training course to launch projects successfully.',
    },
  });

  await prisma.course.upsert({
    where: { slug: 'risk-planning-foundations' },
    update: {
      categoryId: category.id,
      nameAr: 'أساسيات تخطيط المخاطر',
      nameEn: 'Risk Planning Foundations',
      descriptionAr: 'مقرر عملي لتحديد المخاطر وإدارتها.',
      descriptionEn: 'Hands-on course for identifying and managing project risks.',
      durationHours: 10,
      price: 2800,
      currency: 'SAR',
      seoTitleAr: 'أساسيات تخطيط المخاطر | MA Training',
      seoTitleEn: 'Risk Planning Foundations | MA Training',
      seoDescAr: 'تعلم تخطيط المخاطر لفرق العمل.',
      seoDescEn: 'Learn risk planning for professional teams.',
    },
    create: {
      categoryId: category.id,
      slug: 'risk-planning-foundations',
      nameAr: 'أساسيات تخطيط المخاطر',
      nameEn: 'Risk Planning Foundations',
      descriptionAr: 'مقرر عملي لتحديد المخاطر وإدارتها.',
      descriptionEn: 'Hands-on course for identifying and managing project risks.',
      durationHours: 10,
      price: 2800,
      currency: 'SAR',
      seoTitleAr: 'أساسيات تخطيط المخاطر | MA Training',
      seoTitleEn: 'Risk Planning Foundations | MA Training',
      seoDescAr: 'تعلم تخطيط المخاطر لفرق العمل.',
      seoDescEn: 'Learn risk planning for professional teams.',
    },
  });

  const existingSchedule = await prisma.schedule.findFirst({
    where: { courseId: kickoffCourse.id },
  });

  if (!existingSchedule) {
    await prisma.schedule.create({
      data: {
        courseId: kickoffCourse.id,
        startDate: new Date('2026-05-10T08:00:00.000Z'),
        endDate: new Date('2026-05-12T14:00:00.000Z'),
        location: 'Riyadh',
        maxCapacity: 20,
      },
    });
  }

  const existingScheduleFile = await prisma.scheduleFile.findFirst();

  if (!existingScheduleFile) {
    await prisma.scheduleFile.create({
      data: {
        filename: 'training-schedule-spring-2026.pdf',
        originalName: 'training-schedule-spring-2026.pdf',
        mimeType: 'application/pdf',
        fileUrl: '/uploads/schedule-files/training-schedule-spring-2026.pdf',
        uploadedBy: admin.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
