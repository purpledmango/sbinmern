"use client"
import React, { useState, useEffect } from 'react';

import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Spinner from '@/app/components/Spinner';

// import Spinner from '@/components/Spinner'; // Make sure this path matches your project structure

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: 'none',
    type: 'error' // 'error' or 'success'
  });
  const [loginCreds, setLoginCreds] = useState({
    email: "",
    password: "",
  });
  
  useEffect(() => {
    // Auto-hide notification after 3 seconds
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
        // Store user data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("uid", response.data.user?.uid || response.data.uid);
        
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new Event('tokenChange'));
        
        showNotification('Login successful!', 'success');
        
        // Brief delay to show success message before redirecting
        setTimeout(() => {
          // Fix the inconsistent data structure access
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
    <div className="w-full max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg relative">
      {/* Pop Notification */}
      {notification.show && (
        <div 
          className={`absolute top-2 right-2 left-2 p-3 rounded-md shadow-md text-white text-sm ${
            notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
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
      
      <h2 className="text-2xl font-bold text-center text-neutral-800 mb-6">
        Login
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-600">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={loginCreds.email}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-2 mt-1 text-neutral-600 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 hover:border-green-600 transition-colors duration-300"
            required
          />
        </div>
        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-600">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={loginCreds.password}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-2 mt-1 text-neutral-600 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 hover:border-green-600 transition-colors duration-300"
            required
          />
        </div>
        {/* Login Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-colors duration-300 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>
        {/* Signup Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-neutral-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;