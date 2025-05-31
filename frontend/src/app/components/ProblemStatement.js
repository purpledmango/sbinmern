"use client"
import React, { useState, useEffect } from 'react'
import { Shield, Server, Clock, X, Check, RocketIcon, CloudOff, CloudCog, Wifi, XIcon, ServerCrash, HandCoins, } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const ProblemStatement = () => {
  return (
    <>
    <div className=" bg-indigo-800 text-slate-200">
      <div className='grid grid-cols-12 px-2 md:px-6 py-6'>
        <motion.div animate={{
      y: [0, -15, 0], // Moves up 15px and back down
    }}
    transition={{
      duration: 2, // Animation duration in seconds
      repeat: Infinity, // Loop infinitely
      ease: "easeInOut", // Smooth easing
    }} className='col-span-12 md:col-span-4 flex items-center justify-center'>
          <Image src={"/images/wpServer.png"} width={400} height={400} alt="Logo"/>
        </motion.div>
        
        {/* Text info */}
        <div className='col-span-12 md:col-span-8'>
          <div className='text-sm tracking-wide font-bold uppercase py-6'>Why choose us</div>
          <h3 className='text-3xl font-semibold'>
            Struggling Between Shared Hosting That Fails You & Dedicated Hosting That Drains Your Budget?
          </h3>
          <p className='py-3'>
            Shared hosting is slow, risky, and full of compromises.
            Dedicated hosting is powerful — but expensive and hard to manage.
          </p>
          <div className='font-bold tracking-wide py-1.5'>
            Hostastra gives you the best of both — speed, simplicity, and savings.
          </div>
          
          {/* Fixed white box with proper alignment */}
          <div className=' py-2.5 px-4 bg-indigo-200 rounded-xl text-gray-950 w-full max-w-full my-4'>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-2'>
          <div className='flex items-center gap-2 font-semibold text-sm sm:text-base px-4 sm:px-6 border-r-0 sm:border-r-2 border-gray-200'>
            <ServerCrash className='h-4 w-4 sm:text-2xl text-primary-500' />
            <span>Fully Dedicated Hosting - No Sharing</span>
          </div>
          <div className='flex items-center gap-2 font-semibold text-sm sm:text-base px-4 sm:px-6 '>
            <HandCoins className='h-4 w-4 sm:text-2xl text-primary-500' />
            <span>Simple and Affordable Premium Hosting</span>
          </div>
         
        </div>
          </div>
          
          <div className='py-4'>
            <div className='text-md tracking-wide font-semibold mb-3'>Say Goodbye To:</div>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2'>
                <XIcon className='text-red-400 w-5 h-5 flex-shrink-0'/> 
                <span>Shared servers slowing your site down</span>
              </li>
              <li className='flex items-center gap-2'>
                <XIcon className='text-red-400 w-5 h-5 flex-shrink-0'/> 
                <span>Hours wasted on manual setups</span>
              </li>
              <li className='flex items-center gap-2'>
                <XIcon className='text-red-400 w-5 h-5 flex-shrink-0'/> 
                <span>No built-in security or backups</span>
              </li>
              <li className='flex items-center gap-2'>
                <XIcon className='text-red-400 w-5 h-5 flex-shrink-0'/> 
                <span>Support teams that don't respond when you need them</span>
              </li>
              <li className='flex items-center gap-2'>
                <XIcon className='text-red-400 w-5 h-5 flex-shrink-0'/> 
                <span>Performance affected by other users</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    
    </div>

       <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-blue-700">
            The Perfect Balance of Speed, Simplicity, and Savings
          </h3>
          <p className="mt-2 text-lg text-gray-600">
            Join thousands of websites running on Hostastra's optimized hosting platform
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link href='/auth/login' className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 font-medium">
              Get Started Now
            </Link>
            <Link href={"#pricing"} className="px-8 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 transition-colors duration-300">
              View Plans
            </Link>
          </div>
        </div>
    </>

  )
}

export default ProblemStatement