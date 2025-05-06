"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { 
  HardDrive, Server, Calendar, Plus, X, 
  Cpu, Network, ArrowUpRight, Loader,
  CheckCircle2, AlertCircle, Wifi, Power
} from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axiosInstance from "../../utils/axiosInstance.js"
import Spinner from "./Spinner.js"

const InfraManagement = ({ isDarkMode = false }) => {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newMachine, setNewMachine] = useState({
    machineName: '',
    machineType: 'dedicated',
    ipAddress: '',
    cpuCores: 4,
    memoryGB: 8,
    diskGB: 100
  })
  const [addingMachine, setAddingMachine] = useState(false)

  // Fetch machines data
  const fetchMachines = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axiosInstance.get("/infra/all/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { _: Date.now() }
      })
      
      if (response.data) {
        setMachines(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch machines:", error)
      toast.error("Failed to fetch infrastructure data", {
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
    fetchMachines();
  }, [fetchMachines])

  const handleAddMachine = async () => {
    // Validate form
    if (!newMachine.machineName.trim()) {
      toast.warning("Please enter a machine name", {
        theme: isDarkMode ? 'dark' : 'light'
      })
      return
    }
    
    if (!newMachine.ipAddress.trim()) {
      toast.warning("Please enter an IP address", {
        theme: isDarkMode ? 'dark' : 'light'
      })
      return
    }
    
    try {
      setAddingMachine(true)
      const token = localStorage.getItem("token")
      await axiosInstance.post('/infra/machines', newMachine, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success("Machine added successfully", {
        theme: isDarkMode ? 'dark' : 'light'
      })
      
      setShowModal(false)
      setNewMachine({
        machineName: '',
        machineType: 'dedicated',
        ipAddress: '',
        cpuCores: 4,
        memoryGB: 8,
        diskGB: 100
      })
      await fetchMachines()
    } catch (error) {
      toast.error(`Failed to add machine: ${error.response?.data?.message || error.message}`, {
        theme: isDarkMode ? 'dark' : 'light'
      })
      console.error(error)
    } finally {
      setAddingMachine(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'online': 'bg-green-500',
      'offline': 'bg-red-500',
      'maintenance': 'bg-amber-500',
      'provisioning': 'bg-blue-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getMachineTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'dedicated': return <Server className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      case 'virtual': return <Cpu className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
      case 'cloud': return <Wifi className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
      default: return <HardDrive className={`h-5 w-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
    }
  }

  const renderMachineCard = (machine) => {
    const statusColor = getStatusColor(machine.status);
    
    return (
      <div className={`rounded-xl overflow-hidden border shadow-sm ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              {getMachineTypeIcon(machine.machineType)}
              <h3 className={`ml-2 font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {machine.machineName}
              </h3>
            </div>
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(machine.status)}`}></span>
              <span className={`text-sm capitalize ${
                machine.status === 'online' 
                  ? isDarkMode ? 'text-green-400' : 'text-green-600'
                  : machine.status === 'offline'
                  ? isDarkMode ? 'text-red-400' : 'text-red-600'
                  : isDarkMode ? 'text-amber-400' : 'text-amber-600'
              }`}>
                {machine.status}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Network className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                {machine.ipAddress}
              </span>
            </div>
            
            <div className="flex items-center text-sm">
              <Cpu className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                {machine.cpuCores} Cores, {machine.memoryGB} GB RAM
              </span>
            </div>
            
            <div className="flex items-center text-sm">
              <HardDrive className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                {machine.diskGB} GB Storage
              </span>
            </div>
            
            <div className="flex items-center text-sm">
              <Calendar className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                Added on {formatDate(machine.addedDate)}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`px-5 py-3 flex justify-between items-center ${
          isDarkMode ? 'bg-slate-700/50 border-t border-slate-700' : 'bg-slate-50 border-t border-slate-100'
        }`}>
          <div className="flex">
            <button className={`mr-2 px-3 py-1 rounded-lg text-xs font-medium ${
              isDarkMode 
                ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' 
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            } transition-colors`}>
              Details
            </button>
            <button className={`px-3 py-1 rounded-lg text-xs font-medium ${
              machine.status === 'online'
                ? isDarkMode 
                  ? 'bg-red-900/30 text-red-300 hover:bg-red-800/50' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                : isDarkMode 
                  ? 'bg-green-900/30 text-green-300 hover:bg-green-800/50' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
            } transition-colors`}>
              {machine.status === 'online' ? (
                <><Power className="h-3 w-3 mr-1 inline" /> Power Off</>
              ) : (
                <><Power className="h-3 w-3 mr-1 inline" /> Power On</>
              )}
            </button>
          </div>
          <div className="text-xs">
            <span className={`px-2 py-1 rounded-md ${
              isDarkMode 
                ? 'bg-slate-600 text-slate-300' 
                : 'bg-slate-200 text-slate-700'
            }`}>
              {machine.region || 'us-east'}
            </span>
          </div>
        </div>
      </div>
    )
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
          Infrastructure Management
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
          Add Machine
        </button>
      </div>

      {/* Machine List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="large" />
        </div>
      ) : machines.length === 0 ? (
        <div className={`text-center py-16 rounded-xl border ${
          isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
        }`}>
          <Server className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            No machines found
          </h3>
          <p className={`max-w-sm mx-auto mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            You haven't added any infrastructure machines yet. Add your first machine to get started.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className={`inline-flex items-center px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            } transition-colors duration-200`}
          >
            <Plus size={18} className="mr-2" />
            Add Machine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine, index) => (
            <div key={index}>
              {renderMachineCard(machine)}
            </div>
          ))}
        </div>
      )}

      {/* Add Machine Modal */}
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
                  Add New Machine
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
                    Machine Name
                  </label>
                  <input
                    type="text"
                    value={newMachine.machineName}
                    onChange={(e) => setNewMachine({...newMachine, machineName: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-800'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                    placeholder="production-server-01"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Machine Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div 
                      className={`flex items-center p-3 rounded-lg cursor-pointer border-2 ${
                        newMachine.machineType === 'dedicated' 
                          ? isDarkMode 
                            ? 'border-indigo-500 bg-indigo-900/30' 
                            : 'border-indigo-500 bg-indigo-50' 
                          : isDarkMode 
                            ? 'border-slate-700 bg-slate-800 hover:bg-slate-700/50' 
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                      onClick={() => setNewMachine({...newMachine, machineType: 'dedicated'})}
                    >
                      <Server className={`h-5 w-5 mr-2 ${
                        newMachine.machineType === 'dedicated' 
                          ? isDarkMode ? 'text-indigo-400' : 'text-indigo-600' 
                          : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        newMachine.machineType === 'dedicated' 
                          ? isDarkMode ? 'text-indigo-300' : 'text-indigo-600' 
                          : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Dedicated
                      </span>
                    </div>
                    
                    <div 
                      className={`flex items-center p-3 rounded-lg cursor-pointer border-2 ${
                        newMachine.machineType === 'virtual' 
                          ? isDarkMode 
                            ? 'border-indigo-500 bg-indigo-900/30' 
                            : 'border-indigo-500 bg-indigo-50' 
                          : isDarkMode 
                            ? 'border-slate-700 bg-slate-800 hover:bg-slate-700/50' 
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                      onClick={() => setNewMachine({...newMachine, machineType: 'virtual'})}
                    >
                      <Cpu className={`h-5 w-5 mr-2 ${
                        newMachine.machineType === 'virtual' 
                          ? isDarkMode ? 'text-indigo-400' : 'text-indigo-600' 
                          : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        newMachine.machineType === 'virtual' 
                          ? isDarkMode ? 'text-indigo-300' : 'text-indigo-600' 
                          : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Virtual
                      </span>
                    </div>
                    
                    <div 
                      className={`flex items-center p-3 rounded-lg cursor-pointer border-2 ${
                        newMachine.machineType === 'cloud' 
                          ? isDarkMode 
                            ? 'border-indigo-500 bg-indigo-900/30' 
                            : 'border-indigo-500 bg-indigo-50' 
                          : isDarkMode 
                            ? 'border-slate-700 bg-slate-800 hover:bg-slate-700/50' 
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                      onClick={() => setNewMachine({...newMachine, machineType: 'cloud'})}
                    >
                      <Wifi className={`h-5 w-5 mr-2 ${
                        newMachine.machineType === 'cloud' 
                          ? isDarkMode ? 'text-indigo-400' : 'text-indigo-600' 
                          : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        newMachine.machineType === 'cloud' 
                          ? isDarkMode ? 'text-indigo-300' : 'text-indigo-600' 
                          : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Cloud
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={newMachine.ipAddress}
                    onChange={(e) => setNewMachine({...newMachine, ipAddress: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-800'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                    placeholder="192.168.1.100"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      CPU Cores
                    </label>
                    <input
                      type="number"
                      value={newMachine.cpuCores}
                      onChange={(e) => setNewMachine({...newMachine, cpuCores: parseInt(e.target.value) || 1})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-slate-300 text-slate-800'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Memory (GB)
                    </label>
                    <input
                      type="number"
                      value={newMachine.memoryGB}
                      onChange={(e) => setNewMachine({...newMachine, memoryGB: parseInt(e.target.value) || 1})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-slate-300 text-slate-800'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Disk (GB)
                    </label>
                    <input
                      type="number"
                      value={newMachine.diskGB}
                      onChange={(e) => setNewMachine({...newMachine, diskGB: parseInt(e.target.value) || 10})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-slate-300 text-slate-800'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                      min="10"
                    />
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
                  onClick={handleAddMachine}
                  disabled={addingMachine}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    isDarkMode
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  } transition-colors ${addingMachine ? 'opacity-75' : ''}`}
                >
                  {addingMachine ? (
                    <>
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Server className="mr-2 h-4 w-4" />
                      Add Machine
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

export default InfraManagement