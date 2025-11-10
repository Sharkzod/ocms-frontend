'use client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import NotificationBell from './NotificationBell'; // Add this import

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'instructor': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              OCMS
            </Link>
            {user && (
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                {user.role === 'student' && (
                  <Link href="/courses" className="text-gray-700 hover:text-blue-600 transition">
                    Browse Courses
                  </Link>
                )}
                {(user.role === 'instructor' || user.role === 'admin') && (
                  <Link href="/dashboard/instructor/courses" className="text-gray-700 hover:text-blue-600 transition">
                    My Courses
                  </Link>
                )}
                
                {(user.role === 'instructor' || user.role === 'admin') && (
                <>
                    <Link href="/dashboard/instructor/courses" className="text-gray-700 hover:text-blue-600 transition">
                    My Courses
                    </Link>
                    <Link href="/dashboard/instructor/assignments" className="text-gray-700 hover:text-blue-600 transition">
                    My Assignments
                    </Link>
                    <Link href="/dashboard/instructor/announcements/create" className="text-gray-700 hover:text-blue-600 transition">
                    Announcements
                    </Link>
                </>
                )}
              </div>
            )}
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Add Notification Bell */}
                <NotificationBell />
                
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}