export interface ProgramListItem {
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
}

export interface CategoryListItem {
  id: string;
  programId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  updatedAt: string;
  courseCount: number;
}

export interface CourseListItem {
  id: string;
  slug: string;
  categoryId: string;
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
  updatedAt: string;
  upcomingScheduleCount: number;
}

export interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  location: string | null;
  maxCapacity: number;
  confirmedBookings: number;
  availableSeats: number;
}

export interface ProgramDetail extends ProgramListItem {
  categories: CategoryListItem[];
}

export interface CategoryDetail extends CategoryListItem {
  program: {
    slug: string;
    nameAr: string;
    nameEn: string;
  };
  courses: CourseListItem[];
}

export interface CourseDetail {
  id: string;
  slug: string;
  categoryId: string;
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
  updatedAt: string;
  category: {
    id: string;
    nameAr: string;
    nameEn: string;
    program: {
      slug: string;
      nameAr: string;
      nameEn: string;
    };
  };
  schedules: Schedule[];
}

export interface ListResponse<T> {
  data: T[];
  total: number;
}

export interface PaginatedResponse<T> extends ListResponse<T> {
  page: number;
  limit: number;
}
