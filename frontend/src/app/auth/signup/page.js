"use client"
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaSpinner } from 'react-icons/fa';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import Spinner from "../../components/Spinner.js"
import toast from 'react-hot-toast';
// List of Indian states for dropdown
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Lakshadweep", "Puducherry"
];

const SignUp = () => {
  const router = useRouter();
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: {
      state: "",
      country: "India"
    }
  });
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "state") {
      setSignupData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          state: value
        }
      }));
    } else {
      setSignupData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear password error when either password field changes
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const validatePasswords = () => {
    if (signupData.password !== signupData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (!validatePasswords()) {
      return; // Stop form submission if passwords don't match
    }
    
    // Remove confirmPassword before sending to API
    const dataToSubmit = {...signupData};
    
    
    setIsLoading(true);
    try {
      const response = await toast.promise(
        axiosInstance.post("/auth/signup", dataToSubmit),
        {
          loading: 'Signing up...',
          success: (response) => <b>{response.data.message}</b>, // Use response.data.message for success
          error: (error) => <b>{error.response?.data?.message || "Could not sign up. Please try again."}</b>, // Use error.response.data.message for error
        }
      );  
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("uid", response.data.user.uid);
        window.dispatchEvent(new Event('tokenChange'));
      }
      if (localStorage.getItem("uid")) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 text-gray-800">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us today and get started
          </p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={signupData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
              required
            />
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex mt-1 rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                +91
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={signupData.phone}
                onChange={handleChange}
                className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
                required
              />
            </div>
          </div>

          {/* State Dropdown */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <select
              id="state"
              name="state"
              value={signupData.address.state}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
              required
            >
              <option value="" disabled>Select your state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={signupData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
              required
            />
          </div>
          
          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={signupData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                passwordError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-green-500 focus:ring-green-500"
              }`}
              required
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          {/* Sign Up Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm ${
                isLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              }`}
            >
              {isLoading ? <FaSpinner className='animate-spin'/> : "Sign up"}
            </button>
          </div>
        </form>

        {/* Divider */}
        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div> */}
        
        {/* Social Sign Up Options */}
        {/* <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            Google
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
          >
            <FaFacebook className="h-5 w-5 mr-2 text-blue-600" />
            Facebook
          </button>
        </div> */}

        {/* Already have an account section */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a 
              href="/auth/login" 
              className="font-medium text-green-600 hover:text-green-500"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;