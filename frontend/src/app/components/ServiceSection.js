"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Shield, Server, Clock, CheckCircle, Lock, Globe, Headphones } from 'lucide-react'
import Link from 'next/link'

const ServiceSection = () => {
  // State for tracking mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // State for tracking the cursor target position (with delay)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  // State to track which service is being hovered
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Reference to the section container
  const sectionRef = useRef(null);

  // Define the service offerings with their attributes
  const services = [
    {
      title: "Networking Firewall",
      description: "Enterprise-grade protection against threats with our advanced firewall solution",
      icon: <Shield className="w-12 h-12 text-red-500" />,
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    
    },
    {
      title: "Analysis Servers",
      description: "High-performance servers for real-time analytics and data processing",
      icon: <Server className="w-12 h-12 text-blue-500" />,
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    },
    {
      title: "Data Encryption",
      description: "End-to-end encryption to keep your data secure at rest and in transit",
      icon: <Lock className="w-12 h-12 text-blue-300" />,
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    },
    {
      title: "Data Protection",
      description: "Comprehensive data protection with automatic backups and retention policies",
      icon: <Shield className="w-12 h-12 text-blue-300" />,
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    },
    {
      title: "99.9% Uptime",
      description: "Guaranteed uptime for your mission-critical applications and websites",
      icon: <Clock className="w-12 h-12 text-blue-300" />,
      color: "bg-indigo-950",
      textColor: "text-blue-300",
      borderColor: "border-blue-900",
      iconBgColor: "bg-indigo-900"
    },
    {
      title: "Support Center",
      description: "24/7 expert support from our dedicated team of hosting specialists",
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

  // Effect to track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Effect to animate cursor with delay
  useEffect(() => {
    const animateCursor = () => {
      setCursorPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1
      }));
      requestAnimationFrame(animateCursor);
    };

    const animationId = requestAnimationFrame(animateCursor);
    return () => cancelAnimationFrame(animationId);
  }, [mousePosition]);
  
  return (
    <div className="py-16 bg-indigo-950 relative" ref={sectionRef}>
      {/* Custom cursor follower */}
      <div 
        className="w-12 h-12 rounded-full bg-blue-400/30 fixed pointer-events-none z-10 transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          left: `${cursorPosition.x}px`, 
          top: `${cursorPosition.y}px`,
          opacity: hoveredIndex !== null ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      >
        <div className="w-4 h-4 rounded-full bg-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section header */}
        <div className="text-center">
          <h5 className="text-lg font-medium text-blue-300 uppercase tracking-wide">
            SERVICE
          </h5>
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            What we are offering to<br />our customer
          </h2>
        </div>
        
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`rounded-3xl p-6 border ${service.borderColor} transition-all duration-300 hover:shadow-lg flex items-start space-x-4 relative overflow-hidden cursor-pointer ${
                hoveredIndex === index || index === 0 ? 'bg-blue-100' : service.color
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
                  hoveredIndex === index || index === 0 ? 'text-gray-800' : service.textColor
                }`}>
                  {service.title}
                </h3>
                <p className={`${
                  hoveredIndex === index || index === 0 ? 'text-gray-700' : 'text-blue-300/80'
                } text-sm`}>
                  {service.description}
                </p>
              </div>
              
              {/* Selected indicator (for first item or hovered item) */}
              {(index === 0 || hoveredIndex === index) && (
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-blue-400/30 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Feature list section */}
        <div className="bg-indigo-900/30 rounded-3xl py-10 px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              That's Exactly Why We Built Hostastra
            </h2>
            <p className="mt-4 text-xl text-blue-200">
              To give you the power of premium hosting, without the price tag or the painful setup.
              No need to install 10 plugins for security, caching, or backups.
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="flex-shrink-0 h-6 w-6 text-blue-400" />
                <p className="ml-3 text-base text-blue-100">{feature}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-xl font-semibold text-blue-300">Just deploy and go.</p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link href="/auth/login" className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 font-medium">
                Get Started Now
              </Link>
              <button className="px-8 py-3 bg-indigo-900 text-blue-300 border border-blue-800 rounded-lg shadow-sm hover:bg-indigo-800 transition-colors duration-300">
                View Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceSection;