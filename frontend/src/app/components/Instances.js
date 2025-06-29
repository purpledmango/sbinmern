"use client"

import React, { useState, useEffect, useCallback } from 'react'
import {
  Globe, Server, Plus, ShoppingCart, Box, Zap, AlertTriangle, CheckCircle
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
  const [showModal, setShowModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchDeployments = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const uid = localStorage.getItem("uid")
      const response = await axiosInstance.get(
        `/deploy/user/${uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setDeployments(response.data.data)
    } catch (error) {
      console.error('Failed to fetch deployments:', error)
      toast.error('Failed to fetch deployments')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDeployments()
  }, [])

  const handleDeploymentCreated = async () => {
    await fetchDeployments()
  }

  const handleDeleteDeployment = async (deploymentId) => {
    try {
      setDeletingId(deploymentId)
      const token = localStorage.getItem("token")
      await axiosInstance.delete(
        `/deploy/${deploymentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Deployment deleted successfully')
      setDeployments(prev => prev.filter(d => d.id !== deploymentId))
    } catch (error) {
      console.error('Failed to delete deployment:', error)
      toast.error('Failed to delete deployment')
    } finally {
      setDeletingId(null)
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDeploymentIcon = (type) => {
    const iconClass = `h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`
    switch (type?.toLowerCase()) {
      case 'wordpress': return <Globe className={iconClass} />
      case 'magento': return <ShoppingCart className={`h-5 w-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
      default: return <Server className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="large" />
      </div>
    )
  }

  return (
    <div className="relative">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={isDarkMode ? 'dark' : 'light'}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Deployment Instances
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your WordPress and Magento deployments
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center px-4 py-2.5 rounded-lg gap-2 transition-all
            ${isDarkMode
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/50'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
            } text-white shadow-sm hover:shadow-md`}
        >
          <Plus size={18} />
          <span>Create Deployment</span>
        </button>
      </div>

      {/* Stats */}
      {deployments.length > 0 && (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-5 rounded-xl border ${
          isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`p-3 rounded-lg text-center ${
            isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {deployments.length}
            </div>
            <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Deployments
            </div>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
          }`}>
            <div className="text-3xl font-bold text-green-500 mb-1">
              {deployments.filter(d => d.status === 'completed').length}
            </div>
            <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              Active
            </div>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'
          }`}>
            <div className="text-3xl font-bold text-amber-500 mb-1">
              {deployments.filter(d => ['in-progress', 'initiated'].includes(d.status)).length}
            </div>
            <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              In Progress
            </div>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <div className="text-3xl font-bold text-red-500 mb-1">
              {deployments.filter(d => d.status === 'failed').length}
            </div>
            <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              Failed
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {deployments.length === 0 ? (
        <div className={`text-center py-16 rounded-xl border-2 border-dashed transition-all ${
          isDarkMode ? 'border-slate-700 bg-slate-800/30 hover:border-slate-600' 
          : 'border-slate-300 bg-slate-50/50 hover:border-slate-400'
        }`}>
          <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full mb-4 mx-auto ${
            isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-slate-100 text-slate-400'
          }`}>
            <Box className="h-8 w-8" />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            No deployments found
          </h3>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Get started by creating your first deployment
          </p>
          <button
            onClick={() => setShowModal(true)}
            className={`flex items-center px-6 py-3 rounded-lg gap-2 mx-auto transition-all
              ${isDarkMode
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/50'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
              } text-white shadow-sm hover:shadow-md`}
          >
            <Plus size={18} />
            <span>Create Your First Deployment</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deployments.map((deployment) => (
            <DeploymentCard
              key={deployment.id}
              deployment={deployment}
              isDarkMode={isDarkMode}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              formatDate={formatDate}
              getDeploymentIcon={getDeploymentIcon}
              onDelete={handleDeleteDeployment}
              isDeleting={deletingId === deployment.id}
            />
          ))}
        </div>
      )}

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