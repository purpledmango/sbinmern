"use client"

import React, { useState, useEffect } from 'react'
import { Shield, Server, Clock, X, Check, RocketIcon, CloudOff, CloudCog, Wifi,  } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const ProblemStatement = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Auto-advance through the steps every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Define the three hosting options with their attributes
  const hostingOptions = [
    {
      title: "Shared Hosting",
      description: "Slow. Risky. Full of compromises.",
      icon: <CloudOff className="text-red-500 h-12 w-12" />,
      features: [
        { text: "Shared with hundreds of other sites", status: false },
        { text: "Unpredictable slowdowns", status: false },
        { text: "Security vulnerabilities", status: false },
        { text: "Limited resources", status: false },
        { text: "Basic support only", status: false }
      ],
      color: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      buttonColor: "bg-red-100",
      buttonTextColor: "text-red-700"
    },
    {
      title: "Dedicated Hosting",
      description: "Powerful. Expensive. Complex to manage.",
      icon: <Server className="text-yellow-500 h-12 w-12" />,
      features: [
        { text: "Full server resources", status: true },
        { text: "Consistent performance", status: true },
        { text: "Manual security setup", status: false },
        { text: "High monthly cost", status: false },
        { text: "Technical expertise required", status: false }
      ],
      color: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
      buttonColor: "bg-yellow-100",
      buttonTextColor: "text-yellow-700"
    },
    {
      title: "Hostastra Hosting",
      description: "Fast. Secure. Effortless. Affordable.",
      icon: <Wifi className="text-blue-500 h-12 w-12" />,
      features: [
        { text: "Dedicated resources - no sharing", status: true },
        { text: "Blazing fast performance", status: true },
        { text: "Built-in security & backups", status: true },
        { text: "Simple flat pricing", status: true },
        { text: "24/7 expert support", status: true }
      ],
      color: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-600",
      buttonTextColor: "text-white"
    }
  ];
  
  const currentOption = hostingOptions[activeStep];
  
  return (
    <div className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        {/* Problem headline */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            Why Compromise On Your Hosting?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Most hosting solutions force you to choose between performance, price, and simplicity.
            We're changing that with Hostastra.
          </p>
        </div>
        
        {/* Visual comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column - Hosting options */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex space-x-2 border-b border-gray-200 pb-2">
              {hostingOptions.map((option, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`py-3 px-4 rounded-t-lg font-medium transition-all duration-300 ${
                    activeStep === index 
                      ? `${option.color} ${option.textColor} border-b-2 ${option.borderColor}`
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {option.title}
                </button>
              ))}
            </div>
            
            <div className={`rounded-xl p-6 space-y-4 border transition-all duration-500 ${currentOption.color} ${currentOption.borderColor}`}>
              <div className="flex items-center space-x-4">
                {currentOption.icon}
                <div>
                  <h3 className="font-bold text-xl">{currentOption.title}</h3>
                  <p className={`${currentOption.textColor}`}>{currentOption.description}</p>
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                {currentOption.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {feature.status ? (
                      <Check className="text-green-500 flex-shrink-0" size={18} />
                    ) : (
                      <X className="text-red-500 flex-shrink-0" size={18} />
                    )}
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-200">
                <Link href="/auth/login"
                  className={`px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${currentOption.buttonColor} ${currentOption.buttonTextColor}`}
                >
                  {activeStep === 2 ? 'Get Started with Hostastra' : 'Learn More'}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right column - Visual illustration */}
          <div className="lg:col-span-6">
            <div className="relative h-96">
              {/* Background circles */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-100 opacity-50 blur-2xl" />
              <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-purple-100 opacity-50 blur-xl" />
              
              {/* Animated server rack visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                {activeStep === 0 && (
                  <div className="relative w-64 h-64">
                    {/* Shared hosting visualization */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-40 h-64 bg-gray-200 rounded-lg border border-gray-300 relative overflow-hidden">
                        {/* Server partitions */}
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-full h-8 border-b border-gray-300 flex items-center px-2">
                            <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-red-500' : 'bg-green-500'}`} />
                            <div className="w-full h-2 bg-gray-300 ml-2">
                              <div 
                                className={`h-full ${i % 3 === 0 ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${Math.random() * 70 + 20}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                        
                        {/* Warning indicators */}
                        <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                        <div className="absolute top-28 right-2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
                      </div>
                      <div className="mt-4 text-center text-gray-600">
                        <p>Your site is affected by neighbors</p>
                        <p className="text-red-500 text-sm">Shared resources, shared problems</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeStep === 1 && (
                  <div className="relative w-64 h-64">
                    {/* Dedicated hosting visualization */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-40 h-64 bg-gray-700 rounded-lg border border-gray-600 relative overflow-hidden flex flex-col space-y-2 p-2">
                        {/* Server racks */}
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-full h-10 bg-gray-800 rounded flex items-center justify-between px-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                            </div>
                            <div className="w-16 h-2 bg-gray-600">
                              <div className="h-full bg-blue-500" style={{ width: '90%' }} />
                            </div>
                          </div>
                        ))}
                        
                        {/* Control panel */}
                        <div className="absolute bottom-2 left-0 right-0 h-12 bg-gray-800 mx-2 rounded flex items-center justify-center">
                          <div className="text-xs text-gray-400">Command Center</div>
                          <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                      </div>
                      <div className="mt-4 text-center text-gray-600">
                        <p>Powerful but complex</p>
                        <p className="text-yellow-500 text-sm">Requires technical expertise</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeStep === 2 && (
                  <div className="relative w-64 h-64">
                    {/* Hostastra hosting visualization */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-40 h-64 bg-blue-600 rounded-lg border border-blue-400 relative overflow-hidden flex flex-col items-center justify-center">
                        {/* Pulsing effect for power */}
                        <div className="absolute inset-0 bg-blue-400 animate-pulse opacity-20" />
                        
                        {/* Simplified server indication */}
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30" />
                          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse" />
                          </div>
                        </div>
                        
                        {/* Performance indicators */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-2 h-8 bg-blue-300 rounded-full opacity-70">
                              <div 
                                className="w-full bg-white rounded-full animate-pulse" 
                                style={{ 
                                  height: '100%', 
                                  animationDuration: `${(i + 1) * 0.5}s`,
                                  animationDelay: `${i * 0.1}s`
                                }} 
                              />
                            </div>
                          ))}
                        </div>
                        
                        {/* Shield icon for security */}
                        <div className="absolute top-4 right-4">
                          <Shield className="text-white w-6 h-6" />
                        </div>
                      </div>
                      <div className="mt-4 text-center text-gray-600">
                        <p>Optimized performance</p>
                        <p className="text-blue-500 text-sm">Dedicated resources & simple management</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="text-center pt-6 pb-2">
          <h3 className="text-2xl font-bold text-blue-700">
            The Perfect Balance of Speed, Simplicity, and Savings
          </h3>
          <p className="mt-2 text-lg text-gray-600">
            Join thousands of websites running on Hostastra's optimized hosting platform
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link href='/auth/login' className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 font-medium">
              Get Started Now
            </Link>
            <button className="px-8 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 transition-colors duration-300">
              View Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemStatement