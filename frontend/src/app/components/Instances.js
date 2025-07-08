"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Globe, Server, Plus, ShoppingCart, Box, Zap, AlertTriangle
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
  const [error, setError] = useState(null)

  const authData = useMemo(() => {
    const token = localStorage.getItem("token")
    const uid = localStorage.getItem("uid")
    return { token, uid }
  }, [])

  const fetchDeployments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!authData.token || !authData.uid) {
        throw new Error('Authentication required')
      }

      const response = await axiosInstance.get(
        `/deploy/user/${authData.uid}`,
        { headers: { Authorization: `Bearer ${authData.token}` } }
      )

      setDeployments(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch deployments:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch deployments'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [authData.token, authData.uid])

  useEffect(() => {
    fetchDeployments()
  }, [fetchDeployments])

  // const handleDeploymentCreated = useCallback((newDeployment) => {
  //   if (newDeployment) {
  //     setDeployments(prev => [...prev, newDeployment])
  //   }
  // }, [])
  const handleDeploymentCreated = useCallback((newDeployment) => {
  setShowModal(false);
  fetchDeployments(); // Always refetch to get the latest state from backend
}, [fetchDeployments]);

  const handleDeleteDeployment = useCallback(async (deploymentId) => {
    try {
      setDeletingId(deploymentId)

      if (!authData.token) {
        throw new Error('Authentication required')
      }

      await axiosInstance.delete(
        `/deploy/${deploymentId}`,
        { headers: { Authorization: `Bearer ${authData.token}` } }
      )

      setDeployments(prev => prev.filter(d => d.id !== deploymentId))
      toast.success('Deployment deleted successfully')

    } catch (error) {
      console.error('Failed to delete deployment:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete deployment'
      toast.error(errorMessage)
    } finally {
      setDeletingId(null)
    }
  }, [authData.token])

  const getStatusColor = useCallback((status) => {
    const colors = {
      'completed': 'bg-green-500',
      'failed': 'bg-red-500',
      'in-progress': 'bg-amber-500',
      'initiated': 'bg-blue-500',
      'rolled-back': 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }, [])

  const getStatusText = useCallback((status) => {
    const textColors = {
      'completed': isDarkMode ? 'text-green-300' : 'text-green-700',
      'failed': isDarkMode ? 'text-red-300' : 'text-red-700',
      'in-progress': isDarkMode ? 'text-amber-300' : 'text-amber-700',
      'initiated': isDarkMode ? 'text-blue-300' : 'text-blue-700',
      'rolled-back': isDarkMode ? 'text-red-300' : 'text-red-700'
    }
    return textColors[status] || 'text-gray-500'
  }, [isDarkMode])

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  const deploymentStats = useMemo(() => {
    const total = deployments.length
    const completed = deployments.filter(d => d.status === 'completed').length
    const inProgress = deployments.filter(d => ['in-progress', 'initiated'].includes(d.status)).length
    const failed = deployments.filter(d => d.status === 'failed').length

    return { total, completed, inProgress, failed }
  }, [deployments])

  const handleOpenModal = useCallback(() => setShowModal(true), [])
  const handleCloseModal = useCallback(() => setShowModal(false), [])

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
          onClick={handleOpenModal}
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

      {deployments.length > 0 && (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-5 rounded-xl border ${
          isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`p-3 rounded-lg text-center ${
            isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {deploymentStats.total}
            </div>
            <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Deployments
            </div>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
          }`}>
            <div className="text-3xl font-bold text-green-500 mb-1">
              {deploymentStats.completed}
            </div>
            <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              Active
            </div>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'
          }`}>
            <div className="text-3xl font-bold text-amber-500 mb-1">
              {deploymentStats.inProgress}
            </div>
            <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              In Progress
            </div>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <div className="text-3xl font-bold text-red-500 mb-1">
              {deploymentStats.failed}
            </div>
            <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              Failed
            </div>
          </div>
        </div>
      )}

      {(deployments.length === 0) ? (
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
            onClick={handleOpenModal}
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
              onDelete={handleDeleteDeployment}
              isDeleting={deletingId === deployment.id}
            />
          ))}
        </div>
      )}

      <CreateDeploymentModal

        showModal={showModal}
        setShowModal={handleCloseModal}
        isDarkMode={isDarkMode}
        onDeploymentCreated={handleDeploymentCreated}
      />
    </div>
  )
}

export default Instances
