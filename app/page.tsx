import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-2">
                OCMS
              </div>
              <span className="text-xl font-bold text-gray-900">CourseManager</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center text-black">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Online Course Management
          <span className="text-blue-600"> System</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Streamline your educational institution with our comprehensive platform. 
          Centralize course creation, enrollment, delivery, and assessment in one place.
        </p>
        <div className="space-x-4 mb-16">
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition inline-block"
          >
            Start Free Trial
          </Link>
          <Link 
            href="/login" 
            className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition inline-block"
          >
            Demo Login
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl mb-4 mx-auto">
              📚
            </div>
            <h3 className="text-xl font-semibold mb-2">Course Management</h3>
            <p className="text-gray-600">
              Create, organize, and manage courses with dynamic content and modules.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl mb-4 mx-auto">
              👥
            </div>
            <h3 className="text-xl font-semibold mb-2">Student Enrollment</h3>
            <p className="text-gray-600">
              Streamline student registration and course enrollment processes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl mb-4 mx-auto">
              📊
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Grading</h3>
            <p className="text-gray-600">
              Automated assignment grading with intelligent feedback system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}