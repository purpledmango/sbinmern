  "use client"

  import React, { use, useEffect, useState } from 'react'
  import { Usdeploymentsers, Server, FileText, Globe, Wrench, ExternalLink, ArrowUpRight, Shield, BarChart3, Clock, HardDrive } from 'lucide-react'
  import axiosInstance from '@/utils/axiosInstance'
  import Spinner from "./Spinner.js"
import Link from 'next/link'
import DeploymentCard from './DeploymenCard'
import toast from 'react-hot-toast'

  const Overview = ({ isDarkMode = false }) => {
    localStorage.setItem("currentPage", "overview");
    // Fixed state management with useState hook
    const [deploymentStats, setDeploymentStats] = useState({
      totalDeployments: 0,
      liveWebsites: 0,
      pendingInvoices: 0,
      maintenanceMode: 0
    });
    
    // Added loading state
    const [loading, setLoading] = useState(true);
    
    // Added state for deployments from API
    const [deployments, setDeployments] = useState([
      
    ]);
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {   fetchDeployments(); }, []);
    
    const handleDeleteDeployment = (async (deploymentId) => {
      const token = localStorage.getItem("token")
        try {
          setDeletingId(deploymentId)
    
         
    
          await axiosInstance.delete(
            `/deploy/${deploymentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
    
          toast.success('Deployment deleted successfully')
          fetchDeployments();
    
        } catch (error) {
          console.error('Failed to delete deployment:', error)
          const errorMessage = error.response?.data?.message || error.message || 'Failed to delete deployment'
          toast.error(errorMessage)
        } finally {
          setDeletingId(null)
        }
      })

    const fetchDeployments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const uid = localStorage.getItem("uid");
        
        // Add cache-busting and ensure fresh data
        const response = await axiosInstance.get(`/deploy/user/${uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
  
          
        }});
    
        console.log("Deployment data:", response.data);
        
        // Set deployment stats
        setDeploymentStats(prev => ({
          ...prev,
          totalDeployments: response.data.count,
          // You would need to set these from API data as well
          liveWebsites: response.data.liveCount || 0,
          pendingInvoices: response.data.invoiceCount || 0,
          maintenanceMode: response.data.maintenanceCount || 0
        }));
        
        // Set deployments from response if available
        if (response.data.data && Array.isArray(response.data.data)) {
          setDeployments(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch deployments:", error);
        
        // Handle specific error cases
        if (error.response) {
          // Server responded with error status
          if (error.response.status === 401) {
            // Handle unauthorized (token expired)
            localStorage.removeItem("token");
            // Need to import router
            // router.push('/login');
          } else if (error.response.status === 304) {
            // Force refresh if server returns 304
            return fetchDeployments();
          }
        } else if (error.request) {
          // Request was made but no response
          console.error("No response received:", error.request);
        } else {
          // Other errors
          console.error("Request setup error:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    const StatCard = ({ value, label, icon: Icon, color = 'indigo' }) => {
      const colors = {
        indigo: {
          bg: isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50/80',
          text: isDarkMode ? 'text-indigo-300' : 'text-indigo-600',
          border: isDarkMode ? 'border-indigo-800/50' : 'border-indigo-100',
          shadow: isDarkMode ? 'shadow-indigo-900/10' : 'shadow-indigo-200/50'
        },
        emerald: {
          bg: isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-50/80',
          text: isDarkMode ? 'text-emerald-300' : 'text-emerald-600',
          border: isDarkMode ? 'border-emerald-800/50' : 'border-emerald-100',
          shadow: isDarkMode ? 'shadow-emerald-900/10' : 'shadow-emerald-200/50'
        },
        amber: {
          bg: isDarkMode ? 'bg-amber-900/30' : 'bg-amber-50/80',
          text: isDarkMode ? 'text-amber-300' : 'text-amber-600',
          border: isDarkMode ? 'border-amber-800/50' : 'border-amber-100',
          shadow: isDarkMode ? 'shadow-amber-900/10' : 'shadow-amber-200/50'
        },
        rose: {
          bg: isDarkMode ? 'bg-rose-900/30' : 'bg-rose-50/80',
          text: isDarkMode ? 'text-rose-300' : 'text-rose-600',
          border: isDarkMode ? 'border-rose-800/50' : 'border-rose-100',
          shadow: isDarkMode ? 'shadow-rose-900/10' : 'shadow-rose-200/50'
        }
      }

      return (
        <div 
          className={`p-6 rounded-xl border ${colors[color].border} ${colors[color].bg} ${colors[color].shadow} backdrop-blur-sm transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {label}
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {loading ? <Spinner /> : value}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${colors[color].bg} ${colors[color].text} ring-1 ring-inset ${isDarkMode ? 'ring-white/10' : 'ring-black/5'}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      )
    }

  

    const ChartPlaceholder = () => (
      <div className={`h-64 rounded-lg ${
        isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50/70'
      } flex flex-col items-center justify-center`}>
        <BarChart3 className={`h-12 w-12 mb-2 ${
          isDarkMode ? 'text-slate-600' : 'text-slate-300'
        }`} />
        <p className={`text-sm ${
          isDarkMode ? 'text-slate-500' : 'text-slate-400'
        }`}>Deployment Statistics Chart</p>
      </div>
    )

    return (
      <div>
        {/* Deployment Stats */}
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

        {/* Active Deployments */}
        <div className={`rounded-xl p-6 ${
          isDarkMode 
            ? 'bg-slate-800/80 border border-slate-700 shadow-lg shadow-slate-900/20' 
            : 'bg-white/80 border border-slate-200 shadow-lg shadow-slate-200/20'
        } backdrop-blur-sm mb-6`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Shield className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Active Deployments
              </h3>
            </div>
            <button className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
              isDarkMode 
                ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30' 
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            } transition-colors`}>
              View All
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            {deployments.reverse().slice(0, 3).map((deployment, index) => (
              <DeploymentCard
              key={deployment.deploymentId}
              deployment={deployment}
              isDarkMode={isDarkMode}
             
              onDelete={handleDeleteDeployment}
              isDeleting={deletingId === deployment.id}
            />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`rounded-xl p-6 ${
  isDarkMode 
    ? 'bg-slate-800/80 border border-slate-700 shadow-lg shadow-slate-900/20' 
    : 'bg-white/80 border border-slate-200 shadow-lg shadow-slate-200/20'
} backdrop-blur-sm relative z-[100]`}> 
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Recent Backups Data */}
            <div className={`rounded-xl shadow-sm p-6 border ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center mb-4 md:mb-0">
                <div className={`p-2 rounded-lg mr-3 ${
                  isDarkMode 
                    ? 'bg-emerald-900/30 text-emerald-400' 
                    : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <HardDrive className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Recent Backups
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Last 7 days activity
                  </p>
                </div>
              </div>
              <div className="space-y-4 mt-4">
                {[
                  {
                    id: 1,
                    name: 'Database Backup',
                    date: '2 hours ago',
                    size: '2.4 GB',
                    type: 'Auto',
                    status: 'success'
                  },
                  {
                    id: 2,
                    name: 'System Snapshot',
                    date: 'Yesterday',
                    size: '5.1 GB',
                    type: 'Manual',
                    status: 'success'
                  },
                  {
                    id: 3,
                    name: 'Config Files',
                    date: '3 days ago',
                    size: '156 MB',
                    type: 'Auto',
                    status: 'warning'
                  }
                ].map(backup => (
                  <div key={backup.id} className={`flex justify-between items-center p-3 rounded-lg ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'}`}>
                    <div className="flex items-center">
                    
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          {backup.name}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {backup.date} • {backup.size}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {backup.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Invoices Data */}
            <div className={`rounded-xl shadow-sm p-6 border ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg mr-3 ${
                  isDarkMode 
                    ? 'bg-amber-900/30 text-amber-400' 
                    : 'bg-amber-100 text-amber-600'
                }`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Pending Invoices
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Requires attention
                  </p>
                </div>
              </div>
              {/* <div className="space-y-4">
                {[
                  {
                    id: 1,
                    number: 'INV-2023-045',
                    client: 'Acme Corp',
                    dueDate: 'in 5 days',
                    amount: '$1,250.00',
                    status: 'pending'
                  },
                  
                ].map(invoice => (
                  <div key={invoice.id} className={`flex justify-between items-center p-3 rounded-lg ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'}`}>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        #{invoice.number} • {invoice.client}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Due {invoice.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {invoice.amount}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        invoice.status === 'overdue' ? 
                          isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-800' :
                          isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
          
          <ChartPlaceholder />
        </div>
      </div>
    )
  }

  export default Overview