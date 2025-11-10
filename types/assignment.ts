import { User } from './auth';
import { Course } from './course';

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: Course | string;
  instructor: User;
  dueDate: string;
  maxPoints: number;
  assignmentType: 'homework' | 'quiz' | 'project' | 'exam';
  instructions: string;
  attachments: Attachment[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  _id: string;
  student: User;
  assignment: Assignment | string;
  course: Course | string;
  content: string;
  attachments: Attachment[];
  submittedAt: string;
  grade?: number;
  maxPoints: number;
  feedback: string;
  gradedAt?: string;
  gradedBy?: User;
  status: 'draft' | 'submitted' | 'graded' | 'returned';
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  filename: string;
  url: string;
  uploadedAt: string;
}

export interface CreateAssignmentData {
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  maxPoints: number;
  assignmentType: 'homework' | 'quiz' | 'project' | 'exam';
  instructions: string;
  attachments: Attachment[];
}

export interface SubmitAssignmentData {
  content: string;
  attachments: Attachment[];
}