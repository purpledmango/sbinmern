"use client"

import { Menu } from 'lucide-react';
import React from 'react'
import { useState } from 'react';

const Nav = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between h-16">
               <div className="flex items-center">
                 <div className="flex-shrink-0 flex items-center">
                   <div className="h-8 w-8 bg-indigo-600 rounded-full"></div>
                   <span className="ml-2 font-bold text-xl">HostAstra</span>
                 </div>
               </div>
               <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                 <a href="/" className="px-3 py-2 text-sm font-medium text-indigo-600">Home</a>
                 <a href="/wordpress" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">WordPress</a>
                 <a href="/magento" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">Magento</a>
                 <a href="/pricing" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">Pricing</a>
                 <a href="/about" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">About</a>
                 <a href="/contact" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">Contact</a>
               </div>
               <div className="flex items-center md:hidden">
                 <button 
                   onClick={() => setIsMenuOpen(!isMenuOpen)}
                   className="p-2 rounded-md text-slate-600 hover:text-slate-800 focus:outline-none"
                 >
                   {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                 </button>
               </div>
               <div className="hidden md:flex items-center">
                 <a href="/auth/login " className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                   Login
                 </a>
               </div>
             </div>
           </div>
           
           {/* Mobile menu */}
           {isMenuOpen && (
             <div className="md:hidden">
               <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                 <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 bg-indigo-50">Home</a>
                 <a href="/wordpress" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">WordPress</a>
                 <a href="/magento" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">Magento</a>
                 <a href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">Pricing</a>
                 <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">About</a>
                 <a href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">Contact</a>
                 <a href="/getting-started" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">Get Started</a>
               </div>
             </div>
           )}
         </nav>
  )
}

export default Nav