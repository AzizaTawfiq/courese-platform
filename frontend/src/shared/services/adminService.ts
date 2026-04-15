import api from './api';
import type {
  AdminCategory,
  AdminCourse,
  AdminProgram,
  AdminSchedule,
  CreateCategoryPayload,
  CreateCoursePayload,
  CreateProgramPayload,
  CreateSchedulePayload,
  UpdateCategoryPayload,
  UpdateCoursePayload,
  UpdateProgramPayload,
  UpdateSchedulePayload,
} from '@/shared/types/admin';

const getApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
  const normalizedBaseUrl = configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl
    : `${configuredBaseUrl}/`;

  if (/^https?:\/\//i.test(normalizedBaseUrl)) {
    return normalizedBaseUrl;
  }

  return new URL(
    normalizedBaseUrl.replace(/^\//, ''),
    globalThis.location.origin.endsWith('/')
      ? globalThis.location.origin
      : `${globalThis.location.origin}/`,
  ).toString();
};

const resolveApiUrl = (path: string) =>
  new URL(path, getApiBaseUrl()).toString();
const scheduleFileDownloadUrl = resolveApiUrl('schedule-file/download');

const getFilenameFromDisposition = (value: string | null) => {
  if (!value) {
    return null;
  }

  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const plainMatch = value.match(/filename="?([^"]+)"?/i);
  return plainMatch?.[1] ?? null;
};

const getFallbackFilename = (url: string) => {
  const pathname = new URL(url).pathname;
  const filename = pathname.split('/').pop();
  return filename && filename.length > 0 ? filename : 'training-schedule';
};

export const adminService = {
  async getScheduleFileDownloadUrl() {
    const response = await fetch(scheduleFileDownloadUrl, {
      credentials: 'include',
      method: 'HEAD',
    });

    if (response.status === 404) {
      return null;
    }

    if (response.ok) {
      return scheduleFileDownloadUrl;
    }

    throw new Error('Unable to resolve schedule file download URL.');
  },

  async downloadScheduleFile() {
    const response = await fetch(scheduleFileDownloadUrl, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Unable to download schedule file.');
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const filename =
      getFilenameFromDisposition(response.headers.get('content-disposition')) ??
      getFallbackFilename(response.url);

    return {
      objectUrl,
      filename,
    };
  },

  async listAdminPrograms() {
    const { data } = await api.get<{ data: AdminProgram[] }>(
      '/programs/admin/list',
    );
    return data;
  },

  async getAdminProgram(id: string) {
    const { data } = await api.get<
      AdminProgram & {
        categories: Array<{
          id: string;
          nameAr: string;
          nameEn: string;
          updatedAt: string;
        }>;
      }
    >(`/programs/admin/${id}`);
    return data;
  },

  async createProgram(payload: CreateProgramPayload) {
    const { data } = await api.post<AdminProgram>('/programs', payload);
    return data;
  },

  async updateProgram(id: string, payload: UpdateProgramPayload) {
    const { data } = await api.put<AdminProgram>(`/programs/${id}`, payload);
    return data;
  },

  async deleteProgram(id: string) {
    await api.delete(`/programs/${id}`);
  },

  async listAdminCategories() {
    const { data } = await api.get<{ data: AdminCategory[] }>(
      '/admin/categories',
    );
    return data;
  },

  async getAdminCategory(id: string) {
    const { data } = await api.get<AdminCategory>(`/admin/categories/${id}`);
    return data;
  },

  async createCategory(programSlug: string, payload: CreateCategoryPayload) {
    const { data } = await api.post<AdminCategory>(
      `/programs/${programSlug}/categories`,
      payload,
    );
    return data;
  },

  async updateCategory(
    programSlug: string,
    id: string,
    payload: UpdateCategoryPayload,
  ) {
    const { data } = await api.put<AdminCategory>(
      `/programs/${programSlug}/categories/${id}`,
      payload,
    );
    return data;
  },

  async deleteCategory(programSlug: string, id: string, confirm = false) {
    await api.delete(`/programs/${programSlug}/categories/${id}`, {
      params: { confirm: confirm ? 'true' : undefined },
    });
  },

  async listAdminCourses() {
    const { data } = await api.get<{ data: AdminCourse[] }>('/admin/courses');
    return data;
  },

  async getAdminCourse(id: string) {
    const { data } = await api.get<AdminCourse>(`/admin/courses/${id}`);
    return data;
  },

  async createCourse(payload: CreateCoursePayload) {
    const { data } = await api.post<AdminCourse>('/admin/courses', payload);
    return data;
  },

  async updateCourse(id: string, payload: UpdateCoursePayload) {
    const { data } = await api.put<AdminCourse>(
      `/admin/courses/${id}`,
      payload,
    );
    return data;
  },

  async deleteCourse(id: string, confirm = false) {
    await api.delete(`/admin/courses/${id}`, {
      params: { confirm: confirm ? 'true' : undefined },
    });
  },

  async listAdminSchedules(
    filters: { courseId?: string; from?: string; to?: string } = {},
  ) {
    const { data } = await api.get<{ data: AdminSchedule[] }>(
      '/admin/schedules',
      {
        params: filters,
      },
    );
    return data;
  },

  async createSchedule(payload: CreateSchedulePayload) {
    const { data } = await api.post<AdminSchedule>('/admin/schedules', payload);
    return data;
  },

  async updateSchedule(id: string, payload: UpdateSchedulePayload) {
    const { data } = await api.put<AdminSchedule>(
      `/admin/schedules/${id}`,
      payload,
    );
    return data;
  },

  async deleteSchedule(id: string, confirm = false) {
    await api.delete(`/admin/schedules/${id}`, {
      params: { confirm: confirm ? 'true' : undefined },
    });
  },
};
