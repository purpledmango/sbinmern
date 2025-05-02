"use client"

import { Menu, XIcon } from 'lucide-react';
import React, { use, useEffect } from 'react'
import { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
// import { l } from 'framer-motion/dist/types.d-DDSxwf0n';

import Image from 'next/image';
import Link from 'next/link';
const Nav = () => {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const userData = await checkIfUserLoggedIn();
      if (userData) {
        
        setUser(userData.data.name);  
      }
    };
    verifyAuth();
  }, []);
  
  const checkIfUserLoggedIn = async () => {
    const token = localStorage.getItem("token");
    const uid = localStorage.getItem("uid");
  
    // Early return if no token or uid exists
    if (!token || !uid) {
      localStorage.removeItem("token");
      localStorage.removeItem("uid");
      return null;
    }
  
    try {
      const response = await axiosInstance.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;  // Return the data for the useEffect to handle
  
    } catch (error) {
      console.error("Nav error", error);
      
      // Handle different error cases
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("uid");
        }
      } else if (error.request) {
        console.error("No response received", error.request);
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
      } else {
        console.error("Request setup error", error.message);
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
      }
      
      return null;
    }
  };
  
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between h-16">
               <div className="flex items-center">
                 <div className="flex-shrink-0 flex items-center">
                   {/* <div className="h-8 w-8 bg-indigo-600 rounded-full"></div>
                   <span className="ml-2 font-bold text-xl">HostAstra</span> */}
                   <Image 
                    src="/images/hostastra-logo.png" 
                    alt="Hostastra Logo" 
                    width={200} 
                    height={200} 
    />                 </div>
               </div>
               <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                 <Link href="/" className="px-3 py-2 text-sm font-medium text-indigo-600">Home</Link>
                 <Link href="/wordpress" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">WordPress</Link>
                 <Link href="/magento" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">Magento</Link>
                 <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">Pricing</Link>
                 <Link href="/about" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">About</Link>
                 <Link href="/contact" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">Contact</Link>
               </div>
               <div className="flex items-center md:hidden">
                 <button 
                   onClick={() => setIsMenuOpen(!isMenuOpen)}
                   className="p-2 rounded-md text-slate-600 hover:text-slate-800 focus:outline-none"
                 >
                   {isMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
                 </button>
               </div>
               {user? <div className="hidden md:flex items-center">
                 <a href="/dashboard" className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                   {user}
                 </a>
               </div>:<div className="hidden md:flex items-center">
                 <a href="/auth/login " className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                   Login
                 </a>
               </div>}
             </div>
           </div>
           
           {/* Mobile menu */}
           {isMenuOpen && (
             <div className="md:hidden">
               <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                 <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 bg-indigo-50">Home</Link>
                 <Link href="/wordpress" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">WordPress</Link>
                 <Link href="/magento" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">Magento</Link>
                 <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">Pricing</Link>
                 <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">About</Link>
                 <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">Contact</Link>
                 <Link href="/getting-started" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">Get Started</Link>
               </div>
             </div>
           )}
         </nav>
  )
}

export default Nav