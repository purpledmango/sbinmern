"use client"

import React, { useState } from 'react'
import { Shield, Server, Clock, CheckCircle, Lock, Globe, Headphones, CpuIcon } from 'lucide-react'
import Link from 'next/link'

const ServiceSection = () => {
  // State to track which service is being hovered
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Define the service offerings with their attributes
  const services = [
    {
      title: "Instant WP Deployment",
      icon: <CpuIcon className="w-12 h-12 text-blue-500" />,
      description: " Launch your site in just a few clicks",
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    
    },
    {
      title: "Built-in Security",
      description: "No manual plugins — protection is pre-installed",
      icon: <Server className="w-12 h-12 text-blue-500" />,
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    },
    {
      title: "Automatic Daily Backups",
      description: " Your data stays safe and always recoverable.",
      icon: <Lock className="w-12 h-12 text-blue-300" />,
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    },
    {
      title: "Ultra-Fast Servers",
      description: " Premium speed with dedicated servers.",
      icon: <Shield className="w-12 h-12 text-blue-300" />,
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    },
    {
      title: "Predictable Pricing",
      description: "No hidden fees or surprise renewals.",
      icon: <Clock className="w-12 h-12 text-blue-300" />,
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    },
    {
      title: "24/7 Royal Support",
      description: "Talk to real experts anytime — no bots",
      icon: <Headphones className="w-12 h-12 text-blue-300" />,
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    }
  ];
  
  const features = [
    "Instant WP Deployment",
    "Built-in Security (No manual plugins)",
    "Automatic Daily Backups",
    "Premium Ultra-Fast Servers",
    "Local Language Support",
    "Predictable Pricing (No Surprise Renewals)",
    "Dedicated Resources (Not Shared)",
    "24/7 Royal Support"
  ];
  
  return (
    <div className="py-16 bg-indigo-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section header */}
        <div className="text-center">
          
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            Experience the Power of Premium Hosting
          </h2>

          <p className='text-slate-100'>Without the price tag or painful setup — no plugins needed, just deploy and go.
</p>
        </div>
        
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`rounded-3xl p-6 border ${service.borderColor} transition-all duration-300 hover:shadow-lg flex items-start space-x-4 relative overflow-hidden cursor-pointer ${
                hoveredIndex === index ? 'bg-blue-100' : service.color
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Service icon */}
              <div className={`rounded-xl p-2 ${service.iconBgColor}`}>
                {service.icon}
              </div>
              
              {/* Service content */}
              <div className="space-y-2">
                <h3 className={`font-bold text-xl ${
                  hoveredIndex === index ? 'text-gray-800' : service.textColor
                }`}>
                  {service.title}
                </h3>
                <p className={`${
                  hoveredIndex === index ? 'text-gray-700' : 'text-blue-300/80'
                } text-sm`}>
                  {service.description}
                </p>
              </div>
              
              {/* Selected indicator (for first item or hovered item) */}
              
            </div>
          ))}
        </div>

         <div className="mt-10 text-center">
            <p className="text-xl font-semibold text-blue-300">Just deploy and go.</p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link href="/auth/login" className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 font-medium">
                Get Started Now
              </Link>
              <Link href={"#pricing"} className="px-8 py-3 bg-indigo-900 text-blue-300 border border-blue-800 rounded-lg shadow-sm hover:bg-indigo-800 transition-colors duration-300">
                View Plans
              </Link>
            </div>
          </div>
        
        {/* Feature list section */}

      </div>
    </div>
  )
}

export default ServiceSection;