"use client"
import { CheckCircle, Settings, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Promo() {


  return (
    <div className="my-16 py-8 grid grid-cols-12 mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-l from-indigo-600">      
        <div className="col-span-12 lg:col-span-6 mb-8 lg:mb-0">
                
        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-semibold tracking-tight text-black-900">Launch at the Speed of a Warrior’s Strike</h2>
        <p className="text-xl font-base tracking-tight text-gray-600">
          No complex setup — just click, launch, and start building.
        </p>
      </div>
      
      <div className="col-span-12 lg:col-span-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Card 1 */}
          <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-indigo-600 transition-all hover:shadow-lg">
            <div className="p-6">
              <div className="bg-indigo-50 p-4 rounded-lg mb-4 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Choose a Plan</h3>
              <p className="text-gray-600 text-sm">
                Select the perfect plan that fits your project needs and budget.
              </p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-indigo-600 transition-all hover:shadow-lg">
            <div className="p-6">
              <div className="bg-indigo-50 p-4 rounded-lg mb-4 flex items-center justify-center">
                <Settings className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Setup in 15 Seconds</h3>
              <p className="text-gray-600 text-sm">
                Quick configuration with our streamlined setup process.
              </p>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-indigo-600 transition-all hover:shadow-lg">
            <div className="p-6">
              <div className="bg-indigo-50 p-4 rounded-lg mb-4 flex items-center justify-center">
                <Rocket className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Go Live in 60 Seconds</h3>
              <p className="text-gray-600 text-sm">
                Deploy instantly and start seeing results right away.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}