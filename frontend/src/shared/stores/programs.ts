import { ref } from 'vue';
import { defineStore } from 'pinia';
import { programsService } from '@/shared/services/programsService';
import type {
  CategoryDetail,
  ProgramDetail,
  ProgramListItem,
} from '@/shared/types/catalog';

export const useProgramsStore = defineStore('programs', () => {
  const programs = ref<ProgramListItem[]>([]);
  const currentProgram = ref<ProgramDetail | null>(null);
  const currentCategory = ref<CategoryDetail | null>(null);

  const fetchPrograms = async () => {
    const response = await programsService.listPrograms();
    programs.value = response.data;
    return response;
  };

  const fetchProgram = async (slug: string) => {
    currentProgram.value = null;

    try {
      currentProgram.value = await programsService.getProgram(slug);
      return currentProgram.value;
    } catch (error) {
      currentProgram.value = null;
      throw error;
    }
  };

  const fetchCategory = async (programSlug: string, id: string) => {
    currentCategory.value = null;

    try {
      currentCategory.value = await programsService.getCategory(
        programSlug,
        id,
      );
      return currentCategory.value;
    } catch (error) {
      currentCategory.value = null;
      throw error;
    }
  };

  return {
    programs,
    currentProgram,
    currentCategory,
    fetchPrograms,
    fetchProgram,
    fetchCategory,
  };
});
