"use client"

import React from 'react'
import { Users, Server, FileText, Globe, Wrench, ExternalLink, ArrowUpRight, Shield, BarChart3, Clock, HardDrive } from 'lucide-react'
import { motion } from 'framer-motion'

const Overview = ({ isDarkMode = false }) => {
  // Sample deployment data
  const deploymentStats = {
    totalDeployments: 24,
    liveWebsites: 18,
    pendingInvoices: 3,
    maintenanceMode: 2
  }

  const deployments = [
    {
      id: 1,
      name: 'E-Commerce Store',
      type: 'Magento',
      status: 'online',
      url: 'https://store.example.com',
      lastUpdated: '2 hours ago',
      uptime: '99.8%',
      visitors: '1.2k today'
    },
    {
      id: 2,
      name: 'Corporate Blog',
      type: 'WordPress',
      status: 'online',
      url: 'https://blog.example.com',
      lastUpdated: '1 day ago',
      uptime: '99.9%',
      visitors: '843 today'
    },
    {
      id: 3,
      name: 'Client Portal',
      type: 'Custom',
      status: 'maintenance',
      url: 'https://portal.example.com',
      lastUpdated: '3 days ago',
      uptime: '97.2%',
      visitors: '214 today'
    }
  ]

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
      <motion.div 
        whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
        className={`p-6 rounded-xl border ${colors[color].border} ${colors[color].bg} ${colors[color].shadow} backdrop-blur-sm transition-all duration-300`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {label}
            </p>
            <h3 className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {value}
            </h3>
          </div>
          <div className={`p-3 rounded-lg ${colors[color].bg} ${colors[color].text} ring-1 ring-inset ${isDarkMode ? 'ring-white/10' : 'ring-black/5'}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </motion.div>
    )
  }

  const DeploymentCard = ({ deployment }) => {
    const statusColors = {
      online: isDarkMode ? 'bg-emerald-900/40 text-emerald-300 ring-emerald-800' : 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      offline: isDarkMode ? 'bg-rose-900/40 text-rose-300 ring-rose-800' : 'bg-rose-50 text-rose-700 ring-rose-200',
      maintenance: isDarkMode ? 'bg-amber-900/40 text-amber-300 ring-amber-800' : 'bg-amber-50 text-amber-700 ring-amber-200'
    }

    const platformColors = {
      WordPress: isDarkMode ? 'bg-blue-900/40 text-blue-300 ring-blue-800' : 'bg-blue-50 text-blue-700 ring-blue-200',
      Magento: isDarkMode ? 'bg-orange-900/40 text-orange-300 ring-orange-800' : 'bg-orange-50 text-orange-700 ring-orange-200',
      Custom: isDarkMode ? 'bg-purple-900/40 text-purple-300 ring-purple-800' : 'bg-purple-50 text-purple-700 ring-purple-200'
    }

    return (
      <motion.div 
        whileHover={{ y: -4, boxShadow: '0 12px 20px -5px rgba(0, 0, 0, 0.15)' }}
        className={`rounded-xl ${
          isDarkMode 
            ? 'bg-slate-800/70 border border-slate-700 shadow-lg shadow-slate-900/30' 
            : 'bg-white/70 border border-slate-200 shadow-md shadow-slate-200/50'
        } backdrop-blur-sm p-5 transition-all duration-300`}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {deployment.name}
          </h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ring-inset ${platformColors[deployment.type] || 'bg-gray-100 text-gray-800'}`}>
            {deployment.type}
          </span>
        </div>

        <div className="flex items-center mb-4">
            <div>
            <span className= {` w-2 h-2 bg-${deployment.status === "online"? "green-400" : "red-400"}`}></span><span className='capitalize text-xs'>{deployment.status}</span>
            </div>
           
          
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} flex items-center`}>
            <Clock className="h-3 w-3 mr-1 inline" />
            {deployment.lastUpdated}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className={`px-3 py-2 rounded-lg ${
            isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Uptime</div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
              {deployment.uptime}
            </div>
          </div>
          <div className={`px-3 py-2 rounded-lg ${
            isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Traffic</div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
              {deployment.visitors}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <a 
            href={deployment.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-sm font-medium ${
              isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
            } flex items-center transition-colors`}
          >
            <ArrowUpRight className="h-4 w-4 mr-1" />
            Visit Site
          </a>
          <button className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
            isDarkMode 
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          } flex items-center transition-colors`}>
            <Wrench className="h-4 w-4 mr-1.5" />
            Manage
          </button>
        </div>
      </motion.div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          value={deploymentStats.totalDeployments} 
          label="Total Deployments" 
          icon={Server} 
          color="indigo" 
        />
        <StatCard 
          value={deploymentStats.liveWebsites} 
          label="Live Websites" 
          icon={Globe} 
          color="emerald" 
        />
        <StatCard 
          value={deploymentStats.pendingInvoices} 
          label="Pending Invoices" 
          icon={FileText} 
          color="amber" 
        />
        <StatCard 
          value={deploymentStats.maintenanceMode} 
          label="In Maintenance" 
          icon={Wrench} 
          color="rose" 
        />
      </div>

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deployments.map(deployment => (
            <DeploymentCard key={deployment.id} deployment={deployment} />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className={`rounded-xl p-6 ${
        isDarkMode 
          ? 'bg-slate-800/80 border border-slate-700 shadow-lg shadow-slate-900/20' 
          : 'bg-white/80 border border-slate-200 shadow-lg shadow-slate-200/20'
      } backdrop-blur-sm`}>
       

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
    <div className="space-y-4">
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
        <div key={backup.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50">
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
  <div className="flex items-center">
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
    <div className="space-y-4">
      {[
        {
          id: 1,
          number: 'INV-2023-045',
          client: 'Acme Corp',
          dueDate: 'in 5 days',
          amount: '$1,250.00',
          status: 'pending'
        },
        {
          id: 2,
          number: 'INV-2023-044',
          client: 'Globex Inc',
          dueDate: 'yesterday',
          amount: '$3,420.50',
          status: 'overdue'
        },
        {
          id: 3,
          number: 'INV-2023-043',
          client: 'Contoso Ltd',
          dueDate: 'in 2 days',
          amount: '$890.00',
          status: 'pending'
        }
      ].map(invoice => (
        <div key={invoice.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50">
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
              invoice.status === 'overdue' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' :
              'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
            }`}>
              {invoice.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
        
        <ChartPlaceholder />
      </div>
    </div>
  )
}

export default Overview