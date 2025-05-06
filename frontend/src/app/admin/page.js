"use client"

import React, { useState, useEffect } from 'react'
import InfraManagement from '../components/InfraManagement'

const Page = () => {
  const [mounted, setMounted] = useState(false)
 
  
  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if dark mode is active
  const isDarkMode = 'dark'

  if (!mounted) {
    // Return a placeholder or skeleton during SSR to prevent hydration errors
    return (
      <div className="w-full h-screen bg-slate-100 dark:bg-slate-900 p-6">
        <div className="animate-pulse bg-slate-200 dark:bg-slate-800 h-8 w-64 mb-6 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 h-64 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <InfraManagement isDarkMode={isDarkMode} />
    </div>
  )
}

export default Page