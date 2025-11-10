'use client';
import { useEffect, useState } from 'react';
import { Enrollment } from '@/types/enrollment';
import { enrollmentService } from '@/services/enrollmentService';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function MyCoursesContent() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(data);
    } catch (err: any) {
      setError('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (!confirm('Are you sure you want to unenroll from this course?')) {
      return;
    }

    try {
      await enrollmentService.unenrollFromCourse(courseId);
      setEnrollments(prev => prev.filter(enrollment => enrollment.course._id !== courseId));
    } catch (err: any) {
      setError('Failed to unenroll from course');
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-600';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-yellow-600';
    if (progress >= 25) return 'bg-orange-600';
    return 'bg-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">Continue learning from your enrolled courses</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled</h3>
          <p className="text-gray-600 mb-6">Browse our course catalog to find interesting courses</p>
          <Link
            href="/courses"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {enrollment.course.imageUrl ? (
                <img 
                  src={enrollment.course.imageUrl} 
                  alt={enrollment.course.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {enrollment.course.title}
                  </h3>
                  {enrollment.completed && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  By {enrollment.course.instructor.name}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(enrollment.progress)} transition-all duration-300`}
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/courses/${enrollment.course._id}/learn`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition text-center text-sm"
                  >
                    {enrollment.completed ? 'Review' : 'Continue'}
                  </Link>
                  
                  <button
                    onClick={() => handleUnenroll(enrollment.course._id)}
                    className="flex items-center justify-center w-12 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="Unenroll from course"
                  >
                    🗑️
                  </button>
                </div>

                <div className="text-xs text-gray-500 mt-3">
                  Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyCourses() {
  return (
    <RouteGuard requiredRole="student">
      <MyCoursesContent />
    </RouteGuard>
  );
}