'use client';
import { useEffect, useState } from 'react';
import { Course } from '@/types/course';
import { courseService } from '@/services/courseService';
import { enrollmentService } from '@/services/enrollmentService';
import { useAuth } from '@/contexts/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function CoursesContent() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourses();
    if (user?.role === 'student') {
      loadEnrollments();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (err: any) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      const enrollments = await enrollmentService.getMyEnrollments();
      const enrolledIds = enrollments.map(enrollment => enrollment.course._id);
      setEnrolledCourses(enrolledIds);
    } catch (err: any) {
      console.error('Failed to load enrollments');
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (user?.role !== 'student') {
      setError('Only students can enroll in courses');
      return;
    }

    setEnrolling(courseId);
    setError('');

    try {
      await enrollmentService.enrollInCourse(courseId);
      setEnrolledCourses(prev => [...prev, courseId]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(null);
    }
  };

  const getCategoryColor = (category: string = 'other') => {
    const colors: { [key: string]: string } = {
      'web-development': 'bg-blue-100 text-blue-800',
      'data-science': 'bg-green-100 text-green-800',
      'mobile-development': 'bg-purple-100 text-purple-800',
      'programming': 'bg-orange-100 text-orange-800',
      'business': 'bg-red-100 text-red-800',
      'design': 'bg-pink-100 text-pink-800',
      'marketing': 'bg-yellow-100 text-yellow-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['other'];
  };

  const formatCategory = (category: string = 'other') => {
    return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getInstructorName = (course: Course) => {
    if (typeof course.instructor === 'string') {
      return 'Unknown Instructor';
    }
    return course.instructor?.name || 'Unknown Instructor';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-lg">Loading courses...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover a wide range of courses taught by expert instructors. 
            Enhance your skills and advance your career.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 max-w-4xl mx-auto">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600">Check back later for new courses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {courses.map((course) => {
              const isEnrolled = enrolledCourses.includes(course._id);
              const isEnrolling = enrolling === course._id;

              return (
                <div key={course._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                  {course.imageUrl ? (
                    <img 
                      src={course.imageUrl} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                      <span className="text-6xl">📚</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                        {formatCategory(course.category)}
                      </span>
                      {/* <span className="text-lg font-bold text-gray-900">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span> */}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>By {getInstructorName(course)}</span>
                      <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Learning Objectives Preview */}
                    {course.learningObjectives && course.learningObjectives.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">You'll learn:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {course.learningObjectives.slice(0, 2).map((objective, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              <span className="line-clamp-2">{objective}</span>
                            </li>
                          ))}
                          {course.learningObjectives.length > 2 && (
                            <li className="text-gray-500">
                              +{course.learningObjectives.length - 2} more objectives
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      {user?.role === 'student' ? (
                        isEnrolled ? (
                          <Link
                            href="/dashboard/student/my-courses"
                            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition text-center"
                          >
                            Go to Course
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course._id)}
                            disabled={isEnrolling}
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                          </button>
                        )
                      ) : user?.role === 'instructor' || user?.role === 'admin' ? (
                        <Link
                          href={`/courses/${course._id}`}
                          className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition text-center"
                        >
                          View Details
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                        >
                          Login to Enroll
                        </Link>
                      )}
                      
                      <Link
                        href={`/courses/${course._id}`}
                        className="flex items-center justify-center w-12 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        title="View course details"
                      >
                        👁️
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Courses() {
  return <CoursesContent />;
}