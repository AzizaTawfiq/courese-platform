import api from './api';
import type {
  CategoryDetail,
  CategoryListItem,
  ListResponse,
  ProgramDetail,
  ProgramListItem,
} from '@/shared/types/catalog';

export const programsService = {
  async listPrograms() {
    const { data } = await api.get<ListResponse<ProgramListItem>>('/programs');
    return data;
  },

  async getProgram(slug: string) {
    const { data } = await api.get<ProgramDetail>(`/programs/${slug}`);
    return data;
  },

  async listCategories(programSlug: string) {
    const { data } = await api.get<ListResponse<CategoryListItem>>(
      `/programs/${programSlug}/categories`,
    );
    return data;
  },

  async getCategory(programSlug: string, id: string) {
    const { data } = await api.get<CategoryDetail>(
      `/programs/${programSlug}/categories/${id}`,
    );
    return data;
  },
};
