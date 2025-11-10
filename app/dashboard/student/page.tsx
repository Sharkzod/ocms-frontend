'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { enrollmentService } from '@/services/enrollmentService';
import { assignmentService } from '@/services/assignmentService';
import { Enrollment } from '@/types/enrollment';
import { Submission } from '@/types/assignment';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function StudentDashboardContent() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    assignmentsDue: 0,
    completedCourses: 0,
    averageGrade: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [enrollmentData, submissionData] = await Promise.all([
        enrollmentService.getMyEnrollments(),
        assignmentService.getMySubmissions()
      ]);

      setEnrollments(enrollmentData);
      setSubmissions(submissionData);

      // Calculate real stats
      const enrolledCourses = enrollmentData.length;
      const completedCourses = enrollmentData.filter(e => e.completed).length;
      
      // Calculate assignments due (simplified - would need assignment due dates)
      const assignmentsDue = submissionData.filter(s => 
        s.status === 'submitted' && !s.grade
      ).length;

      // Calculate average grade
      const gradedSubmissions = submissionData.filter(s => s.grade);
      const averageGrade = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length
        : 0;

      setStats({
        enrolledCourses,
        assignmentsDue,
        completedCourses,
        averageGrade: Math.round(averageGrade)
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { 
      label: 'Enrolled Courses', 
      value: stats.enrolledCourses.toString(), 
      color: 'text-blue-600', 
      icon: '📚' 
    },
    { 
      label: 'Assignments Due', 
      value: stats.assignmentsDue.toString(), 
      color: 'text-orange-600', 
      icon: '📝' 
    },
    { 
      label: 'Completed Courses', 
      value: stats.completedCourses.toString(), 
      color: 'text-green-600', 
      icon: '✅' 
    },
    { 
      label: 'Average Grade', 
      value: stats.averageGrade > 0 ? `${stats.averageGrade}%` : '-', 
      color: 'text-purple-600', 
      icon: '📊' 
    },
  ];

  const recentActivities = submissions
    .slice(0, 3)
    .map(submission => ({
      type: 'assignment',
      course: (submission.course as any).title,
      assignment: (submission.assignment as any).title,
      date: new Date(submission.submittedAt).toLocaleDateString(),
      status: submission.status,
      grade: submission.grade
    }));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your courses today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/dashboard/student/assignments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent activity
              </div>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'enrollment' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'enrollment' ? '📚' : '📝'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {activity.type === 'enrollment' ? `Enrolled in ${activity.course}` :
                       `Submitted ${activity.assignment}`}
                    </p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                    {activity.grade && (
                      <p className="text-sm text-green-600 font-medium">
                        Grade: {activity.grade}%
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'graded' ? 'bg-green-100 text-green-800' :
                    activity.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <Link 
              href="/courses" 
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition group"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                🔍
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-700">Browse Courses</p>
                <p className="text-sm text-gray-600">Discover new courses to enroll in</p>
              </div>
            </Link>

                      <Link 
            href="/dashboard/student/assignments" 
            className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition group"
          >
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white">
              📝
            </div>
            <div>
              <p className="font-medium text-gray-900 group-hover:text-orange-700">Assignments</p>
              <p className="text-sm text-gray-600">View pending assignments and submissions</p>
            </div>
          </Link>

            <Link 
              href="/dashboard/student/my-courses" 
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition group"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                📖
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-green-700">My Courses</p>
                <p className="text-sm text-gray-600">Continue learning from your enrolled courses</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/student/assignments" 
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition group"
            >
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                📝
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-orange-700">Assignments</p>
                <p className="text-sm text-gray-600">View pending assignments and submissions</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Progress</h2>
        <div className="space-y-4">
          {enrollments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't enrolled in any courses yet.</p>
              <Link href="/courses" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                Browse available courses
              </Link>
            </div>
          ) : (
            enrollments.slice(0, 3).map(enrollment => (
              <div key={enrollment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {(enrollment.course as any).imageUrl ? (
                    <img 
                      src={(enrollment.course as any).imageUrl} 
                      alt={(enrollment.course as any).title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📚</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{(enrollment.course as any).title}</p>
                    <p className="text-sm text-gray-600">
                      By {(enrollment.course as any).instructor.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {enrollment.progress}% Complete
                    </p>
                    <p className="text-xs text-gray-500">
                      {enrollment.completed ? 'Course Completed' : 'In Progress'}
                    </p>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
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
        {enrollments.length > 3 && (
          <div className="text-center mt-4">
            <Link href="/dashboard/student/my-courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <RouteGuard requiredRole="student">
      <StudentDashboardContent />
    </RouteGuard>
  );
}