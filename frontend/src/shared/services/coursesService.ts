import api from './api';
import type {
  CourseDetail,
  CourseListItem,
  PaginatedResponse,
} from '@/shared/types/catalog';

export interface ListCoursesFilters {
  categoryId?: string;
  programSlug?: string;
  page?: number;
  limit?: number;
}

export const coursesService = {
  async listCourses(filters: ListCoursesFilters = {}) {
    const { data } = await api.get<PaginatedResponse<CourseListItem>>(
      '/courses',
      {
        params: filters,
      },
    );
    return data;
  },

  async getCourse(slug: string) {
    const { data } = await api.get<CourseDetail>(`/courses/${slug}`);
    return data;
  },
};
