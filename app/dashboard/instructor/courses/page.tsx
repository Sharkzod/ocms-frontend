'use client';
import { useEffect, useState } from 'react';
import { Course } from '@/types/course';
import { courseService } from '@/services/courseService';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function InstructorCoursesContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState<string | null>(null);

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
      setLoading(false);
    }
  };

  const handleTogglePublish = async (courseId: string) => {
    setPublishing(courseId);
    setError('');

    try {
      const result = await courseService.togglePublish(courseId);
      setCourses(prev => 
        prev.map(course => 
          course._id === courseId ? result.course : course
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update course status');
    } finally {
      setPublishing(null);
    }
  };

  const getStats = () => {
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    const draftCourses = totalCourses - publishedCourses;
    const totalStudents = courses.reduce((sum, course) => sum + (course as any).studentCount || 0, 0);

    return { totalCourses, publishedCourses, draftCourses, totalStudents };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Manage and create your courses</p>
        </div>
        <Link
          href="/dashboard/instructor/courses/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Create New Course
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalCourses}</p>
            </div>
            <span className="text-2xl">📚</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{stats.publishedCourses}</p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.draftCourses}</p>
            </div>
            <span className="text-2xl">📝</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{stats.totalStudents}</p>
            </div>
            <span className="text-2xl">👥</span>
          </div>
        </div>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-6">Create your first course to get started</p>
          <Link
            href="/dashboard/instructor/courses/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Courses</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {courses.map((course) => (
              <div key={course._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      {course.imageUrl ? (
                        <img 
                          src={course.imageUrl} 
                          alt={course.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📚</span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {course.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Category: {course.category}</span>
                          <span>•</span>
                          <span>Price: ${course.price}</span>
                          <span>•</span>
                          <span>
                            Created: {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-6">
                    <button
                      onClick={() => handleTogglePublish(course._id)}
                      disabled={publishing === course._id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        course.isPublished
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {publishing === course._id ? 'Updating...' : 
                       course.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    
                    <Link
                      href={`/dashboard/instructor/courses/${course._id}/edit`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/dashboard/instructor/courses/${course._id}/analytics`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                    >
                      Analytics
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InstructorCourses() {
  return (
    <RouteGuard requiredRole="instructor">
      <InstructorCoursesContent />
    </RouteGuard>
  );
}