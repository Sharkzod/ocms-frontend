import { Assignment, Submission, CreateAssignmentData, SubmitAssignmentData } from '@/types/assignment';
import { api } from '@/lib/axios';

export const assignmentService = {
  // Create assignment
  createAssignment: async (assignmentData: CreateAssignmentData): Promise<Assignment> => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },

  // Get assignments for a course
  getCourseAssignments: async (courseId: string): Promise<Assignment[]> => {
    const response = await api.get(`/assignments/course/${courseId}`);
    return response.data;
  },

  // Get single assignment
  getAssignment: async (assignmentId: string): Promise<Assignment> => {
    const response = await api.get(`/assignments/${assignmentId}`);
    return response.data;
  },

  // Update assignment
  updateAssignment: async (assignmentId: string, assignmentData: Partial<CreateAssignmentData>): Promise<Assignment> => {
    const response = await api.put(`/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  // Publish/unpublish assignment
  togglePublish: async (assignmentId: string): Promise<{ message: string; assignment: Assignment }> => {
    const response = await api.patch(`/assignments/${assignmentId}/publish`);
    return response.data;
  },

  // Submit assignment
  submitAssignment: async (assignmentId: string, submissionData: SubmitAssignmentData): Promise<{ message: string; submission: Submission }> => {
    const response = await api.post(`/assignments/${assignmentId}/submit`, submissionData);
    return response.data;
  },

  // Get submissions for an assignment
  getAssignmentSubmissions: async (assignmentId: string): Promise<Submission[]> => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  // Grade submission
  gradeSubmission: async (submissionId: string, grade: number, feedback: string): Promise<{ message: string; submission: Submission }> => {
    const response = await api.patch(`/assignments/submissions/${submissionId}/grade`, { grade, feedback });
    return response.data;
  },

  // Get student's submissions
  getMySubmissions: async (): Promise<Submission[]> => {
    const response = await api.get('/assignments/student/my-submissions');
    return response.data;
  }
};