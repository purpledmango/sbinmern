"use client"

import React, { useEffect, useState } from 'react'
import { Rocket, Home, Images, Cog, PieChart, Users, Settings, Bell, ChevronDown, Menu, X, CpuIcon, Camera, Rotate3D } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Overview from '../components/Overview'
import { useRouter } from 'next/navigation'
import axiosInstance from '../../utils/axiosInstance.js'
import Image from 'next/image'
import Instances from '../components/Instances'
import Snapshots from '../components/Snapshots'
import Backup from '../components/Backup'
import Migrate from '../components/Migrate'

const Dashboard = () => {

  const router = useRouter()
  const [tab, setTab] = useState(localStorage.getItem("currentPage") || "overview");
  const [notifications, setNotifications] = useState(3)
  const [userData, setUserData] = useState({ name: '' })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  
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

  // Fetch user data on component mount
  useEffect(() => {
    fetchUser();
  }, []) // Empty dependency array means this runs only once on mount

  const fetchUser = async () => {
    try {
      setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = async() => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      console.log(response);

      localStorage.removeItem("uid");
      localStorage.removeItem("token")
      router.push("/auth/login")

    } catch (error) {
      console.log(error)
    }
  }

  // Fixed NavItem component with proper event handling
  const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      className={`
        capitalize flex items-center w-full px-4 py-3 rounded-lg mb-2 
        transition-all duration-300 ease-in-out transform
        ${active 
          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg scale-105' 
          : `text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-102 hover:shadow-md
             ${isDarkMode ? 'dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white' : ''}`
        }
        focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50
      `}
    >
      <Icon className={`${isSidebarOpen ? 'mr-3' : 'mx-auto'} h-5 w-5 transition-all duration-200`} />
      {isSidebarOpen && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      )}
    </button>
  )

  // Handle tab changes with proper state management
  const handleTabChange = (newTab) => {
    if (tab !== newTab) {
      setTab(newTab)
      if (window.innerWidth < 1024) {
        setIsMobileMenuOpen(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-gradient-to-br from-indigo-50 to-slate-50 text-slate-800'}`}>
      {/* Mobile Menu Button - only visible on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleMobileMenu}
          className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-gray-50'} shadow-md`}
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
                  <motion.h1 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}
                  >
                    HostAstra.com
                  </motion.h1>
                )}
              </div>
            </div>

            <nav className="mt-8 px-4">
              <NavItem 
                icon={Home} 
                label="overview" 
                active={tab === 'overview'} 
                onClick={() => handleTabChange('overview')}
              />
              <NavItem 
                icon={CpuIcon} 
                label="instances" 
                active={tab === 'instances'} 
                onClick={() => handleTabChange('instances')}
              />
              <NavItem 
                icon={Rotate3D} 
                label="migrate" 
                active={tab === 'migrate'} 
                onClick={() => handleTabChange('migrate')}
              />
              <NavItem 
                icon={Camera} 
                label="snapshots" 
                active={tab === 'snapshots'} 
                onClick={() => handleTabChange('snapshots')}
              />
              <NavItem 
                icon={Settings} 
                label="backups" 
                active={tab === 'backups'} 
                onClick={() => handleTabChange('backups')}
              />

              {/* Dark Mode Toggle */}
              <div className={`mt-auto pt-6 ${isSidebarOpen ? 'px-4' : 'flex justify-center'}`}>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`flex items-center ${
                    isSidebarOpen ? 'w-full justify-between' : 'justify-center'
                  } px-4 py-2 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {isSidebarOpen && <span>Dark Mode</span>}
                  <div className={`w-10 h-5 rounded-full ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'} relative transition-colors duration-200`}>
                    <motion.div 
                      animate={{ x: isDarkMode ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </button>
              </div>
            </nav>

            {/* Desktop-only sidebar toggle button at bottom */}
            <div className="hidden lg:block absolute bottom-4 right-0">
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-l-lg shadow-md transform translate-x-1/2 transition-all duration-200 ${
                  isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-600 hover:bg-gray-50'
                }`}
              >
                <ChevronDown 
                  className={`h-5 w-5 transition-transform duration-200 ${!isSidebarOpen ? 'rotate-90' : '-rotate-90'}`} 
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
            <motion.h2 
              key={tab}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`text-xl font-semibold capitalize ml-8 lg:ml-0 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}
            >
              {tab}
            </motion.h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className={`relative p-2 rounded-full transition-colors duration-200 ${
              isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
            }`}>
              <Bell className={`h-5 w-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
              {notifications > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {notifications}
                </motion.span>
              )}
            </button>
            
            <div className="group relative">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  {userData.name?.charAt(0) || 'U'}
                </div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} hidden md:block`}>
                  {userData.name || 'User'}
                </span>
                <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} hidden md:block transition-transform group-hover:rotate-180 duration-200`} />
              </div>
              
              <div className="absolute right-0 top-full mt-1 w-full bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tab === 'overview' && <Overview isDarkMode={isDarkMode} />}
              
              {tab === 'instances' && <Instances isDarkMode={isDarkMode} />}

              {tab === 'migrate' && <Migrate isDarkMode={isDarkMode} />}

              {tab === 'snapshots' && <Snapshots  isDarkMode={isDarkMode}/>}

              {tab === 'backups' && <Backup isDarkMode={isDarkMode} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default Dashboard