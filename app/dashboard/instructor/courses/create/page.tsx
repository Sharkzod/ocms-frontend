'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { courseService } from '@/services/courseService';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function CreateCourseContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    level: '',
    department: '',
    imageUrl: '',
    description: '', // Added missing field
    category: '', // Added missing field
    price: 0, // Added missing field
    learningObjectives: [''],
    requirements: [''],
    targetAudience: ['']
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value // Convert price to number
    }));
  };

  const handleArrayChange = (field: 'learningObjectives' | 'requirements' | 'targetAudience', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'learningObjectives' | 'requirements' | 'targetAudience') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'learningObjectives' | 'requirements' | 'targetAudience', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Filter out empty array items
      const submitData = {
        ...formData,
        learningObjectives: formData.learningObjectives.filter(obj => obj.trim() !== ''),
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        targetAudience: formData.targetAudience.filter(aud => aud.trim() !== '')
      };

      await courseService.createCourse(submitData);
      router.push('/dashboard/instructor/courses');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create course');
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Course</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-black placeholder-gray-500">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Introduction to Web Development"
              />
            </div>

            <div>
              <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-2">
                Course Code *
              </label>
              <input
                type="text"
                id="courseCode"
                name="courseCode"
                required
                value={formData.courseCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., CS101, MATH201"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Course Level *
              </label>
              <select
                id="level"
                name="level"
                required
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select course level</option>
                <option value="beginner">100L</option>
                <option value="intermediate">200L</option>
                <option value="advanced">300L</option>
                <option value="all-levels">400L</option>
                <option value="all-levels">500L</option>
                <option value="all-levels">600L</option>
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select department</option>
                <option value="computer-science">Computer Science</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="engineering">Engineering</option>
                <option value="business">Business</option>
                <option value="arts">Arts</option>
                <option value="humanities">Humanities</option>
                <option value="social-sciences">Social Sciences</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>


      

          <div className="flex justify-end space-x-4 pt-6">
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
              {loading ? 'Creating Course...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateCourse() {
  return (
    <RouteGuard requiredRole="instructor">
      <CreateCourseContent />
    </RouteGuard>
  );
}