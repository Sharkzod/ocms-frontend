'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { assignmentService } from '@/services/assignmentService';
import { Assignment, SubmitAssignmentData } from '@/types/assignment';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function SubmitAssignmentContent() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<SubmitAssignmentData>({
    content: '',
    attachments: []
  });

  useEffect(() => {
    loadAssignment();
  }, [assignmentId]);

  const loadAssignment = async () => {
    try {
      const data = await assignmentService.getAssignment(assignmentId);
      setAssignment(data);
    } catch (err: any) {
      setError('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await assignmentService.submitAssignment(assignmentId, formData);
      router.push('/dashboard/student/assignments');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading assignment...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Assignment not found</h2>
        <Link href="/dashboard/student/assignments" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Back to Assignments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/dashboard/student/assignments" 
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Assignments
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{assignment.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div>
            <span className="font-medium text-gray-700">Course:</span>
            <p className="text-gray-600">{(assignment.course as any).title}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Due Date:</span>
            <p className="text-gray-600">{new Date(assignment.dueDate).toLocaleString()}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Points:</span>
            <p className="text-gray-600">{assignment.maxPoints}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Description:</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{assignment.description}</p>
        </div>

        {assignment.instructions && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Instructions:</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{assignment.instructions}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Submit Your Work</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Your Submission *
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              value={formData.content}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your assignment submission here. You can include code, explanations, or any required content..."
            />
            <p className="text-sm text-gray-500 mt-1">
              You can also paste code, include links, or describe your solution in detail.
            </p>
          </div>

          {/* File upload section can be added later */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-2">File upload feature coming soon</p>
            <p className="text-sm text-gray-400">
              For now, please include all necessary information in the text area above.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/dashboard/student/assignments"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SubmitAssignment() {
  return (
    <RouteGuard requiredRole="student">
      <SubmitAssignmentContent />
    </RouteGuard>
  );
}