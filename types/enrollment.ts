import { Course } from './course';
import { User } from './auth';

export interface Enrollment {
  _id: string;
  student: User;
  course: Course;
  enrolledAt: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}