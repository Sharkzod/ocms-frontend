'use client';
import { useEffect, useState } from 'react';
import { Assignment } from '@/types/assignment';
import { Submission } from '@/types/assignment';
import { assignmentService } from '@/services/assignmentService';
import { enrollmentService } from '@/services/enrollmentService';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function StudentAssignmentsContent() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [enrollmentsData, submissionsData] = await Promise.all([
        enrollmentService.getMyEnrollments(),
        assignmentService.getMySubmissions()
      ]);

      const enrolledCourseIds = enrollmentsData.map(e => e.course._id);
      setEnrolledCourses(enrolledCourseIds);
      setSubmissions(submissionsData);

      // Load assignments for enrolled courses
      const allAssignments: Assignment[] = [];
      for (const courseId of enrolledCourseIds) {
        try {
          const courseAssignments = await assignmentService.getCourseAssignments(courseId);
          allAssignments.push(...courseAssignments);
        } catch (error) {
          console.error(`Failed to load assignments for course ${courseId}:`, error);
        }
      }
      
      setAssignments(allAssignments.filter(a => a.isPublished));
    } catch (err: any) {
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionStatus = (assignmentId: string) => {
    const submission = submissions.find(s => s.assignment === assignmentId);
    return submission || null;
  };

  const isAssignmentDue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'graded') return 'bg-green-100 text-green-800';
    if (status === 'submitted') return 'bg-blue-100 text-blue-800';
    if (isAssignmentDue(dueDate)) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (submission: Submission | null, dueDate: string) => {
    if (submission?.status === 'graded') return `Graded: ${submission.grade}/${submission.maxPoints}`;
    if (submission?.status === 'submitted') return 'Submitted';
    if (isAssignmentDue(dueDate)) return 'Overdue';
    return 'Not Submitted';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-600 mt-2">View and submit your course assignments</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments available</h3>
          <p className="text-gray-600 mb-6">
            {enrolledCourses.length === 0 
              ? "You need to enroll in courses to see assignments"
              : "No published assignments in your enrolled courses"
            }
          </p>
          {enrolledCourses.length === 0 && (
            <Link
              href="/courses"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Courses
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Current Assignments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {assignments.map((assignment) => {
              const submission = getSubmissionStatus(assignment._id);
              const isDue = isAssignmentDue(assignment.dueDate);
              
              return (
                <div key={assignment._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-2xl">
                          {assignment.assignmentType === 'homework' ? '📝' :
                           assignment.assignmentType === 'quiz' ? '📋' :
                           assignment.assignmentType === 'project' ? '💼' : '📊'}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {assignment.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              getStatusColor(submission?.status || '', assignment.dueDate)
                            }`}>
                              {getStatusText(submission, assignment.dueDate)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {assignment.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Course: {(assignment.course as any).title}</span>
                            <span>•</span>
                            <span className={isDue ? 'text-red-600 font-medium' : ''}>
                              Due: {new Date(assignment.dueDate).toLocaleString()}
                            </span>
                            <span>•</span>
                            <span>Points: {assignment.maxPoints}</span>
                          </div>

                          {submission?.feedback && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-700">Instructor Feedback:</p>
                              <p className="text-sm text-gray-600 mt-1">{submission.feedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-6">
                      {submission ? (
                        <Link
                          href={`/dashboard/student/assignments/${assignment._id}/view`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                          View Submission
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/student/assignments/${assignment._id}/submit`}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            isDue 
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                          onClick={(e) => {
                            if (isDue) {
                              e.preventDefault();
                              alert('This assignment is overdue and cannot be submitted.');
                            }
                          }}
                        >
                          {isDue ? 'Overdue' : 'Submit'}
                        </Link>
                      )}
                      
                      <Link
                        href={`/dashboard/student/assignments/${assignment._id}/details`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentAssignments() {
  return (
    <RouteGuard requiredRole="student">
      <StudentAssignmentsContent />
    </RouteGuard>
  );
}