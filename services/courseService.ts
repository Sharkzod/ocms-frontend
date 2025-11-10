import { Course, CreateCourseData } from '@/types/course';
import { api } from '@/lib/axios';

export const courseService = {
  // Get all published courses
  getCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get single course
  getCourse: async (id: string): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Create new course
  createCourse: async (courseData: CreateCourseData): Promise<Course> => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (id: string, courseData: Partial<CreateCourseData>): Promise<Course> => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  // Get instructor's courses
  getMyCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses/instructor/my-courses');
    return response.data;
  },

  // Publish/unpublish course
  togglePublish: async (id: string): Promise<{ message: string; course: Course }> => {
    const response = await api.patch(`/courses/${id}/publish`);
    return response.data;
  }
};