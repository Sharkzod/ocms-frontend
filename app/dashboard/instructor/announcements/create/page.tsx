'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { communicationService } from '@/services/communicationService';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function CreateAnnouncementContent() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    courseId: '',
    content: '',
    attachments: []
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await courseService.getMyCourses();
      setCourses(data);
    } catch (err: any) {
      setError('Failed to load courses');
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await communicationService.sendAnnouncement(formData);
      router.push('/dashboard/instructor/courses');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/dashboard/instructor/courses" 
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Courses
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Course Announcement</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
              Select Course *
            </label>
            <select
              id="courseId"
              name="courseId"
              required
              value={formData.courseId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a course</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            {coursesLoading && <p className="text-sm text-gray-500 mt-1">Loading courses...</p>}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Message *
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              value={formData.content}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your announcement message here. This will be sent to all enrolled students in the selected course."
            />
            <p className="text-sm text-gray-500 mt-1">
              This announcement will be sent to all students enrolled in the selected course.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/dashboard/instructor/courses"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Announcement...' : 'Send Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateAnnouncement() {
  return (
    <RouteGuard requiredRole="instructor">
      <CreateAnnouncementContent />
    </RouteGuard>
  );
}