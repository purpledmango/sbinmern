"use client"
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Spinner from '../../components/Spinner.js';
import { KeyRound } from 'lucide-react';

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: 'none',
    type: 'error'
  });
  const [loginCreds, setLoginCreds] = useState({
    email: "",
    password: "",
  });
  
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  const showNotification = (message, type = 'error') => {
    setNotification({
      show: true,
      message,
      type
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginCreds((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axiosInstance.post("/auth/login", loginCreds);
      
      if(response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("uid", response.data.user?.uid || response.data.uid);
        window.dispatchEvent(new Event('tokenChange'));
        
        showNotification('Login successful!', 'success');
        
        setTimeout(() => {
          const userRole = response.data.user?.role || response.data.role;
          if (userRole === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      }
    } catch (error) {
      console.log("Login Error:", error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showNotification(errorMessage, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 relative overflow-hidden">
      {/* Royal SVG Background */}
      <div className="absolute inset-0 z-0 opacity-20">
    <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
      <defs>
        <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        
        <pattern id="crownPattern" patternUnits="userSpaceOnUse" width="120" height="120">
          <g transform="scale(0.3)">
            {/* <!-- Crown symbol --> */}
            <path d="M0 50 L30 0 L60 20 L90 0 L120 50 L100 50 L100 80 L20 80 L20 50 Z" 
                  fill="url(#goldGradient)" stroke="#d97706" stroke-width="2"/>
          </g>
        </pattern>
        
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* <!-- Background --> */}
      <rect width="100%" height="100%" fill="url(#floorGradient)" />
      
      {/* <!-- Repeating crown pattern --> */}
      <rect width="100%" height="100%" fill="url(#crownPattern)" opacity="0.7" filter="url(#glow)" />
      
      {/* <!-- Center focus crown --> */}
      <g transform="translate(600, 400) scale(3)">
        <path d="M0 50 L30 0 L60 20 L90 0 L120 50 L100 50 L100 80 L20 80 L20 50 Z" 
              fill="url(#goldGradient)" stroke="#d97706" stroke-width="4"/>
        <circle cx="60" cy="30" r="5" fill="#ffffff" opacity="0.8"/>
        <circle cx="30" cy="20" r="4" fill="#ffffff" opacity="0.8"/>
        <circle cx="90" cy="20" r="4" fill="#ffffff" opacity="0.8"/>
      </g>
      
      {/* <!-- Light effect --> */}
      <radialGradient id="lightEffect" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#1e293b" stop-opacity="0"/>
      </radialGradient>
      <circle cx="600" cy="400" r="500" fill="url(#lightEffect)"/>
    </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-600 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-800 rounded-full filter blur-3xl opacity-10"></div>

      {/* Login Card */}
      <div className="w-full max-w-md mx-4 p-8 bg-white rounded-xl shadow-2xl relative z-10 border border-indigo-100 transform transition-all hover:shadow-indigo-200/50">
        {/* Crown Icon */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <KeyRound className='h-12 w-12 text-indigo-600'/>
        </div>

        {/* Notification */}
        {notification.show && (
          <div 
            className={`absolute top-2 right-2 left-2 p-3 rounded-md shadow-md text-white text-sm ${
              notification.type === 'error' ? 'bg-rose-900' : 'bg-orange-500'
            } transition-all duration-300 flex justify-between items-center`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        )}
        
        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-6 mt-4 font-poppins">
          HostAstra Login
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-indigo-800 mb-1">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={loginCreds.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 text-indigo-800 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 transition-all duration-300 bg-indigo-50/50"
              required
            />
          </div>
          
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-indigo-800 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={loginCreds.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 text-indigo-800 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 transition-all duration-300 bg-indigo-50/50"
              required
            />
          </div>
          
          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 text-white bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-indigo-500/20"
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <Spinner className="mr-2" />
                  <p className='text-sm'>Entering the Kingdom...</p>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Enter
                </>
              )}
            </button>
          </div>
          
          {/* Signup Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-indigo-600">
              Not a member yet?{" "}
              <Link
                href="/auth/signup"
                className="text-indigo-800 hover:text-indigo-900 font-medium underline underline-offset-2"
              >
                 Sign Up now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;