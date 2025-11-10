import { Message, Notification, SendMessageData } from '@/types/communication';
import { api } from '@/lib/axios';

export const communicationService = {
  // Send direct message
  sendDirectMessage: async (messageData: SendMessageData): Promise<Message> => {
    const response = await api.post('/messages/direct', messageData);
    return response.data;
  },

  // Send course announcement
  sendAnnouncement: async (messageData: SendMessageData): Promise<Message> => {
    const response = await api.post('/messages/announcement', messageData);
    return response.data;
  },

  // Get user's messages
  getMyMessages: async (): Promise<Message[]> => {
    const response = await api.get('/messages/my-messages');
    return response.data;
  },

  // Get course announcements
  getCourseAnnouncements: async (courseId: string): Promise<Message[]> => {
    const response = await api.get(`/messages/course/${courseId}/announcements`);
    return response.data;
  },

  // Mark message as read
  markMessageAsRead: async (messageId: string): Promise<Message> => {
    const response = await api.patch(`/messages/${messageId}/read`);
    return response.data;
  },

  // Get user's notifications
  getMyNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications/my-notifications');
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (): Promise<{ message: string }> => {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  // Get unread notification count
  getUnreadNotificationCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  }
};