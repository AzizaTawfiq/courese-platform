export interface AdminProgram {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescAr: string;
  seoDescEn: string;
  seoKeywordsAr?: string | null;
  seoKeywordsEn?: string | null;
  updatedAt: string;
  categoryCount: number;
  isActive: boolean;
}

export interface AdminCategory {
  id: string;
  programId: string;
  programSlug: string;
  programNameAr: string;
  programNameEn: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  updatedAt: string;
  courseCount: number;
  isActive: boolean;
}

export interface AdminCourse {
  id: string;
  slug: string;
  categoryId: string;
  programId: string;
  programNameAr: string;
  programNameEn: string;
  categoryNameAr: string;
  categoryNameEn: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  durationHours: number;
  price: string;
  currency: string;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescAr: string;
  seoDescEn: string;
  seoKeywordsAr?: string | null;
  seoKeywordsEn?: string | null;
  updatedAt: string;
  scheduleCount: number;
  isActive: boolean;
}

export interface AdminSchedule {
  id: string;
  courseId: string;
  courseNameAr: string;
  courseNameEn: string;
  startDate: string;
  endDate: string;
  location: string | null;
  maxCapacity: number;
  confirmedBookings: number;
  availableSeats: number;
  isActive: boolean;
}

export interface CreateProgramPayload {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescAr: string;
  seoDescEn: string;
  seoKeywordsAr?: string;
  seoKeywordsEn?: string;
  isActive?: boolean;
}

export type UpdateProgramPayload = CreateProgramPayload;

export interface CreateCategoryPayload {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive?: boolean;
}

export type UpdateCategoryPayload = CreateCategoryPayload;

export interface CreateCoursePayload {
  categoryId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  durationHours: number;
  price: number;
  currency: string;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescAr: string;
  seoDescEn: string;
  seoKeywordsAr?: string;
  seoKeywordsEn?: string;
  isActive?: boolean;
}

export type UpdateCoursePayload = CreateCoursePayload;

export interface CreateSchedulePayload {
  courseId: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxCapacity: number;
  isActive?: boolean;
}

export type UpdateSchedulePayload = CreateSchedulePayload;
