import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Attempt login
      await login(email, password);
      
      // Check if user is admin to redirect to appropriate page
      if (email === 'admin@admin.com' && password === 'admin123') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. ' + (err.message || 'Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center relative overflow-hidden">
        {/* This is where your image will go */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-600/30"></div>
        <div className="absolute bottom-10 left-10 z-10 text-white">
          <h2 className="text-3xl font-bold mb-2">Sentinent Stories</h2>
          <p className="text-lg">Transform your events with the power of AI</p>
        </div>
        {/* Placeholder for your image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <img 
            src="https://www.acharmingfete.com/wp-content/uploads/2023/04/mp-4.jpg" 
            alt="Event planning illustration" 
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Logo for mobile view */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-indigo-600">Sentinent Stories</h1>
              <p className="text-gray-500 mt-2">Event Planning Platform</p>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
            <p className="text-gray-600 mt-2">Please enter your credentials to sign in</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-400" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center mb-6">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Login button */}
            <div className="mb-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;