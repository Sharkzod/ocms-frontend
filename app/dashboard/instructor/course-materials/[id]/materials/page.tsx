'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LearningMaterial } from '@/types/learningMaterial';
import { Course } from '@/types/course';
import { learningMaterialService } from '@/services/learningMaterialService';
import { courseService } from '@/services/courseService';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function CourseMaterialsContent() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      const [courseData, materialsData] = await Promise.all([
        courseService.getCourse(courseId),
        learningMaterialService.getCourseMaterials(courseId)
      ]);
      
      setCourse(courseData);
      setMaterials(materialsData);
    } catch (err: any) {
      setError('Failed to load course materials');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (materialId: string) => {
    setPublishing(materialId);
    setError('');

    try {
      const result = await learningMaterialService.togglePublish(materialId);
      setMaterials(prev => 
        prev.map(material => 
          material._id === materialId ? result.material : material
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update material status');
    } finally {
      setPublishing(null);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this learning material?')) {
      return;
    }

    try {
      await learningMaterialService.deleteMaterial(materialId);
      setMaterials(prev => prev.filter(material => material._id !== materialId));
    } catch (err: any) {
      setError('Failed to delete learning material');
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'document': return '📄';
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'link': return '🔗';
      case 'quiz': return '📝';
      case 'assignment': return '📋';
      default: return '📎';
    }
  };

  const getMaterialTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'link': return 'bg-orange-100 text-orange-800';
      case 'quiz': return 'bg-red-100 text-red-800';
      case 'assignment': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number = 0) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading course materials...</div>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-2">Manage Learning Materials</p>
          </div>
          <Link
            href={`/dashboard/instructor/course-materials/${courseId}/materials/create`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add Material
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Materials List */}
      {materials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No learning materials yet</h3>
          <p className="text-gray-600 mb-6">Add your first learning material to get started</p>
          <Link
            href={`/dashboard/instructor/course-materials/${courseId}/materials/create`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add Your First Material
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Learning Materials ({materials.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {materials.map((material) => (
              <div key={material._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-2xl mt-1">
                      {getMaterialIcon(material.materialType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {material.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getMaterialTypeColor(material.materialType)
                        }`}>
                          {material.materialType}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          material.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {material.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {material.accessType === 'premium' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            Premium
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {material.description || 'No description provided'}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {material.fileUrl && (
                          <>
                            <span>File: {material.fileName}</span>
                            <span>•</span>
                            <span>Size: {formatFileSize(material.fileSize)}</span>
                            <span>•</span>
                          </>
                        )}
                        {material.duration && material.duration > 0 && (
                          <>
                            <span>Duration: {material.duration} min</span>
                            <span>•</span>
                          </>
                        )}
                        <span>
                          Created: {new Date(material.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {material.tags && material.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {material.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
                    <button
                      onClick={() => handleTogglePublish(material._id)}
                      disabled={publishing === material._id}
                      className={`px-3 py-1 rounded text-sm font-medium transition ${
                        material.isPublished
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {publishing === material._id ? '...' : 
                       material.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    
                    <Link
                      href={`/dashboard/instructor/courses/${courseId}/materials/${material._id}/edit`}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDeleteMaterial(material._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
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

export default function CourseMaterials() {
  return (
    <RouteGuard requiredRole="instructor">
      <CourseMaterialsContent />
    </RouteGuard>
  );
}