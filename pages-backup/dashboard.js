import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if token exists in localStorage or cookies
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          // No token found, redirect to login
          router.push('/login');
          return;
        }

        // Parse user data
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setLoading(false);
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Authentication error');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Link href="/login" className="text-blue-500 hover:underline">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transform group-hover:scale-110 transition-all overflow-hidden border-2 border-amber-200">
                <Image
                  src="/round_logo.svg"
                  alt="STEAM Workshop Logo"
                  width={48}
                  height={48}
                  priority
                />
              </div>
              <span className="text-amber-900 font-bold text-xl hidden sm:inline">STEAM Workshop</span>
            </Link>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Welcome</p>
                <p className="text-gray-800 font-semibold text-amber-900">{user.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg shadow-md p-8 mb-8 border-2 border-amber-300">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">
            Welcome back, {user.username}! 👋
          </h2>
          <p className="text-amber-800">
            You're logged in as <span className="font-semibold">{user.email}</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Projects</p>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="text-4xl text-blue-200">📁</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Uploads</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="text-4xl text-green-200">📤</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Followers</p>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
              <div className="text-4xl text-purple-200">👥</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105">
              Create New Project
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105">
              Upload Workshop Item
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105">
              Browse Community
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-8 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
          <div className="text-center py-8">
            <p className="text-gray-600">No recent activity yet</p>
            <p className="text-gray-500 text-sm">Start by creating a new project or uploading an item!</p>
          </div>
        </div>
      </div>
    </div>
  );
}