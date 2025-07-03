"use client"

import React, { useState } from 'react'
import { 
  Globe, ShoppingCart, X, Server, Loader, 
  Check, Star, Zap, Building, Sparkles, Shield, Clock
} from 'lucide-react'
import axiosInstance from '@/utils/axiosInstance'
import { toast } from 'react-toastify'

const CreateDeploymentModal = ({ 
  showModal = true, 
  setShowModal = () => {}, 
  isDarkMode = false, 
  onDeploymentCreated = () => {} 
}) => {
  const [newDeployment, setNewDeployment] = useState({
    deploymentName: '',
    deploymentType: 'wordpress',
    backupType: 'weekly',
    plan: 'express'
  })
  const [deploymentLoading, setDeploymentLoading] = useState(false)

  const plans = [
    {
      id: 'lite',
      name: 'Lite',
      price: '₹ 499',
      period: '/month',
      icon: <Star className="h-5 w-5" />,
      gradient: 'from-slate-500 to-slate-600',
      features: [
        '1 vcpu (Shared) / 2GB RAM',
        '10 GB Storage',
        '1 Free SSL Certificate',
        'Free Weekly Backup',
        'Basic Support',
      ],
      popular: false,
      description: 'For personal projects'
    },
    {
      id: 'express',
      name: 'Express',
      price: '₹ 999',
      period: '/month',
      icon: <Zap className="h-5 w-5" />,
      gradient: 'from-indigo-500 to-purple-600',
      features: [
        '1 Dedicated Core',
        '2 GB RAM',
        '1 Free SSL Certificate',
        '20 GB Storage',
        'Priority Support',
      ],
      popular: true,
      description: 'Most popular'
    },
    {
      id: 'business',
      name: 'Business',
      price: '₹ 1499',
      period: '/month',
      icon: <Building className="h-5 w-5" />,
      gradient: 'from-emerald-500 to-teal-600',
      features: [
        '2 Dedicated Core',
        '6 GB RAM',
        '80 GB Storage',
        '1 Free SSL Certificate',
        'Priority Support',
      ],
      popular: false,
      description: 'For teams'
    }
  ]

  const handleCreateDeployment = async () => {
    if (!newDeployment.deploymentName.trim()) {
      toast.error("Please enter a deployment name", {
        theme: isDarkMode ? 'dark' : 'light'
      })
      return
    }

    try {
      setDeploymentLoading(true)
      const token = localStorage.getItem("token")
      
      // Show loading toast
      const toastId = toast.info("WordPress Deployment in progress... Please check back after a few minutes", {
        autoClose: false,
        theme: isDarkMode ? 'dark' : 'light'
      })

      await axiosInstance.post(
        "/deploy",
        {
          deploymentName: newDeployment.deploymentName,
          deploymentType: newDeployment.deploymentType,
          backupType: newDeployment.backupType,
          plan: newDeployment.plan
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // Close the modal
      setShowModal(false)
      
      // Reset form
      setNewDeployment({
        deploymentName: '',
        deploymentType: 'wordpress',
        backupType: 'weekly',
        plan: 'express'
      })

      // Dismiss the loading toast
      toast.dismiss(toastId)
      
      // Show success toast
      toast.success("Deployment started successfully!", {
        theme: isDarkMode ? 'dark' : 'light'
      })

      // Notify parent component
      onDeploymentCreated()

    } catch (error) {
      console.error("Failed to create deployment", error)
      toast.error("Failed to create deployment", {
        theme: isDarkMode ? 'dark' : 'light'
      })
    } finally {
      setDeploymentLoading(false)
    }
  }

  const getPlanPrice = (planId) => {
    const priceMap = { lite: 499, express: 999, business: 1499 }
    return priceMap[planId] || 499
  }

  const getTotalPrice = () => {
    const basePrice = getPlanPrice(newDeployment.plan)
    const backupPrice = newDeployment.backupType === 'daily' ? 50 : 0
    return basePrice + backupPrice
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md transition-all duration-300"
          onClick={() => setShowModal(false)}
        />
        
        {/* Main modal */}
        <div className={`relative rounded-2xl shadow-2xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50' 
            : 'bg-gradient-to-br from-white via-slate-50 to-white border border-slate-200/50'
        } p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300`}>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500'
              } shadow-lg`}>
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${
                  isDarkMode ? 'from-white to-slate-300' : 'from-slate-800 to-slate-600'
                } bg-clip-text text-transparent`}>
                  New Deployment
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Get started in minutes
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className={`p-2 rounded-xl transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'hover:bg-slate-700/50 text-slate-400 hover:text-white' 
                  : 'hover:bg-slate-100/50 text-slate-500 hover:text-slate-700'
              }`}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-8">
            {/* Deployment Name Input */}
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Name
              </label>
              <input
                type="text"
                value={newDeployment.deploymentName}
                onChange={(e) => setNewDeployment({...newDeployment, deploymentName: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:bg-slate-800' 
                    : 'bg-white/50 border-slate-300 text-slate-800 placeholder-slate-500 focus:border-indigo-500 focus:bg-white'
                } focus:outline-none focus:ring-4 focus:ring-indigo-500/20 backdrop-blur-sm`}
                placeholder="my-website"
              />
            </div>
            
            {/* Deployment Type */}
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`group relative p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 hover:scale-[1.02] ${
                    newDeployment.deploymentType === 'wordpress' 
                      ? isDarkMode 
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-900/50 to-purple-900/30 shadow-lg shadow-indigo-500/20' 
                        : 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg shadow-indigo-500/20' 
                      : isDarkMode 
                        ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600' 
                        : 'border-slate-200 bg-white/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                  onClick={() => setNewDeployment({...newDeployment, deploymentType: 'wordpress'})}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-all ${
                      newDeployment.deploymentType === 'wordpress' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg' 
                        : isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                    }`}>
                      <Globe className={`h-5 w-5 ${
                        newDeployment.deploymentType === 'wordpress' 
                          ? 'text-white' 
                          : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                    </div>
                    <div>
                      <span className={`font-semibold ${
                        newDeployment.deploymentType === 'wordpress' 
                          ? isDarkMode ? 'text-white' : 'text-slate-800' 
                          : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        WordPress
                      </span>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        CMS
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`relative p-4 rounded-xl cursor-not-allowed opacity-60 border-2 ${
                  isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <ShoppingCart className={`h-5 w-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <span className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Magento
                      </span>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Backup Options */}
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Backup
              </label>
              <div className="space-y-3">
                <label className={`group flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                  newDeployment.backupType === 'weekly'
                    ? isDarkMode 
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-900/50 to-green-900/30 shadow-lg shadow-emerald-500/20' 
                      : 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg shadow-emerald-500/20'
                    : isDarkMode 
                      ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600' 
                      : 'border-slate-200 bg-white/50 hover:bg-slate-50 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="backupType"
                    value="weekly"
                    checked={newDeployment.backupType === 'weekly'}
                    onChange={(e) => setNewDeployment({...newDeployment, backupType: e.target.value})}
                    className="sr-only"
                  />
                  <div className="flex items-center flex-1 space-x-4">
                    <div className={`p-2 rounded-lg transition-all ${
                      newDeployment.backupType === 'weekly'
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg'
                        : isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                    }`}>
                      <Shield className={`h-5 w-5 ${
                        newDeployment.backupType === 'weekly' ? 'text-white' : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        Weekly
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Automated weekly backups
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isDarkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      FREE
                    </div>
                  </div>
                </label>

                <label className={`group flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                  newDeployment.backupType === 'daily'
                    ? isDarkMode 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-900/50 to-indigo-900/30 shadow-lg shadow-blue-500/20' 
                      : 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/20'
                    : isDarkMode 
                      ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600' 
                      : 'border-slate-200 bg-white/50 hover:bg-slate-50 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="backupType"
                    value="daily"
                    checked={newDeployment.backupType === 'daily'}
                    onChange={(e) => setNewDeployment({...newDeployment, backupType: e.target.value})}
                    className="sr-only"
                  />
                  <div className="flex items-center flex-1 space-x-4">
                    <div className={`p-2 rounded-lg transition-all ${
                      newDeployment.backupType === 'daily'
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg'
                        : isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                    }`}>
                      <Clock className={`h-5 w-5 ${
                        newDeployment.backupType === 'daily' ? 'text-white' : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        Daily
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Daily backups with instant recovery
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      ₹ 50/mo
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="space-y-6">
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Plan
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      newDeployment.plan === plan.id
                        ? isDarkMode 
                          ? 'border-indigo-500 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl shadow-indigo-500/25' 
                          : 'border-indigo-500 bg-gradient-to-br from-white to-slate-50 shadow-2xl shadow-indigo-500/25'
                        : isDarkMode 
                          ? 'border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:border-slate-600 hover:shadow-xl' 
                          : 'border-slate-200 bg-gradient-to-br from-white/50 to-slate-50/50 hover:border-slate-300 hover:shadow-xl'
                    } ${plan.popular ? 'ring-2 ring-indigo-500 ring-opacity-30' : ''}`}
                    onClick={() => setNewDeployment({...newDeployment, plan: plan.id})}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className={`px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${plan.gradient} text-white shadow-lg animate-pulse`}>
                          Popular
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        {plan.icon}
                      </div>
                      {newDeployment.plan === plan.id && (
                        <div className={`p-1 rounded-full ${isDarkMode ? 'bg-indigo-500' : 'bg-indigo-500'}`}>
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {plan.name}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        {plan.description}
                      </p>
                      <div className="flex items-baseline">
                        <span className={`text-3xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                          {plan.price}
                        </span>
                        <span className={`text-sm ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {plan.period}
                        </span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className={`flex items-center text-sm ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          <div className={`p-1 rounded-full mr-3 ${
                            newDeployment.plan === plan.id
                              ? `bg-gradient-to-r ${plan.gradient}`
                              : isDarkMode ? 'bg-slate-600' : 'bg-slate-200'
                          }`}>
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Cost Summary */}
            <div className={`p-6 rounded-2xl border-2 ${
              isDarkMode 
                ? 'border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 shadow-xl' 
                : 'border-slate-200 bg-gradient-to-br from-white/50 to-slate-50/50 shadow-xl'
            } backdrop-blur-sm`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Total:
                </span>
                <div className="text-right">
                  <span className={`text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent`}>
                    ₹{getTotalPrice()}
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    /month
                  </span>
                </div>
              </div>
              {newDeployment.backupType === 'daily' && (
                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} flex items-center`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
                  Plan ₹{getPlanPrice(newDeployment.plan)} + Backup ₹50
                </div>
              )}
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setShowModal(false)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateDeployment}
              disabled={deploymentLoading}
              className={`px-8 py-3 rounded-xl font-bold flex items-center transition-all duration-200 hover:scale-105 shadow-lg ${
                isDarkMode
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/25'
              } ${deploymentLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl'}`}
            >
              {deploymentLoading ? (
                <>
                  <Loader className="animate-spin mr-3 h-5 w-5" />
                  Deploying...
                </>
              ) : (
                <>
                  <Server className="mr-3 h-5 w-5" />
                  Deploy (₹{getTotalPrice()}/mo)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateDeploymentModal