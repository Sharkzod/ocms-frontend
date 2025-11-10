import { User } from './auth';
import { Course } from './course';

export interface Message {
  _id: string;
  sender: User;
  receiver?: User;
  course?: Course;
  content: string;
  messageType: 'direct' | 'course_announcement' | 'group' | 'system';
  isRead: boolean;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'assignment_due' | 'assignment_graded' | 'announcement' | 'message' | 'system' | 'enrollment';
  relatedEntity?: {
    entityType: 'course' | 'assignment' | 'submission' | 'message' | 'user';
    entityId: string;
  };
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  filename: string;
  url: string;
  uploadedAt: string;
}

export interface SendMessageData {
  receiverId?: string;
  courseId?: string;
  content: string;
  attachments: Attachment[];
}