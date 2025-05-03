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
import Spinner from './Spinner'
import DeploymentCard from './DeploymenCard'

const Instances = ({ isDarkMode = false }) => {
  const [deployments, setDeployments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDeployments, setActiveDeployments] = useState(new Set())
  const [showModal, setShowModal] = useState(false)
  const [newDeployment, setNewDeployment] = useState({
    deploymentName: '',
    deploymentType: 'wordpress'
  })
  const [deploymentLoading, setDeploymentLoading] = useState(false)

  // Memoized fetch function with auto-refresh for active deployments
  const fetchDeployments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axiosInstance.get("/deploy", {
        headers: { Authorization: `Bearer ${token}` },
        params: { _: Date.now() }
      })
      
      if (response.data.deployments) {
        setDeployments(response.data.deployments)
        
        // Update active deployments set
        setActiveDeployments(prev => {
          const newSet = new Set(prev)
          response.data.deployments.forEach(dep => {
            if (['initiated', 'in-progress'].includes(dep.status)) {
              newSet.add(dep.deploymentId)
            } else {
              newSet.delete(dep.deploymentId)
            }
          })
          return newSet
        })
      }
    } catch (error) {
      console.error("Failed to fetch deployments:", error)
      toast.error("Failed to fetch deployments", {
        theme: isDarkMode ? 'dark' : 'light'
      })
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        // router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }, [isDarkMode])

  useEffect(() => {
    fetchDeployments()
    
    // Set up polling for active deployments
    const pollInterval = setInterval(fetchDeployments, 5000)
    return () => clearInterval(pollInterval)
  }, [fetchDeployments])

  const handleCreateDeployment = async () => {
    if (!newDeployment.deploymentName.trim()) {
      toast.warning("Please enter a deployment name", {
        theme: isDarkMode ? 'dark' : 'light'
      })
      return
    }
    
    try {
      setDeploymentLoading(true)
      const token = localStorage.getItem("token")
      const response = await axiosInstance.post('/deploy', newDeployment, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success("Deployment initiated successfully", {
        theme: isDarkMode ? 'dark' : 'light'
      })
      
      setShowModal(false)
      setNewDeployment({ deploymentName: '', deploymentType: 'wordpress' })
      setActiveDeployments(prev => new Set(prev).add(response.data.deploymentId))
      await fetchDeployments()
    } catch (error) {
      toast.error(`Failed to create deployment: ${error.response?.data?.message || error.message}`, {
        theme: isDarkMode ? 'dark' : 'light'
      })
      console.error(error)
    } finally {
      setDeploymentLoading(false)
    }
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
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          Deployment Instances
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center px-4 py-2 rounded-lg ${
            isDarkMode
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          } transition-colors duration-200`}
        >
          <Plus size={18} className="mr-2" />
          Create Deployment
        </button>
      </div>

      {/* Deployment List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="large" />
        </div>
      ) : deployments.length === 0 ? (
        <div className={`text-center py-16 rounded-xl border ${
          isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
        }`}>
          <Server className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            No deployments found
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className={`inline-flex items-center px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            } transition-colors duration-200`}
          >
            <Plus size={18} className="mr-2" />
            Create Deployment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deployments.map((deployment, index) => (
            <DeploymentCard key={index} deployment={deployment} isDarkMode={isDarkMode} />

          ))}
        </div>
      )}

      {/* Create Deployment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>
            
            <div className={`relative rounded-xl ${
              isDarkMode 
                ? 'bg-slate-800 border border-slate-700' 
                : 'bg-white border border-slate-200'
            } p-6 w-full max-w-md`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Create New Deployment
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className={`p-1 rounded-full ${
                    isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Deployment Name
                  </label>
                  <input
                    type="text"
                    value={newDeployment.deploymentName}
                    onChange={(e) => setNewDeployment({...newDeployment, deploymentName: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-800'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                    placeholder="My New Website"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Deployment Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className={`flex items-center p-3 rounded-lg cursor-pointer border-2 ${
                        newDeployment.deploymentType === 'wordpress' 
                          ? isDarkMode 
                            ? 'border-indigo-500 bg-indigo-900/30' 
                            : 'border-indigo-500 bg-indigo-50' 
                          : isDarkMode 
                            ? 'border-slate-700 bg-slate-800 hover:bg-slate-700/50' 
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                      onClick={() => setNewDeployment({...newDeployment, deploymentType: 'wordpress'})}
                    >
                      <Globe className={`h-5 w-5 mr-2 ${
                        newDeployment.deploymentType === 'wordpress' 
                          ? isDarkMode ? 'text-indigo-400' : 'text-indigo-600' 
                          : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        newDeployment.deploymentType === 'wordpress' 
                          ? isDarkMode ? 'text-indigo-300' : 'text-indigo-600' 
                          : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        WordPress
                      </span>
                    </div>
                    
                    <div className={`flex items-center p-3 rounded-lg cursor-not-allowed opacity-50 border-2 ${
                      isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <ShoppingCart className={`h-5 w-5 mr-2 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Magento
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateDeployment}
                  disabled={deploymentLoading}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    isDarkMode
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  } transition-colors ${deploymentLoading ? 'opacity-75' : ''}`}
                >
                  {deploymentLoading ? (
                    <>
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Server className="mr-2 h-4 w-4" />
                      Deploy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Instances 