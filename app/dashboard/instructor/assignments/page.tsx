'use client';
import { useEffect, useState } from 'react';
import { Assignment } from '@/types/assignment';
import { assignmentService } from '@/services/assignmentService';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function InstructorAssignmentsContent() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getMyCourses(),
        loadAllAssignments()
      ]);
      setCourses(coursesData);
    } catch (err: any) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadAllAssignments = async () => {
    const allAssignments: Assignment[] = [];
    try {
      const courses = await courseService.getMyCourses();
      for (const course of courses) {
        const courseAssignments = await assignmentService.getCourseAssignments(course._id);
        allAssignments.push(...courseAssignments);
      }
      setAssignments(allAssignments);
      return allAssignments;
    } catch (error) {
      console.error('Failed to load assignments:', error);
      return [];
    }
  };

  const handleTogglePublish = async (assignmentId: string) => {
    setPublishing(assignmentId);
    setError('');

    try {
      const result = await assignmentService.togglePublish(assignmentId);
      setAssignments(prev => 
        prev.map(assignment => 
          assignment._id === assignmentId ? result.assignment : assignment
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update assignment status');
    } finally {
      setPublishing(null);
    }
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c._id === courseId);
    return course?.title || 'Unknown Course';
  };

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case 'homework': return '📝';
      case 'quiz': return '📋';
      case 'project': return '💼';
      case 'exam': return '📊';
      default: return '📄';
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600 mt-2">Manage assignments for your courses</p>
        </div>
        <Link
          href="/dashboard/instructor/assignments/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Create Assignment
        </Link>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-600 mb-6">Create your first assignment to get started</p>
          <Link
            href="/dashboard/instructor/assignments/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Your First Assignment
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Assignments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-2xl">
                        {getAssignmentTypeIcon(assignment.assignmentType)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {assignment.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            assignment.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assignment.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {assignment.assignmentType}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {assignment.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Course: {getCourseName(assignment.course as string)}</span>
                          <span>•</span>
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Points: {assignment.maxPoints}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-6">
                    <button
                      onClick={() => handleTogglePublish(assignment._id)}
                      disabled={publishing === assignment._id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        assignment.isPublished
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {publishing === assignment._id ? 'Updating...' : 
                       assignment.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    
                    <Link
                      href={`/dashboard/instructor/assignments/${assignment._id}/submissions`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                    >
                      View Submissions
                    </Link>

                    <Link
                      href={`/dashboard/instructor/assignments/${assignment._id}/edit`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Edit
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

export default function InstructorAssignments() {
  return (
    <RouteGuard requiredRole="instructor">
      <InstructorAssignmentsContent />
    </RouteGuard>
  );
}