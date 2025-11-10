'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { instructorService, InstructorStats } from '@/services/instructorService';
import { Submission } from '@/types/assignment';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function InstructorDashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, submissionsData] = await Promise.all([
        instructorService.getDashboardStats(),
        instructorService.getRecentSubmissions()
      ]);

      setStats(statsData);
      setRecentSubmissions(submissionsData);
    } catch (err: any) {
      setError('Failed to load dashboard data');
      console.error('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { label: 'My Courses', value: stats?.totalCourses.toString() || '0', color: 'text-blue-600', icon: '📚' },
    { label: 'Total Students', value: stats?.totalStudents.toString() || '0', color: 'text-green-600', icon: '👥' },
    { label: 'Assignments to Grade', value: stats?.assignmentsToGrade.toString() || '0', color: 'text-orange-600', icon: '📝' },
    { label: 'Course Rating', value: stats?.averageRating ? `${stats.averageRating}/5` : '-/5', color: 'text-yellow-600', icon: '⭐' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Instructor Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your courses and track student progress.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <Link 
                href="/dashboard/instructor/courses/create" 
                className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition group"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  ➕
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-700">Create Course</p>
                  <p className="text-sm text-gray-600">Start building a new course</p>
                </div>
              </Link>

              <Link 
                href="/dashboard/instructor/assignments/create" 
                className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition group"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  📝
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-green-700">Create Assignment</p>
                  <p className="text-sm text-gray-600">Add new assignment to course</p>
                </div>
              </Link>

              <Link 
                href="/dashboard/instructor/announcements/create" 
                className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition group"
              >
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                  📢
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-purple-700">Send Announcement</p>
                  <p className="text-sm text-gray-600">Notify enrolled students</p>
                </div>
              </Link>

              <Link 
                href="/dashboard/instructor/assignments" 
                className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition group"
              >
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                  ✏️
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-orange-700">Grade Assignments</p>
                  <p className="text-sm text-gray-600">Review student submissions</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Submissions & Calendar */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Submissions */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
              <Link href="/dashboard/instructor/assignments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentSubmissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent submissions</p>
                  <p className="text-sm mt-1">Student submissions will appear here</p>
                </div>
              ) : (
                recentSubmissions.map((submission, index) => (
                  <div key={submission._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        {(submission.student as any).name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{(submission.student as any).name}</p>
                        <p className="text-sm text-gray-600">
                          {(submission.course as any).title} • {(submission.assignment as any).title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/instructor/assignments/${(submission.assignment as any)._id}/submissions`}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Grade
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Deadlines</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Sample Assignment</p>
                  <p className="text-sm text-gray-600">Due in 2 days</p>
                </div>
                <span className="text-orange-600 text-sm font-medium">Urgent</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Final Project Review</p>
                  <p className="text-sm text-gray-600">Due in 5 days</p>
                </div>
                <span className="text-blue-600 text-sm font-medium">Upcoming</span>
              </div>

              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">
                  Real deadline data will appear once you create assignments
                </p>
                <Link 
                  href="/dashboard/instructor/assignments/create" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                >
                  Create your first assignment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstructorDashboard() {
  return (
    <RouteGuard requiredRole="instructor">
      <InstructorDashboardContent />
    </RouteGuard>
  );
}