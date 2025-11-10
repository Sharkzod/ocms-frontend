'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'instructor': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMobileMenuLinks = () => {
    if (!user) return null;

    const baseLinks = [
      { href: "/dashboard", label: "Dashboard" }
    ];

    if (user.role === 'student') {
      baseLinks.push({ href: "/courses", label: "Browse Courses" });
    }

    if (user.role === 'instructor' || user.role === 'admin') {
      baseLinks.push(
        { href: "/dashboard/instructor/courses", label: "My Courses" },
        { href: "/dashboard/instructor/assignments", label: "My Assignments" },
        { href: "/dashboard/instructor/announcements/create", label: "Announcements" }
      );
    }

    return baseLinks;
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              OCMS
            </Link>
            
            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition py-2">
                  Dashboard
                </Link>
                {user.role === 'student' && (
                  <Link href="/courses" className="text-gray-700 hover:text-blue-600 transition py-2">
                    Browse Courses
                  </Link>
                )}
                {(user.role === 'instructor' || user.role === 'admin') && (
                  <>
                    <Link href="/dashboard/instructor/courses" className="text-gray-700 hover:text-blue-600 transition py-2">
                      My Courses
                    </Link>
                    <Link href="/dashboard/instructor/assignments" className="text-gray-700 hover:text-blue-600 transition py-2">
                      My Assignments
                    </Link>
                    <Link href="/dashboard/instructor/announcements/create" className="text-gray-700 hover:text-blue-600 transition py-2">
                      Announcements
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {user && <NotificationBell />}
            
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop User Info and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <NotificationBell />
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2 pb-4">
              {getMobileMenuLinks()?.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile User Info and Logout */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-3 px-4 py-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full mt-3 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}