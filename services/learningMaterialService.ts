import { LearningMaterial, CreateLearningMaterialData } from '@/types/learningMaterial';
import { api } from '@/lib/axios';

export const learningMaterialService = {
  // Get learning materials for a course
  getCourseMaterials: async (courseId: string): Promise<LearningMaterial[]> => {
    try {
      const response = await api.get(`/learning-materials/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to load learning materials:', error);
      return [];
    }
  },

  // Get single learning material
  getMaterial: async (materialId: string): Promise<LearningMaterial> => {
    const response = await api.get(`/learning-materials/${materialId}`);
    return response.data;
  },

  // Create learning material
  createMaterial: async (materialData: CreateLearningMaterialData): Promise<LearningMaterial> => {
    const response = await api.post('/learning-materials', materialData);
    return response.data;
  },

  // Update learning material
  updateMaterial: async (materialId: string, materialData: Partial<CreateLearningMaterialData>): Promise<LearningMaterial> => {
    const response = await api.put(`/learning-materials/${materialId}`, materialData);
    return response.data;
  },

  // Publish/unpublish learning material
  togglePublish: async (materialId: string): Promise<{ message: string; material: LearningMaterial }> => {
    const response = await api.patch(`/learning-materials/${materialId}/publish`);
    return response.data;
  },

  // Delete learning material
  deleteMaterial: async (materialId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/learning-materials/${materialId}`);
    return response.data;
  },

  // Reorder materials
  reorderMaterials: async (courseId: string, materials: { id: string; order: number }[]): Promise<{ message: string }> => {
    const response = await api.patch(`/learning-materials/course/${courseId}/reorder`, { materials });
    return response.data;
  }
};