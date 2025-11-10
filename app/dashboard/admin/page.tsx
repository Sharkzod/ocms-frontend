'use client';
import { useAuth } from '@/contexts/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';

function AdminDashboardContent() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Users', value: '0', color: 'text-blue-600', icon: '👥', change: '+12%' },
    { label: 'Total Courses', value: '0', color: 'text-green-600', icon: '📚', change: '+5%' },
    { label: 'Instructors', value: '0', color: 'text-purple-600', icon: '👨‍🏫', change: '+2%' },
    { label: 'Students', value: '0', color: 'text-orange-600', icon: '🎓', change: '+15%' },
    { label: 'Active Sessions', value: '0', color: 'text-red-600', icon: '🔗', change: '+8%' },
    { label: 'System Load', value: '24%', color: 'text-gray-600', icon: '⚡', change: '-3%' },
  ];

  const recentActivities = [
    { action: 'User Registration', user: 'newstudent@email.com', time: '5 min ago', type: 'user' },
    { action: 'Course Created', user: 'Dr. Smith', time: '1 hour ago', type: 'course' },
    { action: 'Payment Processed', user: 'jane.doe@email.com', time: '2 hours ago', type: 'payment' },
    { action: 'System Backup', user: 'System', time: '6 hours ago', type: 'system' },
  ];

  const systemStatus = [
    { service: 'Database', status: 'operational', latency: '12ms' },
    { service: 'API Server', status: 'operational', latency: '45ms' },
    { service: 'File Storage', status: 'degraded', latency: '230ms' },
    { service: 'Email Service', status: 'operational', latency: '18ms' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          System overview and administrative controls.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Actions</h2>
            
            <div className="space-y-3">
              <Link 
                href="/admin/users" 
                className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition group"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">
                  👥
                </div>
                <span className="font-medium text-gray-900 group-hover:text-blue-700">Manage Users</span>
              </Link>

              <Link 
                href="/admin/courses" 
                className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition group"
              >
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm">
                  📚
                </div>
                <span className="font-medium text-gray-900 group-hover:text-green-700">Manage Courses</span>
              </Link>

              <Link 
                href="/admin/analytics" 
                className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition group"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                  📈
                </div>
                <span className="font-medium text-gray-900 group-hover:text-purple-700">View Analytics</span>
              </Link>

              <Link 
                href="/admin/settings" 
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center text-white text-sm">
                  ⚙️
                </div>
                <span className="font-medium text-gray-900 group-hover:text-gray-700">System Settings</span>
              </Link>

              <Link 
                href="/admin/reports" 
                className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition group"
              >
                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center text-white text-sm">
                  📊
                </div>
                <span className="font-medium text-gray-900 group-hover:text-yellow-700">Generate Reports</span>
              </Link>

              <Link 
                href="/admin/backup" 
                className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition group"
              >
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-sm">
                  💾
                </div>
                <span className="font-medium text-gray-900 group-hover:text-red-700">Backup Data</span>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Status</h2>
            
            <div className="space-y-3">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{service.service}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{service.latency}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                    <span className={`text-xs font-medium ${
                      service.status === 'operational' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities & System Overview */}
        <div className="xl:col-span-2 space-y-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              <Link href="/admin/activities" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'course' ? 'bg-green-100 text-green-600' :
                    activity.type === 'payment' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'user' ? '👤' :
                     activity.type === 'course' ? '📚' :
                     activity.type === 'payment' ? '💰' : '⚙️'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">by {activity.user}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Storage Usage</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">12.4 GB of 19 GB used</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Memory Usage</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">3.2 GB of 7.6 GB used</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">CPU Load</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">24% average load</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Network I/O</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">High traffic volume</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <RouteGuard requiredRole="admin">
      <AdminDashboardContent />
    </RouteGuard>
  );
}