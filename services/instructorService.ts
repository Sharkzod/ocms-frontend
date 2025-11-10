import { api } from '@/lib/axios';
import { Submission } from '@/types/assignment';

export interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  assignmentsToGrade: number;
  averageRating: string;
}

export const instructorService = {
  // Get instructor dashboard stats
  getDashboardStats: async (): Promise<InstructorStats> => {
    const response = await api.get('/instructor/dashboard/stats');
    return response.data;
  },

  // Get recent submissions
  getRecentSubmissions: async (): Promise<Submission[]> => {
    const response = await api.get('/instructor/dashboard/recent-submissions');
    return response.data;
  }
};