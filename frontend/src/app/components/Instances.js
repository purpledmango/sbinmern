"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Globe, Server, Calendar, Plus, X, 
  ShoppingCart, Wrench, ArrowUpRight, Loader,
  CheckCircle2, AlertCircle
} from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axiosInstance from '@/utils/axiosInstance'
import Spinner from "./Spinner.js"
import DeploymentCard from './DeploymenCard'
import CreateDeploymentModal from './CreateDeploymentModal'

const Instances = ({ isDarkMode = false }) => {
  const [deployments, setDeployments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDeployments, setActiveDeployments] = useState(new Set())
  const [showModal, setShowModal] = useState(false)

  // Fetch deployments function
  const fetchDeployments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axiosInstance.get('/deployments', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDeployments(response.data)
      
      // Update active deployments
      const activeIds = new Set(
        response.data
          .filter(d => d.status === 'in-progress' || d.status === 'initiated')
          .map(d => d.id)
      )
      setActiveDeployments(activeIds)
    } catch (error) {
      console.error('Failed to fetch deployments:', error)
      toast.error("Failed to fetch deployments", {
        theme: isDarkMode ? 'dark' : 'light'
      })
    } finally {
      setLoading(false)
    }
  }, [isDarkMode])

  // Initial fetch and auto-refresh for active deployments
  useEffect(() => {
    fetchDeployments()
    
    const interval = setInterval(() => {
      if (activeDeployments.size > 0) {
        fetchDeployments()
      }
    }, 5000) // Refresh every 5 seconds if there are active deployments
    
    return () => clearInterval(interval)
  }, [fetchDeployments, activeDeployments.size])

  const handleDeploymentCreated = async (deploymentData) => {
    // Add the new deployment to active deployments
    setActiveDeployments(prev => new Set(prev).add(deploymentData.deploymentId))
    // Refresh the list
    await fetchDeployments()
  }

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-500',
      'failed': 'bg-red-500',
      'in-progress': 'bg-amber-500',
      'initiated': 'bg-blue-500',
      'rolled-back': 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusText = (status) => {
    const textColors = {
      'completed': isDarkMode ? 'text-green-300' : 'text-green-700',
      'failed': isDarkMode ? 'text-red-300' : 'text-red-700',
      'in-progress': isDarkMode ? 'text-amber-300' : 'text-amber-700',
      'initiated': isDarkMode ? 'text-blue-300' : 'text-blue-700',
      'rolled-back': isDarkMode ? 'text-red-300' : 'text-red-700'
    }
    return textColors[status] || 'text-gray-500'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getDeploymentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'wordpress': return <Globe className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      case 'magento': return <ShoppingCart className={`h-5 w-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
      default: return <Server className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
    }
  }

  return (
    <div className="relative">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? 'dark' : 'light'}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Deployment Instances
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your WordPress and Magento deployments
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center px-4 py-2 rounded-lg shadow-sm ${
            isDarkMode
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/25'
              : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/25'
          } transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5`}
        >
          <Plus size={18} className="mr-2" />
          Create Deployment
        </button>
      </div>

      {/* Stats Bar */}
      {deployments.length > 0 && (
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 rounded-lg ${
          isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'
        }`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {deployments.length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Total Deployments
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-green-500`}>
              {deployments.filter(d => d.status === 'completed').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Active
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-amber-500`}>
              {deployments.filter(d => d.status === 'in-progress' || d.status === 'initiated').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              In Progress
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-red-500`}>
              {deployments.filter(d => d.status === 'failed').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Failed
            </div>
          </div>
        </div>
      )}

      {/* Deployment List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="large" />
        </div>
      ) : deployments.length === 0 ? (
        <div className={`text-center py-16 rounded-xl border-2 border-dashed ${
          isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-300 bg-slate-50/50'
        }`}>
          <Server className={`h-16 w-16 mx-auto mb-4 ${
            isDarkMode ? 'text-slate-600' : 'text-slate-400'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            No deployments found
          </h3>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Get started by creating your first deployment
          </p>
          <button
            onClick={() => setShowModal(true)}
            className={`inline-flex items-center px-6 py-3 rounded-lg shadow-sm ${
              isDarkMode
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            } transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5`}
          >
            <Plus size={18} className="mr-2" />
            Create Your First Deployment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deployments.map((deployment, index) => (
            <DeploymentCard 
              key={deployment.id || index} 
              deployment={deployment} 
              isDarkMode={isDarkMode}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              formatDate={formatDate}
              getDeploymentIcon={getDeploymentIcon}
            />
          ))}
        </div>
      )}

      {/* Create Deployment Modal */}
      <CreateDeploymentModal
        showModal={showModal}
        setShowModal={setShowModal}
        isDarkMode={isDarkMode}
        onDeploymentCreated={handleDeploymentCreated}
      />
    </div>
  )
}

export default Instances