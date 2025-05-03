"use client"

import React, { useEffect, useState } from 'react'
import { Rocket, Home, PieChart, Users, Settings, Bell, ChevronDown, Menu, X, CpuIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Overview from '../components/Overview'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/utils/axiosInstance'
import Image from 'next/image'
import Instances from '../components/Instances'

const Dashboard = () => {
  const router = useRouter()
  const [tab, setTab] = useState('overview')
  const [notifications, setNotifications] = useState(3)
  const [userData, setUserData] = useState({ name: '' })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // Initialize on load
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchUser();
  }, [])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      const response = await axiosInstance.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUserData(response.data.data)
    } catch (error) {
      console.error("Dashboard error", error)
      localStorage.removeItem("uid")
      localStorage.removeItem("token")
      router.push("/auth/login")
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
      }`}
    >
      <Icon className={`${isSidebarOpen ? 'mr-3' : 'mx-auto'} h-5 w-5`} />
      {isSidebarOpen && <span>{label}</span>}
    </button>
  )

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-gradient-to-br from-indigo-50 to-slate-50 text-slate-800'}`}>
      {/* Mobile Menu Button - only visible on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleMobileMenu}
          className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-800'} shadow-md`}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Collapsible on desktop, slide-in on mobile */}
      <AnimatePresence>
        {(isSidebarOpen || isMobileMenuOpen) && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className={`fixed lg:relative z-20 h-full ${
              isDarkMode ? 'bg-slate-800 border-r border-slate-700' : 'bg-white border-r border-slate-200'
            } shadow-lg lg:shadow-md ${isSidebarOpen ? 'w-64' : 'w-20'}`}
          >
            <div className={`p-6 h-24 ${!isSidebarOpen && 'flex justify-center items-center'}`}>
  <div className="flex items-center space-x-2">
    <div className={`
      rounded-full 
      overflow-hidden 
      border-2 
      ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}
      shadow-lg
      hover:shadow-xl
      transition-all
      duration-300
      ${isSidebarOpen ? 'w-12 h-12' : 'w-16 h-16'}
    `}>
      <Image 
        src="/images/icon.png" 
        width={isSidebarOpen ? 48 : 64} 
        height={isSidebarOpen ? 48 : 64} 
        alt="Hostastra Dashboard"
        className="object-cover w-full h-full"
      />
    </div>
    {isSidebarOpen && (
      <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        HostAstra.com
      </h1>
    )}
  </div>
</div>

            <nav className="mt-8 px-4">
              <NavItem 
                icon={Home} 
                label="Overview" 
                active={tab === 'overview'} 
                onClick={() => {
                  setTab('overview')
                  if (window.innerWidth < 1024) setIsMobileMenuOpen(false)
                }}
              />
              <NavItem 
                icon={CpuIcon} 
                label="Instances" 
                active={tab === 'Instances'} 
                onClick={() => {
                  setTab('instances')
                  if (window.innerWidth < 1024) setIsMobileMenuOpen(false)
                }}  
              />
              <NavItem 
                icon={Users} 
                label="Users" 
                active={tab === 'users'} 
                onClick={() => {
                  setTab('users')
                  if (window.innerWidth < 1024) setIsMobileMenuOpen(false)
                }}
              />
              <NavItem 
                icon={Settings} 
                label="Settings" 
                active={tab === 'settings'} 
                onClick={() => {
                  setTab('settings')
                  if (window.innerWidth < 1024) setIsMobileMenuOpen(false)
                }}
              />

              {/* Dark Mode Toggle */}
              <div className={`mt-auto pt-6 ${isSidebarOpen ? 'px-4' : 'flex justify-center'}`}>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`flex items-center ${
                    isSidebarOpen ? 'w-full justify-between' : 'justify-center'
                  } px-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-slate-700 text-slate-200' 
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {isSidebarOpen && <span>Dark Mode</span>}
                  <div className={`w-10 h-5 rounded-full ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'} relative`}>
                    <motion.div 
                      animate={{ x: isDarkMode ? 20 : 2 }}
                      className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full"
                    />
                  </div>
                </button>
              </div>
            </nav>

            {/* Desktop-only sidebar toggle button at bottom */}
            <div className="hidden lg:block absolute bottom-4 right-0">
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-l-lg shadow-md transform translate-x-1/2 ${
                  isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600'
                }`}
              >
                <ChevronDown 
                  className={`h-5 w-5 transition-transform ${!isSidebarOpen ? 'rotate-90' : '-rotate-90'}`} 
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className={`${
          isDarkMode ? 'bg-slate-800 border-b border-slate-700' : 'bg-white border-b border-slate-200'
        } shadow-sm p-4 sticky top-0 z-10 flex justify-between items-center`}>
          <div className="flex items-center">
            <h2 className={`text-xl font-semibold capitalize ml-8 lg:ml-0 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>{tab}</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className={`relative p-2 rounded-full ${
              isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}>
              <Bell className={`h-5 w-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                {userData.name?.charAt(0) || 'U'}
              </div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} hidden md:block`}>
                {userData.name || 'User'}
              </span>
              <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} hidden md:block`} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {tab === 'overview' && <Overview isDarkMode={isDarkMode} />}
          
          {tab === 'instances' && (
            <Instances/>
          )}

          {tab === 'users' && (
            <div className={`rounded-xl shadow-sm p-6 ${
              isDarkMode ? 'bg-slate-800/80 border border-slate-700' : 'bg-white border border-slate-200'
            } backdrop-blur-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                User Management
              </h3>
              <div className="h-96 flex items-center justify-center text-slate-500">
                User management content will appear here
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className={`rounded-xl shadow-sm p-6 ${
              isDarkMode ? 'bg-slate-800/80 border border-slate-700' : 'bg-white border border-slate-200'
            } backdrop-blur-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Settings
              </h3>
              <div className="h-96 flex items-center justify-center text-slate-500">
                Settings content will appear here
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard