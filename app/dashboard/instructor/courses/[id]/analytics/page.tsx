'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { courseService } from '@/services/courseService';
import { enrollmentService } from '@/services/enrollmentService';
import { Course } from '@/types/course';
import { Enrollment } from '@/types/enrollment';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function CourseAnalyticsContent() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const [courseData, enrollmentData] = await Promise.all([
        courseService.getCourse(courseId),
        enrollmentService.getCourseStudents(courseId)
      ]);
      
      setCourse(courseData);
      setEnrollments(enrollmentData);
    } catch (err: any) {
      setError('Failed to load course analytics');
    } finally {
      setLoading(false);
    }
  };

  const getAnalytics = () => {
    const totalStudents = enrollments.length;
    const completedStudents = enrollments.filter(e => e.completed).length;
    const averageProgress = enrollments.length > 0 
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length 
      : 0;
    
    const progressDistribution = {
      '0-25%': enrollments.filter(e => e.progress <= 25).length,
      '26-50%': enrollments.filter(e => e.progress > 25 && e.progress <= 50).length,
      '51-75%': enrollments.filter(e => e.progress > 50 && e.progress <= 75).length,
      '76-99%': enrollments.filter(e => e.progress > 75 && e.progress < 100).length,
      '100%': completedStudents
    };

    return {
      totalStudents,
      completedStudents,
      averageProgress,
      progressDistribution,
      completionRate: totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0
    };
  };

  const analytics = getAnalytics();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
        <Link href="/dashboard/instructor/courses" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/dashboard/instructor/courses" 
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Courses
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-2">Course Analytics & Performance</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            course.isPublished 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{analytics.totalStudents}</p>
            </div>
            <span className="text-2xl">👥</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {analytics.completionRate.toFixed(1)}%
              </p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {analytics.averageProgress.toFixed(1)}%
              </p>
            </div>
            <span className="text-2xl">📊</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">{analytics.completedStudents}</p>
            </div>
            <span className="text-2xl">🎓</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Distribution */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress Distribution</h2>
          <div className="space-y-4">
            {Object.entries(analytics.progressDistribution).map(([range, count]) => (
              <div key={range} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{range}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${analytics.totalStudents > 0 ? (count / analytics.totalStudents) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Progress List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Progress</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {enrollments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No students enrolled yet</p>
            ) : (
              enrollments.map((enrollment) => (
                <div key={enrollment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                      {enrollment.student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {enrollment.student.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {enrollment.student.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {enrollment.progress}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {enrollment.completed ? 'Completed' : 'In Progress'}
                      </p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          enrollment.completed ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Enrollment Timeline */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Enrollment Timeline</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Enrollment timeline chart would be displayed here</p>
          <p className="text-sm mt-2">(This would show student enrollments over time)</p>
        </div>
      </div>
    </div>
  );
}

export default function CourseAnalytics() {
  return (
    <RouteGuard requiredRole="instructor">
      <CourseAnalyticsContent />
    </RouteGuard>
  );
}