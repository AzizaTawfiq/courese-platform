import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  coursesService,
  type ListCoursesFilters,
} from '@/shared/services/coursesService';
import type { CourseDetail, CourseListItem } from '@/shared/types/catalog';

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<CourseListItem[]>([]);
  const currentCourse = ref<CourseDetail | null>(null);

  const fetchCourses = async (filters: ListCoursesFilters = {}) => {
    const response = await coursesService.listCourses(filters);
    courses.value = response.data;
    return response;
  };

  const fetchCourse = async (slug: string) => {
    currentCourse.value = null;

    try {
      currentCourse.value = await coursesService.getCourse(slug);
      return currentCourse.value;
    } catch (error) {
      currentCourse.value = null;
      throw error;
    }
  };

  return {
    courses,
    currentCourse,
    fetchCourses,
    fetchCourse,
  };
});
