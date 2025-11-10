import { User } from './auth';
import { Course } from './course';

export interface LearningMaterial {
  _id: string;
  title: string;
  description: string;
  course: Course | string;
  instructor: User;
  materialType: 'document' | 'video' | 'audio' | 'link' | 'quiz' | 'assignment' | 'other';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  externalUrl?: string;
  content?: string;
  duration?: number;
  isPublished: boolean;
  order: number;
  tags: string[];
  accessType: 'free' | 'premium';
  createdAt: string;
  updatedAt: string;
}

export interface CreateLearningMaterialData {
  title: string;
  description: string;
  courseId: string;
  materialType: 'document' | 'video' | 'audio' | 'link' | 'quiz' | 'assignment' | 'other';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  externalUrl?: string;
  content?: string;
  duration?: number;
  order?: number;
  tags?: string[];
  accessType?: 'free' | 'premium';
}