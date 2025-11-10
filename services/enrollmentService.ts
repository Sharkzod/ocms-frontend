import { Enrollment } from '@/types/enrollment';
import { api } from '@/lib/axios';

export const enrollmentService = {
  // Enroll in a course
  enrollInCourse: async (courseId: string): Promise<{ message: string; enrollment: Enrollment }> => {
    const response = await api.post(`/enrollments/courses/${courseId}/enroll`);
    return response.data;
  },

  // Get student's enrolled courses
  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const response = await api.get('/enrollments/my-courses');
    return response.data;
  },

  // Get students enrolled in a course
  getCourseStudents: async (courseId: string): Promise<Enrollment[]> => {
    const response = await api.get(`/enrollments/courses/${courseId}/students`);
    return response.data;
  },

  // Unenroll from a course
  unenrollFromCourse: async (courseId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/enrollments/courses/${courseId}/unenroll`);
    return response.data;
  },

  // Update enrollment progress
  updateProgress: async (enrollmentId: string, progress: number): Promise<Enrollment> => {
    const response = await api.patch(`/enrollments/${enrollmentId}/progress`, { progress });
    return response.data;
  }
};